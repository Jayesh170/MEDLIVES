import kafka, { CONSUMER_GROUPS, KAFKA_TOPICS } from '../config/kafka.js';

class NotificationConsumer {
  constructor() {
    this.consumer = null;
    this.isRunning = false;
  }

  /**
   * Start the consumer
   */
  async start() {
    try {
      this.consumer = kafka.consumer({
        groupId: CONSUMER_GROUPS.NOTIFICATION,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxInFlightRequests: 1,
        allowAutoTopicCreation: false,
      });

      await this.consumer.connect();
      console.log('✅ Notification consumer connected');

      // Subscribe to topics
      await this.consumer.subscribe({
        topics: [KAFKA_TOPICS.ORDER_EVENTS, KAFKA_TOPICS.STATUS_UPDATES],
        fromBeginning: false,
      });

      this.isRunning = true;

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            console.log(`📨 Notification consumer received ${event.eventType} from ${topic}`);

            if (topic === KAFKA_TOPICS.ORDER_EVENTS) {
              await this.handleOrderEvent(event);
            } else if (topic === KAFKA_TOPICS.STATUS_UPDATES) {
              await this.handleStatusUpdate(event);
            }
          } catch (error) {
            console.error('❌ Error processing notification message:', error);
            // Continue processing other messages
          }
        },
      });
    } catch (error) {
      console.error('❌ Error starting notification consumer:', error);
      throw error;
    }
  }

  /**
   * Handle order events and send notifications
   */
  async handleOrderEvent(event) {
    try {
      const { eventType, data, orderId } = event;

      switch (eventType) {
        case 'order.created':
          await this.sendOrderConfirmation(data, orderId);
          break;

        case 'order.updated':
          await this.sendOrderUpdateNotification(data, orderId);
          break;

        case 'order.deleted':
          await this.sendOrderCancellationNotification(data, orderId);
          break;

        default:
          console.warn(`⚠️  Unknown event type for notification: ${eventType}`);
      }
    } catch (error) {
      console.error('❌ Error handling order event for notification:', error);
      // Don't throw - allow processing to continue
    }
  }

  /**
   * Handle status update events and send notifications
   */
  async handleStatusUpdate(event) {
    try {
      const { orderId, oldStatus, newStatus, data } = event;

      await this.sendStatusUpdateNotification(orderId, oldStatus, newStatus, data);
    } catch (error) {
      console.error('❌ Error handling status update for notification:', error);
    }
  }

  /**
   * Send order confirmation notification
   */
  async sendOrderConfirmation(orderData, orderId) {
    try {
      const { customerName, contactNumber, totalAmount, status } = orderData;

      // TODO: Integrate with SMS/Email service
      // For now, just log the notification
      console.log(`📱 [SMS] Order Confirmation to ${contactNumber}:`);
      console.log(`   Order ${orderId} created successfully. Amount: ₹${totalAmount}. Status: ${status}`);

      // Example: Send SMS via external API
      // await smsService.send(contactNumber, `Order ${orderId} created. Amount: ₹${totalAmount}`);

      // Example: Send Email
      // await emailService.send(orderData.email, 'Order Confirmation', `Order ${orderId} created...`);

      // Example: Send Push Notification
      // await pushNotificationService.send(customerId, 'Order Created', `Order ${orderId} created successfully`);

      console.log(`✅ Sent order confirmation notification for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error sending order confirmation:', error);
      // In production, you might want to retry or send to dead letter queue
    }
  }

  /**
   * Send order update notification
   */
  async sendOrderUpdateNotification(orderData, orderId) {
    try {
      const { contactNumber } = orderData;

      console.log(`📱 [SMS] Order Update to ${contactNumber}:`);
      console.log(`   Order ${orderId} has been updated.`);

      // TODO: Implement actual SMS/Email/Push notification
      console.log(`✅ Sent order update notification for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error sending order update notification:', error);
    }
  }

  /**
   * Send order cancellation notification
   */
  async sendOrderCancellationNotification(orderData, orderId) {
    try {
      const { contactNumber } = orderData;

      console.log(`📱 [SMS] Order Cancellation to ${contactNumber}:`);
      console.log(`   Order ${orderId} has been cancelled.`);

      // TODO: Implement actual SMS/Email/Push notification
      console.log(`✅ Sent order cancellation notification for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error sending order cancellation notification:', error);
    }
  }

  /**
   * Send status update notification
   */
  async sendStatusUpdateNotification(orderId, oldStatus, newStatus, orderData) {
    try {
      const contactNumber = orderData?.contactNumber || 'N/A';

      const statusMessages = {
        pending: 'is pending payment',
        paid: 'has been paid and confirmed',
        credit: 'is on credit',
      };

      const message = `Order ${orderId} ${statusMessages[newStatus] || `status changed to ${newStatus}`}`;

      console.log(`📱 [SMS] Status Update to ${contactNumber}:`);
      console.log(`   ${message}`);

      // TODO: Implement actual SMS/Email/Push notification
      // await smsService.send(contactNumber, message);

      console.log(`✅ Sent status update notification: ${oldStatus} → ${newStatus} for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error sending status update notification:', error);
    }
  }

  /**
   * Stop the consumer
   */
  async stop() {
    try {
      this.isRunning = false;

      if (this.consumer) {
        await this.consumer.disconnect();
        console.log('✅ Notification consumer disconnected');
      }
    } catch (error) {
      console.error('❌ Error stopping notification consumer:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      running: this.isRunning,
      status: this.isRunning ? 'healthy' : 'stopped',
    };
  }
}

// Export singleton instance
export const notificationConsumer = new NotificationConsumer();

