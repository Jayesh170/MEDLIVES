# Kafka Setup Guide for MEDLIVES

This guide will help you set up and run Kafka for the MEDLIVES application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed
- npm or yarn package manager

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd Medlives-backend
npm install
```

This will install `kafkajs` and other required dependencies.

### Step 2: Start Kafka Infrastructure

Start Kafka and Zookeeper using Docker Compose:

```bash
npm run kafka:up
```

Or manually:
```bash
docker-compose up -d
```

This will start:
- **Zookeeper** on port `2181`
- **Kafka** on port `9092`

Verify Kafka is running:
```bash
docker ps
```

You should see `medlives-zookeeper` and `medlives-kafka` containers running.

### Step 3: Create Kafka Topics

After Kafka is running, create the required topics:

```bash
npm run setup-kafka
```

Or manually:
```bash
node src/scripts/setupKafkaTopics.js
```

This will create:
- `order-events` (6 partitions)
- `status-updates` (4 partitions)
- `delivery-tracking` (8 partitions)

### Step 4: Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` and ensure `KAFKA_BROKERS` is set:
```
KAFKA_BROKERS=localhost:9092
```

### Step 5: Start the Backend Server

Start the backend server:

```bash
npm run dev
```

The server will:
1. Connect to MongoDB
2. Connect to Kafka producer
3. Start order persistence consumer
4. Start notification consumer

You should see logs like:
```
✅ MongoDB connected
✅ Kafka producer connected
✅ Order persistence consumer connected
✅ Notification consumer connected
🚀 Server running on port 5000
```

## Verifying Kafka Setup

### Check Health Endpoint

```bash
curl http://localhost:5000/health
```

This will show the status of Kafka and all consumers.

### View Kafka Logs

```bash
npm run kafka:logs
```

Or:
```bash
docker-compose logs -f kafka
```

### Test Order Creation

Create an order through your API. You should see:
1. Order created in MongoDB (dual-write mode)
2. Event published to Kafka `order-events` topic
3. Order persistence consumer processes the event
4. Notification consumer sends notification

## Kafka UI (Optional)

To monitor Kafka topics and messages visually, uncomment the `kafka-ui` service in `docker-compose.yml`:

```yaml
kafka-ui:
  image: provectuslabs/kafka-ui:latest
  # ... rest of config
```

Then restart:
```bash
docker-compose up -d
```

Access Kafka UI at: http://localhost:8080

## Troubleshooting

### Kafka Connection Failed

**Error:** `Connection timeout` or `ECONNREFUSED`

**Solution:**
1. Verify Kafka is running: `docker ps`
2. Check Kafka logs: `npm run kafka:logs`
3. Ensure `KAFKA_BROKERS=localhost:9092` in `.env`

### Topics Not Found

**Error:** `Topic does not exist`

**Solution:**
1. Run topic setup: `npm run setup-kafka`
2. Verify topics exist: Check Kafka UI or use Kafka CLI tools

### Consumer Not Processing Messages

**Symptoms:** Messages in Kafka but not being consumed

**Solution:**
1. Check consumer logs in server output
2. Verify consumer is connected: Check `/health` endpoint
3. Check consumer group status in Kafka UI

### Port Already in Use

**Error:** `Port 9092 already in use`

**Solution:**
1. Stop existing Kafka: `docker-compose down`
2. Or change port in `docker-compose.yml`

## Production Considerations

For production deployment:

1. **Kafka Cluster:** Use at least 3 Kafka brokers for redundancy
2. **Replication Factor:** Set replication factor to 3 in topic configuration
3. **Authentication:** Enable SASL/SSL authentication
4. **Monitoring:** Set up Prometheus + Grafana for metrics
5. **Backup:** Configure Kafka log retention and backup strategy

Update `src/config/kafka.js` for production:
```javascript
const kafka = new Kafka({
  clientId: 'medlives-backend',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});
```

## Useful Commands

```bash
# Start Kafka
npm run kafka:up

# Stop Kafka
npm run kafka:down

# View Kafka logs
npm run kafka:logs

# Setup topics
npm run setup-kafka

# Start backend (with Kafka consumers)
npm run dev

# Check health
curl http://localhost:5000/health
```

## Architecture Overview

```
Mobile App → Express API → Kafka → Consumers → MongoDB/Notifications
                ↓
           (Dual-write mode during migration)
```

**Current Flow:**
1. Order created → Saved to MongoDB (immediate)
2. Order event → Published to Kafka (async)
3. Consumer → Reads from Kafka → Processes batch
4. Notification → Sent to customer

**Future Flow (after migration):**
1. Order created → Published to Kafka only
2. Consumer → Reads from Kafka → Saves to MongoDB
3. Notification → Sent to customer

## Next Steps

1. Monitor consumer lag and performance
2. Gradually remove direct MongoDB writes from controllers
3. Add analytics consumer for business intelligence
4. Implement dead letter queue for failed messages
5. Add retry logic for failed notifications

