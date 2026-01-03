# Environment Variables Setup Guide

## Overview
This project requires **2 separate `.env` files** because:
1. **Frontend (Expo)** runs from the root directory and needs API URL configuration
2. **Backend (Node.js)** runs from `Medlives-backend` directory and needs server configuration

---

## 📁 File Locations

### 1. Frontend `.env` (Root Directory)
**Location:** `D:\APP\Omkar Medical\updated_Medlives\MEDLIVES\.env`

**Purpose:** Configures the Expo app to connect to the backend API

**Required Variables:**
```env
EXPO_PUBLIC_API_URL=http://10.132.174.158:5000/api
```

**Notes:**
- Must use `EXPO_PUBLIC_` prefix for Expo to expose it to the app
- Update IP address if your computer's IP changes
- For Android Emulator: Use `http://10.0.2.2:5000/api`
- For iOS Simulator: Use `http://localhost:5000/api`

---

### 2. Backend `.env` (Backend Directory)
**Location:** `D:\APP\Omkar Medical\updated_Medlives\MEDLIVES\Medlives-backend\.env`

**Purpose:** Configures the Node.js backend server

**Required Variables:**
```env
PORT=5000
MONGO_URI=mongodb+srv://medlives:uSylyUVsjIgbBMmb@cluster1.ylwbhmp.mongodb.net/medlives
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
OTP_EXPIRY_MIN=5
ALLOWED_ORIGINS=
```

**Notes:**
- Backend automatically loads `.env` from its own directory
- `dotenv.config()` is configured to look in `Medlives-backend/.env`
- Change `JWT_SECRET` to a strong random string in production

---

## 🚀 Quick Setup

### Create Frontend `.env`:
```powershell
# From project root
@"
EXPO_PUBLIC_API_URL=http://10.132.174.158:5000/api
"@ | Out-File -FilePath ".env" -Encoding utf8
```

### Create Backend `.env`:
```powershell
# From project root
@"
PORT=5000
MONGO_URI=mongodb+srv://medlives:uSylyUVsjIgbBMmb@cluster1.ylwbhmp.mongodb.net/medlives
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
OTP_EXPIRY_MIN=5
ALLOWED_ORIGINS=
"@ | Out-File -FilePath "Medlives-backend\.env" -Encoding utf8
```

---

## 🔍 How It Works

### Frontend (Expo):
- Reads `EXPO_PUBLIC_API_URL` from root `.env` file
- Used by: `src/services/api.ts`, `src/services/otpApi.ts`, `src/services/registrationApi.ts`
- Automatically loaded by Expo when app starts

### Backend (Node.js):
- Reads variables from `Medlives-backend/.env` file
- Loaded via `dotenv.config({ path: join(__dirname, ".env") })` in `server.js`
- Used for: MongoDB connection, JWT secrets, server port, etc.

---

## ✅ Verification

### Check Frontend:
1. Start Expo: `npx expo start --clear`
2. Look for console log: `Using API URL from environment: http://...`

### Check Backend:
1. Start backend: `cd Medlives-backend && npm run dev`
2. Look for: `🚀 Server running on port 5000`
3. Look for: `✅ MongoDB connected`

---

## 🔄 After Changes

**Frontend:** Restart Expo with `--clear` flag:
```bash
npx expo start --clear
```

**Backend:** Restart the server:
```bash
cd Medlives-backend
npm run dev
```

---

## 📝 Finding Your IP Address

**Windows:**
```powershell
ipconfig | findstr /i "IPv4"
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

Update `EXPO_PUBLIC_API_URL` in root `.env` if your IP changes.

