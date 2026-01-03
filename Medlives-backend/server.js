import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Kafka services
import { kafkaProducer } from "./src/services/kafkaProducer.js";
import { orderPersistenceConsumer } from "./src/consumers/orderPersistenceConsumer.js";
import { notificationConsumer } from "./src/consumers/notificationConsumer.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
const envPath = join(__dirname, ".env");
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

// Verify critical environment variables are loaded
console.log("Environment variables loaded:");
console.log("- PORT:", process.env.PORT || "5000 (default)");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ NOT SET");
console.log("- MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ NOT SET");
console.log("- KAFKA_BROKERS:", process.env.KAFKA_BROKERS || "localhost:9092 (default)");
console.log("- OTP_EXPIRY_MIN:", process.env.OTP_EXPIRY_MIN || "5 (default)");

if (!process.env.JWT_SECRET) {
  console.error("⚠️ WARNING: JWT_SECRET is not set! Authentication will fail.");
  console.error("Please create a .env file in the Medlives-backend directory with JWT_SECRET");
}

const app = express();

// Middleware
// CORS configuration (global)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) or if no ALLOWED_ORIGINS specified
    if (!origin || allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // cache preflight for 24h
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const kafkaHealth = await kafkaProducer.healthCheck();
    const orderConsumerHealth = await orderPersistenceConsumer.healthCheck();
    const notificationConsumerHealth = await notificationConsumer.healthCheck();

    res.json({
      status: "healthy",
      services: {
        kafka: kafkaHealth,
        orderPersistenceConsumer: orderConsumerHealth,
        notificationConsumer: notificationConsumerHealth,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

// Initialize Kafka and start consumers
async function initializeKafka() {
  try {
    // Connect Kafka producer
    await kafkaProducer.connect();

    // Start consumers
    // Note: Consumers will run in background and process messages asynchronously
    orderPersistenceConsumer.start().catch((error) => {
      console.error("❌ Failed to start order persistence consumer:", error);
    });

    notificationConsumer.start().catch((error) => {
      console.error("❌ Failed to start notification consumer:", error);
    });

    console.log("✅ Kafka services initialized");
  } catch (error) {
    console.error("❌ Error initializing Kafka:", error);
    // Don't exit - allow server to start even if Kafka fails
    // Kafka will retry connection automatically
  }
}

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  try {
    // Stop accepting new requests
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          console.log("✅ HTTP server closed");
          resolve();
        });
      });
    }

    // Stop Kafka consumers
    await orderPersistenceConsumer.stop();
    await notificationConsumer.stop();

    // Disconnect Kafka producer
    await kafkaProducer.disconnect();

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// MongoDB connection
let server;
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://medlives:uSylyUVsjIgbBMmb@cluster1.ylwbhmp.mongodb.net/medlives", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    
    // Initialize Kafka after MongoDB is connected
    await initializeKafka();
    
    // Start server only after DB connects
    server = app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
      console.log(`📊 Health check: http://localhost:${process.env.PORT || 5000}/health`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
