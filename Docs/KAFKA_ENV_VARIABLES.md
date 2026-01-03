# Kafka Environment Variables

Add these variables to your `.env` file in the `Medlives-backend` directory.

## Required Variables

```bash
# Kafka Configuration
# Comma-separated list of Kafka broker addresses
# For local development with Docker Compose:
KAFKA_BROKERS=localhost:9092

# For production (multiple brokers for redundancy):
# KAFKA_BROKERS=kafka-1:9092,kafka-2:9092,kafka-3:9092
```

## Optional Variables (for Production)

```bash
# Kafka Authentication (SASL/SSL)
# Uncomment and configure for production:
# KAFKA_USERNAME=your-kafka-username
# KAFKA_PASSWORD=your-kafka-password

# Consumer Configuration (optional, defaults provided in code)
# KAFKA_CONSUMER_BATCH_SIZE=100
# KAFKA_CONSUMER_BATCH_INTERVAL=5000
```

## Example Complete .env File

```bash
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb+srv://medlives:uSylyUVsjIgbBMmb@cluster1.ylwbhmp.mongodb.net/medlives

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# OTP Configuration
OTP_EXPIRY_MIN=5

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
```

## Quick Setup

1. Open your `.env` file in `Medlives-backend` directory
2. Add the `KAFKA_BROKERS` line:
   ```
   KAFKA_BROKERS=localhost:9092
   ```
3. Save the file
4. Restart your server

That's it! The Kafka integration will use `localhost:9092` for local development.

