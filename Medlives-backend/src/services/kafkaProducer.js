import { producer, KAFKA_TOPICS } from '../config/kafka.js';

class KafkaProducerService {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to Kafka broker
   */
  async connect() {
    try {
      if (!this.isConnected) {
        await producer.connect();
        this.isConnected = true;
        console.log('✅ Kafka producer connected');
      }
    } catch (error) {
      console.error('❌ Kafka producer connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka broker
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await producer.disconnect();
        this.isConnected = false;
        console.log('✅ Kafka producer disconnected');
      }
    } catch (error) {
      console.error('❌ Kafka producer disconnection error:', error);
      throw error;
    }
  }

  /**
   * Publish order event to Kafka
   * @param {string} eventType - Type of event (order.created, order.updated, order.deleted)
   * @param {Object} orderData - Order data to publish
   * @param {number} tenantCode - Tenant code for partitioning
   */
  async publishOrderEvent(eventType, orderData, tenantCode) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const event = {
        eventType,
        orderId: orderData.orderId || orderData._id?.toString(),
        tenantCode: tenantCode || orderData.tenantCode,
        timestamp: new Date().toISOString(),
        data: {
          ...orderData,
          // Convert Mongoose document to plain object if needed
          _id: orderData._id?.toString() || orderData._id,
        },
      };

      // Partition key ensures orders from same tenant go to same partition
      const partitionKey = String(tenantCode || orderData.tenantCode);

      await producer.send({
        topic: KAFKA_TOPICS.ORDER_EVENTS,
        messages: [
          {
            key: partitionKey,
            value: JSON.stringify(event),
            headers: {
              eventType,
              tenantCode: String(tenantCode || orderData.tenantCode),
            },
          },
        ],
      });

      console.log(`✅ Published ${eventType} event for order ${event.orderId}`);
    } catch (error) {
      console.error(`❌ Error publishing order event (${eventType}):`, error);
      // Don't throw - allow API to continue even if Kafka fails
      // In production, you might want to implement retry logic or dead letter queue
    }
  }

  /**
   * Publish status update event to Kafka
   * @param {Object} statusData - Status update data
   * @param {number} tenantCode - Tenant code for partitioning
   */
  async publishStatusUpdate(statusData, tenantCode) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const event = {
        eventType: 'status.changed',
        orderId: statusData.orderId || statusData._id?.toString(),
        tenantCode: tenantCode || statusData.tenantCode,
        oldStatus: statusData.oldStatus,
        newStatus: statusData.newStatus,
        changedBy: statusData.changedBy || statusData.userId,
        timestamp: new Date().toISOString(),
        reason: statusData.reason || '',
      };

      const partitionKey = String(tenantCode || statusData.tenantCode);

      await producer.send({
        topic: KAFKA_TOPICS.STATUS_UPDATES,
        messages: [
          {
            key: partitionKey,
            value: JSON.stringify(event),
            headers: {
              eventType: 'status.changed',
              tenantCode: String(tenantCode || statusData.tenantCode),
            },
          },
        ],
      });

      console.log(`✅ Published status update: ${event.oldStatus} → ${event.newStatus} for order ${event.orderId}`);
    } catch (error) {
      console.error('❌ Error publishing status update:', error);
      // Don't throw - allow API to continue
    }
  }

  /**
   * Health check for Kafka producer
   */
  async healthCheck() {
    try {
      return {
        connected: this.isConnected,
        status: this.isConnected ? 'healthy' : 'disconnected',
      };
    } catch (error) {
      return {
        connected: false,
        status: 'error',
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export const kafkaProducer = new KafkaProducerService();

