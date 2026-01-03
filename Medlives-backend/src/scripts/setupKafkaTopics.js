import { admin, KAFKA_TOPICS } from '../config/kafka.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');
dotenv.config({ path: envPath });

/**
 * Setup Kafka topics with proper configuration
 */
async function setupTopics() {
  try {
    console.log('🔌 Connecting to Kafka admin...');
    await admin.connect();
    console.log('✅ Connected to Kafka admin');

    const topics = [
      {
        topic: KAFKA_TOPICS.ORDER_EVENTS,
        numPartitions: 6,
        replicationFactor: 1, // Use 3 in production
        configEntries: [
          { name: 'retention.ms', value: '604800000' }, // 7 days
          { name: 'compression.type', value: 'gzip' },
          { name: 'cleanup.policy', value: 'delete' },
        ],
      },
      {
        topic: KAFKA_TOPICS.STATUS_UPDATES,
        numPartitions: 4,
        replicationFactor: 1, // Use 3 in production
        configEntries: [
          { name: 'retention.ms', value: '604800000' }, // 7 days
          { name: 'compression.type', value: 'gzip' },
          { name: 'cleanup.policy', value: 'delete' },
        ],
      },
      {
        topic: KAFKA_TOPICS.DELIVERY_TRACKING,
        numPartitions: 8,
        replicationFactor: 1, // Use 3 in production
        configEntries: [
          { name: 'retention.ms', value: '86400000' }, // 1 day
          { name: 'compression.type', value: 'lz4' },
          { name: 'cleanup.policy', value: 'delete' },
        ],
      },
    ];

    console.log('\n📝 Creating topics...');
    const existingTopics = await admin.listTopics();
    console.log('Existing topics:', existingTopics);

    for (const topicConfig of topics) {
      if (existingTopics.includes(topicConfig.topic)) {
        console.log(`⏭️  Topic "${topicConfig.topic}" already exists, skipping...`);
        continue;
      }

      try {
        await admin.createTopics({
          topics: [topicConfig],
          waitForLeaders: true,
        });
        console.log(`✅ Created topic: ${topicConfig.topic} (${topicConfig.numPartitions} partitions)`);
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Topic "${topicConfig.topic}" already exists`);
        } else {
          console.error(`❌ Error creating topic "${topicConfig.topic}":`, error.message);
        }
      }
    }

    // List all topics to verify
    console.log('\n📋 Current topics:');
    const allTopics = await admin.listTopics();
    allTopics.forEach((topic) => {
      console.log(`  - ${topic}`);
    });

    console.log('\n✅ Kafka topics setup completed!');
  } catch (error) {
    console.error('❌ Error setting up Kafka topics:', error);
    process.exit(1);
  } finally {
    await admin.disconnect();
    console.log('🔌 Disconnected from Kafka admin');
  }
}

// Run setup if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTopics()
    .then(() => {
      console.log('🎉 Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export default setupTopics;

