# Updated Environment Files Guide

## 📁 Two .env Files Required

This project needs **2 separate `.env` files**:

### 1. Frontend `.env` (Root Directory)
**Location:** `MEDLIVES/.env`

**Contents:**
```env
EXPO_PUBLIC_API_URL=http://10.132.174.158:5000/api
```

**Purpose:** Configures Expo app to connect to backend API

---

### 2. Backend `.env` (Backend Directory) ⭐ **UPDATED WITH KAFKA**
**Location:** `MEDLIVES/Medlives-backend/.env`

**Contents:**
```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb+srv://medlives:uSylyUVsjIgbBMmb@cluster1.ylwbhmp.mongodb.net/medlives

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

# OTP Configuration
OTP_EXPIRY_MIN=5

# CORS Configuration
ALLOWED_ORIGINS=

# Kafka Configuration ⭐ NEW
KAFKA_BROKERS=localhost:9092
```

**Purpose:** Configures backend server, database, and Kafka

---

## 🚀 Quick Setup

### Option 1: Copy the Updated Files

I've created two template files:
- `MEDLIVES/.env.updated` - Frontend template
- `MEDLIVES/Medlives-backend/.env.updated` - Backend template (with Kafka)

Copy them to replace your existing `.env` files:

**Windows PowerShell:**
```powershell
# Copy frontend .env
Copy-Item ".env.updated" ".env" -Force

# Copy backend .env
Copy-Item "Medlives-backend\.env.updated" "Medlives-backend\.env" -Force
```

**Linux/Mac:**
```bash
# Copy frontend .env
cp .env.updated .env

# Copy backend .env
cp Medlives-backend/.env.updated Medlives-backend/.env
```

### Option 2: Manual Update

**For Frontend `.env` (MEDLIVES/.env):**
Just ensure you have:
```env
EXPO_PUBLIC_API_URL=http://10.132.174.158:5000/api
```

**For Backend `.env` (MEDLIVES/Medlives-backend/.env):**
Add this line to your existing backend .env:
```env
KAFKA_BROKERS=localhost:9092
```

---

## ✅ What Changed?

### Frontend `.env`
- No changes needed (just API URL)

### Backend `.env` ⭐
- **Added:** `KAFKA_BROKERS=localhost:9092`
- This enables Kafka integration for event-driven architecture

---

## 🔍 Verify Setup

### Check Frontend:
```bash
# Start Expo
npx expo start --clear

# Look for: "Using API URL from environment: http://..."
```

### Check Backend:
```bash
cd Medlives-backend
npm run dev

# Look for:
# ✅ MongoDB connected
# ✅ Kafka producer connected
# ✅ Order persistence consumer connected
# ✅ Notification consumer connected
# 🚀 Server running on port 5000
```

### Check Health:
```bash
curl http://localhost:5000/health
```

Should show Kafka and consumer status.

---

## 📝 Important Notes

1. **Update IP Address:** Change `10.132.174.158` in frontend `.env` to your current IP
2. **Kafka Required:** Backend needs Kafka running (`npm run kafka:up`)
3. **JWT Secret:** Change `JWT_SECRET` in production
4. **Kafka Brokers:** For production, use multiple brokers: `kafka-1:9092,kafka-2:9092,kafka-3:9092`

---

## 🎯 Next Steps

1. ✅ Update both `.env` files
2. ✅ Start Kafka: `cd Medlives-backend && npm run kafka:up`
3. ✅ Create topics: `cd Medlives-backend && npm run setup-kafka`
4. ✅ Start backend: `cd Medlives-backend && npm run dev`
5. ✅ Start frontend: `npx expo start --clear`

---

**Files Created:**
- `.env.updated` - Frontend template
- `Medlives-backend/.env.updated` - Backend template with Kafka
- `ENV_FILES_GUIDE.md` - This guide

