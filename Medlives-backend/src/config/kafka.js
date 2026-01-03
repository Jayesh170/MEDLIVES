import { Kafka } from 'kafkajs';

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'medlives-backend',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
  // Optional: Add authentication for production
  // ssl: true,
  // sasl: {
  //   mechanism: 'plain',
  //   username: process.env.KAFKA_USERNAME,
  //   password: process.env.KAFKA_PASSWORD,
  // },
});

// Create producer instance
export const producer = kafka.producer({
  allowAutoTopicCreation: false, // Topics should be created explicitly
  maxInFlightRequests: 1,
  idempotent: true, // Ensures exactly-once semantics
  transactionTimeout: 30000,
});

// Create admin client for topic management
export const admin = kafka.admin();

// Kafka topics configuration
export const KAFKA_TOPICS = {
  ORDER_EVENTS: 'order-events',
  STATUS_UPDATES: 'status-updates',
  DELIVERY_TRACKING: 'delivery-tracking', // Future use
};

// Consumer group IDs
export const CONSUMER_GROUPS = {
  ORDER_PERSISTENCE: 'order-persistence-service',
  NOTIFICATION: 'notification-service',
  ANALYTICS: 'analytics-service', // Future use
};

export default kafka;

