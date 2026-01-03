import kafka, { CONSUMER_GROUPS, KAFKA_TOPICS } from '../config/kafka.js';
import Order from '../models/Order.js';

class OrderPersistenceConsumer {
  constructor() {
    this.consumer = null;
    this.isRunning = false;
    this.batchBuffer = [];
    this.batchSize = 100;
    this.batchInterval = 5000; // 5 seconds
    this.batchTimer = null;
  }

  /**
   * Start the consumer
   */
  async start() {
    try {
      this.consumer = kafka.consumer({
        groupId: CONSUMER_GROUPS.ORDER_PERSISTENCE,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxInFlightRequests: 1,
        allowAutoTopicCreation: false,
      });

      await this.consumer.connect();
      console.log('✅ Order persistence consumer connected');

      // Subscribe to topics
      await this.consumer.subscribe({
        topics: [KAFKA_TOPICS.ORDER_EVENTS, KAFKA_TOPICS.STATUS_UPDATES],
        fromBeginning: false, // Start from latest messages
      });

      this.isRunning = true;
      this.startBatchTimer();

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            console.log(`📨 Received ${event.eventType} from ${topic} partition ${partition}`);

            if (topic === KAFKA_TOPICS.ORDER_EVENTS) {
              await this.handleOrderEvent(event);
            } else if (topic === KAFKA_TOPICS.STATUS_UPDATES) {
              await this.handleStatusUpdate(event);
            }
          } catch (error) {
            console.error('❌ Error processing message:', error);
            // Continue processing other messages
          }
        },
      });
    } catch (error) {
      console.error('❌ Error starting order persistence consumer:', error);
      throw error;
    }
  }

  /**
   * Handle order events (created, updated, deleted)
   */
  async handleOrderEvent(event) {
    try {
      const { eventType, data, orderId, tenantCode } = event;

      switch (eventType) {
        case 'order.created':
          // Check if order already exists (idempotency)
          const existingOrder = await Order.findOne({ orderId, tenantCode });
          if (existingOrder) {
            console.log(`⏭️  Order ${orderId} already exists, skipping...`);
            return;
          }

          // Add to batch buffer
          this.batchBuffer.push({
            type: 'create',
            data: {
              ...data,
              orderId,
              tenantCode,
            },
          });

          // Process batch if buffer is full
          if (this.batchBuffer.length >= this.batchSize) {
            await this.processBatch();
          }
          break;

        case 'order.updated':
          // Update order immediately (not batched for consistency)
          await Order.findOneAndUpdate(
            { orderId, tenantCode },
            { ...data },
            { new: true, upsert: false }
          );
          console.log(`✅ Updated order ${orderId}`);
          break;

        case 'order.deleted':
          // Delete order immediately
          await Order.findOneAndDelete({ orderId, tenantCode });
          console.log(`✅ Deleted order ${orderId}`);
          break;

        default:
          console.warn(`⚠️  Unknown event type: ${eventType}`);
      }
    } catch (error) {
      console.error('❌ Error handling order event:', error);
      throw error;
    }
  }

  /**
   * Handle status update events
   */
  async handleStatusUpdate(event) {
    try {
      const { orderId, tenantCode, newStatus } = event;

      // Update order status immediately
      await Order.findOneAndUpdate(
        { orderId, tenantCode },
        { status: newStatus },
        { new: true }
      );

      console.log(`✅ Updated order ${orderId} status to ${newStatus}`);
    } catch (error) {
      console.error('❌ Error handling status update:', error);
      throw error;
    }
  }

  /**
   * Process batch of orders
   */
  async processBatch() {
    if (this.batchBuffer.length === 0) return;

    const ordersToCreate = this.batchBuffer.filter((item) => item.type === 'create');
    this.batchBuffer = [];

    if (ordersToCreate.length === 0) return;

    try {
      // Bulk insert orders
      const orders = ordersToCreate.map((item) => item.data);
      await Order.insertMany(orders, { ordered: false }); // ordered: false allows partial success

      console.log(`✅ Batch inserted ${orders.length} orders to MongoDB`);
    } catch (error) {
      console.error('❌ Error batch inserting orders:', error);
      // In production, you might want to send failed orders to a dead letter queue
    }
  }

  /**
   * Start batch timer
   */
  startBatchTimer() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(async () => {
      if (this.batchBuffer.length > 0) {
        await this.processBatch();
      }
    }, this.batchInterval);
  }

  /**
   * Stop the consumer
   */
  async stop() {
    try {
      this.isRunning = false;

      // Process any remaining batch
      if (this.batchBuffer.length > 0) {
        await this.processBatch();
      }

      // Clear batch timer
      if (this.batchTimer) {
        clearInterval(this.batchTimer);
        this.batchTimer = null;
      }

      if (this.consumer) {
        await this.consumer.disconnect();
        console.log('✅ Order persistence consumer disconnected');
      }
    } catch (error) {
      console.error('❌ Error stopping order persistence consumer:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      running: this.isRunning,
      batchBufferSize: this.batchBuffer.length,
      status: this.isRunning ? 'healthy' : 'stopped',
    };
  }
}

// Export singleton instance
export const orderPersistenceConsumer = new OrderPersistenceConsumer();

