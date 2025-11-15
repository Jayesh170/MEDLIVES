# MEDLIVES - Project Resource Documentation

[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey)](https://github.com)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Core Features](#core-features)
4. [User Flow & Navigation](#user-flow--navigation)
5. [Technical Implementation](#technical-implementation)
6. [Data Models](#data-models)
7. [Authentication System](#authentication-system)
8. [Order Management System](#order-management-system)
9. [Multi-Tenant Architecture](#multi-tenant-architecture)
10. [Delivery Management](#delivery-management)
11. [API Architecture](#api-architecture)
12. [Database Design](#database-design)
13. [User Interface](#user-interface)
14. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

### What is MEDLIVES?

**MEDLIVES** (also known as **MedDel**) is a comprehensive **Medical Pharmacy Order and Delivery Management System** designed to digitize and streamline pharmacy operations. The platform enables pharmacies to efficiently manage customer orders, track deliveries, handle payments, and maintain customer relationships—all through an intuitive mobile application.

### Project Vision

To transform traditional pharmacy operations into a modern, efficient, and technology-driven experience that enhances both pharmacy productivity and customer satisfaction.

### Key Objectives

- ✅ **Digitize Order Management**: Replace paper-based order tracking with digital system
- ✅ **Streamline Operations**: Automate order processing, payment tracking, and delivery management
- ✅ **Improve Customer Experience**: Provide real-time order status updates and notifications
- ✅ **Business Intelligence**: Generate insights through analytics and reporting
- ✅ **Multi-User Support**: Enable multiple staff members to manage the same pharmacy
- ✅ **Scalability**: Support growth from single pharmacy to multiple locations

### Target Users

**Primary Users:**
- **Pharmacy Owners**: Manage their pharmacy business operations
- **Pharmacy Staff**: Process orders, handle customers, manage deliveries
- **Delivery Personnel**: Track deliveries and update order status

**Secondary Users:**
- **Customers**: Receive order confirmations and delivery updates (via notifications)

---

## 🏗️ System Architecture

### 3.1 High-Level Architecture
┌─────────────────────────────────────────────────────────────────┐
│ MEDLIVES SYSTEM ARCHITECTURE │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────┐ ┌──────────────────────┐
│ Mobile Application │ │ Web Dashboard │
│ (React Native) │ │ (Future) │
│ │ │ │
│ • iOS │ │ • Analytics │
│ • Android │ │ • Reports │
│ • Expo Framework │ │ • Bulk Operations │
└─────────────────────┘ └──────────────────────┘
│ │
│ HTTP/REST API │
│ │
└───────────────────┬───────────────────────┘
│
▼
┌─────────────────────┐
│ Express.js API │
│ (Backend Server) │
│ │
│ • REST Endpoints │
│ • Authentication │
│ • Business Logic │
│ • Data Validation │
└─────────────────────┘
│
┌──────────────┼──────────────┐
│ │ │
▼ ▼ ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ MongoDB │ │ File │ │ External │
│ Database │ │ Storage │ │ Services │
│ │ │ │ │ │
│ • Orders │ │ • Images │ │ • SMS API │
│ • Users │ │ • Documents │ │ • Email API │
│ • Customers │ │ │ │ • OTP API │
│ • Tenants │ │ │ │ │
└─────────────┘ └─────────────┘ └─────────────┘


### 3.2 Component Architecture
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND ARCHITECTURE │
└─────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ React Native (Expo) │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Screens │ │ Components │ │ Services │ │
│ │ │ │ │ │ │ │
│ │ • Auth │ │ • Navigation │ │ • API Client │ │
│ │ • Home │ │ • Forms │ │ • Storage │ │
│ │ • Orders │ │ • Cards │ │ • OTP │ │
│ │ • Customers │ │ • Modals │ │ │ │
│ │ • Profile │ │ • Lists │ │ │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ State │ │ Navigation │ │ Theming │ │
│ │ Management │ │ (Expo │ │ │ │
│ │ │ │ Router) │ │ • Light Mode │ │
│ │ • React Hooks│ │ │ │ • Dark Mode │ │
│ │ • Context API│ │ • Stack Nav │ │ │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ BACKEND ARCHITECTURE │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ Express.js Server │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Routes │ │ Controllers │ │ Middleware │ │
│ │ │ │ │ │ │ │
│ │ • /api/auth │ │ • Auth │ │ • JWT Auth │ │
│ │ • /api/orders│ │ • Orders │ │ • Validation │ │
│ │ • /api/users │ │ • Users │ │ • Error │ │
│ │ • /api/customers│ • Customers │ │ Handling │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Models │ │ Services │ │ Config │ │
│ │ │ │ │ │ │ │
│ │ • Order │ │ • OTP │ │ • Database │ │
│ │ • User │ │ • Notification│ │ • Environment│ │
│ │ • Customer │ │ • Email │ │ • CORS │ │
│ │ • Tenant │ │ │ │ │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└───────────────────────────────────────


### 3.3 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React Native | Cross-platform mobile app development |
| **UI Library** | Expo | Rapid development and deployment |
| **State Management** | React Hooks | Component-level state management |
| **Navigation** | Expo Router | File-based routing system |
| **Backend Framework** | Express.js | RESTful API server |
| **Runtime** | Node.js | JavaScript runtime environment |
| **Database** | MongoDB | NoSQL document database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Authentication** | JWT (JSON Web Tokens) | Secure user authentication |
| **File Storage** | Local/Cloud Storage | Image and document storage |
| **Styling** | StyleSheet API | React Native styling |

---

## ⚡ Core Features

### 4.1 Authentication & User Management

#### **Multi-Step Registration Process**

The registration process is divided into three steps to ensure accurate pharmacy information collection:

**Step 1: Business Information**
- Pharmacy/Medical Store Name
- Owner Name
- License Number

**Step 2: Contact & Verification**
- Mobile Number
- Email Address
- OTP Verification
- License Number Verification

**Step 3: Account Setup**
- Password Creation
- Password Confirmation
- Account Creation

#### **User Roles**

**Admin (Owner):**
- Full system access
- Can manage staff users
- Can view all orders and analytics
- Can modify pharmacy settings

**Staff:**
- Limited access for order processing
- Can create and update orders
- Cannot modify pharmacy settings
- Cannot manage other users

#### **Authentication Flow**
┌─────────────────────────────────────────────────────────┐
│ AUTHENTICATION FLOW │
└─────────────────────────────────────────────────────────┘
Start
│
▼
┌─────────────────┐
│ First Screen │ ─── Splash/Welcome Screen
│ (Splash) │
└─────────────────┘
│
▼
┌─────────────────┐
│ Check if User │ ─── Check Local Storage
│ is Logged In │
└─────────────────┘
│
├─── Yes ──────────────────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Home Screen │
│ │ (Main App) │
│ └─────────────────┘
│
└─── No ───────────────────┐
│
▼
┌─────────────────┐
│ Register │
│ Screen │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 1: │
│ Business Info │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 2: │
│ Contact & OTP │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 3: │
│ Password Setup │
└─────────────────┘
│
▼
┌─────────────────┐
│ Registration │
│ Success │
└─────────────────┘
│
▼
┌─────────────────┐
│ Login Screen │
└─────────────────┘
│
▼
┌─────────────────┐
│ Verify │
│ Credentials │
└─────────────────┘
│
├─── Valid ──► Home Screen
│
└─── Invalid ─► Show Error


### 4.2 Order Management

#### **Order Creation Process**
┌─────────────────────────────────────────────────────────┐
│ ORDER CREATION FLOW │
└─────────────────────────────────────────────────────────┘
User Clicks "Add Order"
│
▼
┌─────────────────┐
│ Order Form │
│ Opens │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 1: │
│ Customer Info │
│ │
│ • Name │
│ • Phone │
│ • Address │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 2: │
│ Medications │
│ │
│ • Add Medicine │
│ • Quantity │
│ • Price │
│ • Total Calc │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 3: │
│ Payment Details│
│ │
│ • Total Amount │
│ • Discount │
│ • Payable Amt │
│ • Payment Type │
└─────────────────┘
│
▼
┌─────────────────┐
│ Review & │
│ Confirm │
└─────────────────┘
│
▼
┌─────────────────┐
│ Submit Order │
│ to Backend │
└─────────────────┘
│
├─── Success ──────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Show Success │
│ │ Message │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Refresh Orders │
│ │ List │
│ └─────────────────┘
│
└─── Error ────────┐
│
▼
┌─────────────────┐
│ Show Error │
│ Message │
└─────────────────┘


#### **Order Status Management**

**Order Status Types:**

- **Pending**: Order created but payment not received
- **Paid**: Payment received, order confirmed
- **Credit**: Order on credit, payment pending

**Status Update Flow:**
┌─────────────────┐
│ Order List │
│ (Home Screen) │
└─────────────────┘
│
▼
┌─────────────────┐
│ User Swipes │
│ Order Card │
└─────────────────┘
│
├─── Swipe Left ────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Mark as PAID │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Update Status │
│ │ in Database │
│ └─────────────────┘
│
└─── Swipe Right ───┐
│
▼
┌─────────────────┐
│ Show Actions │
│ │
│ • Credit │
│ • Delete │
└─────────────────┘
│
├─── Credit ──► Update to CREDIT
│
└─── Delete ──► Remove Order


### 4.3 Customer Management

**Customer Features:**

- **Customer List**: View all customers with their details
- **Customer Details**: View customer order history, credit amount, contact information
- **Customer Search**: Quick search by name, phone, or address
- **Credit Tracking**: Track credit amounts for each customer
- **Order History**: View all past orders for a customer

**Customer Information Structure:**

- Personal Details: Name, Phone, Email
- Address Details: Society, Wing, Flat Number, Full Address
- Order Statistics: Total Orders, Last Order Date
- Financial: Credit Amount, Payment Status

### 4.4 Delivery Management

**Delivery Features:**

- **Delivery Personnel Management**: Add, edit, delete delivery personnel
- **Assign Orders**: Assign orders to delivery personnel
- **Track Deliveries**: Track order delivery status
- **Delivery History**: View delivery statistics and history

**Delivery Roles:**

- **Admin**: Full access to delivery management
- **Manager**: Can assign and track deliveries
- **Delivery Boy**: Can update delivery status (future feature)

### 4.5 Analytics & Reporting

**Available Metrics:**

- **Order Count**: Total orders for selected date range
- **Items Sold**: Total quantity of medications sold
- **Revenue**: Total revenue from orders
- **Order Status Distribution**: Breakdown of paid, credit, and pending orders
- **Popular Medications**: Most frequently ordered medications

**Filtering Options:**

- **Date Range**: Today, Yesterday, Custom Date
- **Status Filter**: All, Paid, Credit, Pending
- **Search**: Search by Order ID, Customer Name, Address, or Medication Name

---

## 🔄 User Flow & Navigation

### 5.1 Application Navigation Structure
┌─────────────────────────────────────────────────────────┐
│ APPLICATION NAVIGATION FLOW │
└─────────────────────────────────────────────────────────┘
App Launch
│
▼
┌─────────────────┐
│ First Screen │ ─── (3 seconds)
│ (Splash) │
└─────────────────┘
│
▼
┌─────────────────┐
│ Authentication │
│ Check │
└─────────────────┘
│
├─── Not Logged In ────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Register │
│ │ Flow │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Login │
│ └─────────────────┘
│
└─── Logged In ──────────┐
│
▼
┌─────────────────┐
│ Main Navigator │
│ (Bottom Tabs) │
└─────────────────┘
│
┌───────────────────┼───────────────────┐
│ │ │
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Home │ │ Customers │ │ Profile │
│ Screen │ │ Screen │ │ Screen │
└──────────────┘ └──────────────┘ └──────────────┘
│ │ │
│ │ │
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ • Orders │ │ • Customer │ │ • Settings │
│ • Add Order │ │ List │ │ • Edit │
│ • Filters │ │ • Search │ │ Profile │
│ • Analytics │ │ • Details │ │ • Account │
└──────────────┘ └──────────────┘ └──────────────┘


### 5.2 Bottom Tab Navigation

**Tab Structure:**

1. **Home Tab**: Order management and analytics
2. **Add Order Button**: Quick order creation (centered)
3. **Customers Tab**: Customer management
4. **Completed Tab**: Completed orders history
5. **Profile Tab**: User profile and settings

### 5.3 Screen Hierarchy
┌─────────────────────────────────────────────────────────┐
│ SCREEN HIERARCHY │
└─────────────────────────────────────────────────────────┘
Root Layout
│
├─── Auth Stack
│ ├─── First (Splash)
│ ├─── Register
│ │ ├─── Step 1: Business Info
│ │ ├─── Step 2: Contact & OTP
│ │ └─── Step 3: Password
│ ├─── Login
│ ├─── Register Success
│ └─── Login Success
│
└─── Main Stack
├─── Main Navigator (Bottom Tabs)
│ ├─── Home Screen
│ │ ├─── Order Details
│ │ └─── Add Order Modal
│ ├─── Customers Screen
│ │ └─── Customer Details
│ ├─── Completed Screen
│ └─── Profile Screen
│ ├─── Edit Profile
│ ├─── Settings
│ ├─── Account Subscription
│ ├─── Security & Data
│ ├─── Help & Support
│ ├─── About
│ └─── Delivery Management


---

## 🛠️ Technical Implementation

### 6.1 Frontend Implementation

#### **Component Architecture**

**Screen Components:**
- **HomeScreen**: Main order management interface
- **CustomersScreen**: Customer list and management
- **ProfileScreen**: User profile and settings
- **OrderDetails**: Detailed order view
- **AddOrderFixed**: Order creation modal

**Reusable Components:**
- **BottomTabBar**: Navigation bar
- **OrderCard**: Order display card
- **CustomerCard**: Customer display card
- **Stepper**: Multi-step form navigation
- **SuccessModal**: Success message display

**State Management:**
- Uses React Hooks (useState, useEffect) for local state
- Context API for global state (if needed)
- AsyncStorage for persistent data (user info, authentication tokens)

#### **Styling Approach**

**Theme System:**
- Centralized color palette
- Consistent typography (Manrope font family)
- Responsive scaling based on screen width
- Support for Light and Dark themes

**Responsive Design:**
- Scales components based on device width
- Maintains aspect ratios across devices
- Touch-friendly button sizes

### 6.2 Backend Implementation

#### **API Structure**

**RESTful Endpoints:**

**Authentication Routes:**
- POST `/api/auth/send-otp` - Send OTP to mobile number
- POST `/api/auth/verify-otp` - Verify OTP code
- POST `/api/auth/register-tenant` - Register new pharmacy
- POST `/api/auth/login` - User login

**Order Routes:**
- GET `/api/orders` - Get all orders (with filters)
- GET `/api/orders/:id` - Get single order
- POST `/api/orders` - Create new order
- PUT `/api/orders/:id/status` - Update order status
- DELETE `/api/orders/:id` - Delete order

**User Routes:**
- GET `/api/users` - Get all users
- GET `/api/users/profile` - Get current user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/add` - Add new staff user
- DELETE `/api/users/:id` - Delete user

**Customer Routes:**
- GET `/api/customers` - Get all customers
- GET `/api/customers/:id` - Get customer details
- POST `/api/customers` - Add new customer
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

#### **Middleware Stack**

**Authentication Middleware:**
- Validates JWT tokens
- Extracts user information from tokens
- Protects routes requiring authentication

**Validation Middleware:**
- Validates request data
- Ensures data format correctness
- Returns appropriate error messages

**Error Handling Middleware:**
- Catches and handles errors
- Returns standardized error responses
- Logs errors for debugging

**CORS Middleware:**
- Handles cross-origin requests
- Configurable allowed origins
- Supports credentials

### 6.3 Database Implementation

#### **MongoDB Collections**

**Orders Collection:**
- Stores all order information
- Indexed on orderId for fast lookups
- Includes customer details, medications, payment info

**Users Collection:**
- Stores user accounts (pharmacy owners and staff)
- Indexed on userId and tenantCode
- Includes authentication credentials

**Tenants Collection:**
- Stores pharmacy/tenant information
- Links to users and orders
- Includes business details

**Customers Collection:**
- Stores customer information
- Links to orders
- Includes address and contact details

**OTP Collection:**
- Temporary storage for OTP verification
- Auto-expires after verification or timeout

---

## 📊 Data Models

### 7.1 Order Model

**Order Schema:**
Order {
orderId: String (unique, indexed)
date: String (dd/MM/yy format)
tenantCode: Number (pharmacy identifier)
customerName: String (required)
contactNumber: String (required)
address: String (required)
medications: Array [
{
name: String (required)
qty: Number (required, min: 1)
price: Number (required, min: 0)
}
]
totalAmount: Number (required)
discount: Number (default: 0)
discountPercent: Number (default: 0)
payableAmount: Number (required)
status: Enum ['paid', 'credit', 'pending'] (default: 'pending')
deliveryBoy: String (default: '')
deliveryBoyPhone: String (default: '')
paymentMethod: String (default: '')
notes: String (default: '')
createdAt: Date (auto)
updatedAt: Date (auto)
}


**Order Relationships:**
- Belongs to: Tenant (Pharmacy)
- Has: Medications (embedded array)
- References: Customer (by name/phone)

### 7.2 User Model

**User Schema:**
User {
tenantCode: Number (required)
userId: Number (unique, auto-generated)
name: String (required)
role: Enum ['staff', 'admin'] (default: 'staff')
password: String (hashed, required)
createdAt: Date (auto)
updatedAt: Date (auto)
}


**User Relationships:**
- Belongs to: Tenant (Pharmacy)
- Can have: Multiple orders (created by user)

### 7.3 Tenant Model

**Tenant Schema:**
Tenant {
tenantCode: Number (unique, auto-generated)
businessName: String (required)
ownerName: String (required)
mobile: String (required, unique)
email: String
licenseNo: String (required)
address: String
createdAt: Date (auto)
updatedAt: Date (auto)
}


**Tenant Relationships:**
- Has: Multiple Users (staff members)
- Has: Multiple Orders
- Has: Multiple Customers

### 7.4 Customer Model

**Customer Schema:**
Customer {
tenantCode: Number (required)
name: String (required)
phone: String (required)
email: String
address: String (required)
society: String
wing: String
flatNo: String
creditAmount: Number (default: 0)
totalOrders: Number (default: 0)
lastOrderDate: Date
createdAt: Date (auto)
updatedAt: Date (auto)
}


**Customer Relationships:**
- Belongs to: Tenant (Pharmacy)
- Has: Multiple Orders

---

## 🔐 Authentication System

### 8.1 Multi-Step Registration Flow
┌─────────────────────────────────────────────────────────┐
│ REGISTRATION PROCESS FLOW │
└─────────────────────────────────────────────────────────┘
Start Registration
│
▼
┌─────────────────┐
│ Step 1: │
│ Business Info │
│ │
│ Input: │
│ • Business Name│
│ • Owner Name │
│ • License No │
└─────────────────┘
│
▼
┌─────────────────┐
│ Validate & │
│ Store in State │
└─────────────────┘
│
▼
┌─────────────────┐
│ Step 2: │
│ Contact Info │
│ │
│ Input: │
│ • Mobile │
│ • Email │
│ • OTP Request │
└─────────────────┘
│
▼
┌─────────────────┐
│ Send OTP to │
│ Mobile Number │
└─────────────────┘
│
▼
┌─────────────────┐
│ User Enters │
│ OTP │
└─────────────────┘
│
▼
┌─────────────────┐
│ Verify OTP │
│ with Backend │
└─────────────────┘
│
├─── Valid ──────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Step 3: │
│ │ Password │
│ │ │
│ │ Input: │
│ │ • Password │
│ │ • Confirm │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Validate │
│ │ Password Match │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Submit All │
│ │ Data to Backend│
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Backend: │
│ │ Create Tenant │
│ │ Create Admin │
│ │ User │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Registration │
│ │ Success │
│ └─────────────────┘
│
└─── Invalid ────► Show Error


### 8.2 Login Flow
┌─────────────────────────────────────────────────────────┐
│ LOGIN PROCESS FLOW │
└─────────────────────────────────────────────────────────┘
User Opens Login Screen
│
▼
┌─────────────────┐
│ Input: │
│ • User ID │
│ • Password │
└─────────────────┘
│
▼
┌─────────────────┐
│ Validate Input │
│ Format │
└─────────────────┘
│
▼
┌─────────────────┐
│ Send to │
│ Backend API │
└─────────────────┘
│
▼
┌─────────────────┐
│ Backend: │
│ • Find User │
│ • Verify │
│ Password │
│ • Generate JWT │
└─────────────────┘
│
├─── Valid ──────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Store Token │
│ │ in AsyncStorage│
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Store User │
│ │ Info Locally │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Navigate to │
│ │ Home Screen │
│ └─────────────────┘
│
└─── Invalid ────► Show Error Message


### 8.3 JWT Token Management

**Token Structure:**
- Contains user ID, tenant code, and role
- Expires after a set period
- Used for authenticated API requests

**Token Flow:**
1. User logs in successfully
2. Backend generates JWT token
3. Token stored in AsyncStorage (frontend)
4. Token included in Authorization header for API requests
5. Backend validates token on protected routes
6. Token refreshed when expired (future feature)

---

## 📦 Order Management System

### 9.1 Order Lifecycle
┌─────────────────────────────────────────────────────────┐
│ ORDER LIFECYCLE │
└─────────────────────────────────────────────────────────┘
ORDER CREATED
│
│ Status: PENDING
│
▼
┌─────────────────┐
│ Order Created │
│ • Customer Info│
│ • Medications │
│ • Amount Calc │
└─────────────────┘
│
│ Payment Received?
│
├─── Yes ───────────────┐
│ │
│ ▼
│ ┌─────────────────┐
│ │ Status: PAID │
│ │ • Payment │
│ │ Recorded │
│ │ • Order │
│ │ Confirmed │
│ └─────────────────┘
│ │
│ ▼
│ ┌─────────────────┐
│ │ Delivery │
│ │ Assigned? │
│ └─────────────────┘
│ │
│ ├─── Yes ──► Delivery Tracking
│ │
│ └─── No ───► Pending Delivery
│
└─── No ────────────────┐
│
▼
┌─────────────────┐
│ Status: CREDIT │
│ • Payment │
│ Pending │
│ • Credit │
│ Amount │
│ Tracked │
└─────────────────┘
│
▼
┌─────────────────┐
│ Payment │
│ Received? │
└─────────────────┘
│
└─── Yes ──► Update to PAID
│
└─── No ───► Remain CREDIT


### 9.2 Order Processing Workflow

**Step-by-Step Order Creation:**

1. **Customer Selection/Entry**
   - Select existing customer OR
   - Enter new customer details (name, phone, address)

2. **Medication Entry**
   - Add medication name
   - Enter quantity
   - Enter price per unit
   - System calculates line total
   - Can add multiple medications

3. **Amount Calculation**
   - System calculates total amount
   - Apply discount (if any)
   - Calculate discount percentage
   - Calculate final payable amount

4. **Payment Information**
   - Select payment status (Paid/Credit/Pending)
   - Select payment method (if paid)
   - Add delivery information (optional)
   - Add notes (optional)

5. **Order Submission**
   - Validate all required fields
   - Generate unique order ID
   - Send to backend API
   - Store in database
   - Return success response

6. **Order Display**
   - Order appears in order list
   - Filterable by date and status
   - Searchable by multiple criteria
   - Swipeable for quick actions

---

## 🏢 Multi-Tenant Architecture

### 10.1 Tenant Isolation

**Concept:**
Each pharmacy is a separate "tenant" with isolated data. Users, orders, and customers belong to a specific tenant (identified by tenantCode).

**Data Isolation:**
┌─────────────────────────────────────────────────────────┐
│ MULTI-TENANT DATA STRUCTURE │
└─────────────────────────────────────────────────────────┘
Tenant (Pharmacy A) - tenantCode: 1001
│
├─── Users
│ ├─── Admin User (userId: 126001)
│ └─── Staff User (userId: 126002)
│
├─── Orders
│ ├─── Order 1 (orderId: ORD-001)
│ ├─── Order 2 (orderId: ORD-002)
│ └─── Order 3 (orderId: ORD-003)
│
└─── Customers
├─── Customer 1
├─── Customer 2
└─── Customer 3
Tenant (Pharmacy B) - tenantCode: 1002
│
├─── Users
│ ├─── Admin User (userId: 127001)
│ └─── Staff User (userId: 127002)
│
├─── Orders
│ ├─── Order 1 (orderId: ORD-001)
│ └─── Order 2 (orderId: ORD-002)
│
└─── Customers
├─── Customer 1
└─── Customer 2
Note: Each tenant has isolated data. Order IDs can be same
across tenants but are unique within a tenant.


**Benefits:**
- Complete data isolation between pharmacies
- Shared infrastructure (cost-effective)
- Independent user management per pharmacy
- Scalable architecture

### 10.2 User ID Generation

**ID Format:**
- Format: `{tenantCode}{sequentialNumber}`
- Example: Tenant 1001 → User IDs: 126001, 126002, 126003...
- Example: Tenant 1002 → User IDs: 127001, 127002, 127003...

**How It Works:**
- First pharmacy (tenantCode: 1001) gets user IDs starting from 126001
- Second pharmacy (tenantCode: 1002) gets user IDs starting from 127001
- System automatically generates next available user ID per tenant

---

## 🚚 Delivery Management

### 11.1 Delivery Personnel Management

**Features:**
- Add new delivery personnel
- Edit delivery personnel details
- Delete delivery personnel
- View delivery statistics
- Assign roles (Admin, Manager, Delivery Boy)

**Delivery Personnel Information:**
- Name
- Phone Number
- Email
- Role
- Status (Active/Offline)
- Statistics (Total Deliveries, Rating, Join Date)

### 11.2 Order Assignment (Future Feature)

**Planned Flow:**
┌─────────────────┐
│ Order Created │
└─────────────────┘
│
▼
┌─────────────────┐
│ Assign to │
│ Delivery Boy │
└─────────────────┘
│
▼
┌─────────────────┐
│ Delivery Boy │
│ Receives │
│ Notification │
└─────────────────┘
│
▼
┌─────────────────┐
│ Update Delivery│
│ Status │
│ • Picked Up │
│ • In Transit │
│ • Delivered │
└─────────────────┘
│
▼
┌─────────────────┐
│ Customer │
│ Notified │
└─────────────────┘


---

## 🌐 API Architecture

### 12.1 Request-Respone
┌─────────────────────────────────────────────────────────┐
│ API REQUEST FLOW │
└─────────────────────────────────────────────────────────┘
Mobile App
│
│ HTTP Request (JSON)
│ Headers:
│ • Content-Type: application/json
│ • Authorization: Bearer <JWT_TOKEN>
│
▼
┌─────────────────┐
│ Express Server │
│ Receives │
│ Request │
└─────────────────┘
│
▼
┌─────────────────┐
│ Middleware │
│ • CORS Check │
│ • Auth Verify │
│ • Body Parse │
└─────────────────┘
│
▼
┌─────────────────┐
│ Route Handler │
│ • Validate │
│ • Process │
└─────────────────┘
│
▼
┌─────────────────┐
│ Controller │
│ • Business │
│ Logic │
│ • Database │
│ Operations │
└─────────────────┘
│
▼
┌─────────────────┐
│ MongoDB │
│ • Query/Insert │
│ • Update │
│ • Delete │
└─────────────────┘
│
│ Response Data
│
▼
┌─────────────────┐
│ Controller │
│ • Format │
│ Response │
└─────────────────┘
│
▼
┌─────────────────┐
│ Express │
│ • Send JSON │
│ Response │
└─────────────────┘
│
│ HTTP Response (JSON)
│ Status: 200/400/500
│ Body: { success, data, message }
│
▼
Mobile App


### 12.2 Error Ha
{
"success": false,
"error": "Error message describing what went wrong",
"statusCode": 400/401/404/500
}


**Error Types:**
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication failed
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

---

## 💾 Database Design

### 13.1 Database Schema Relationships
┌─────────────────────────────────────────────────────────┐
│ DATABASE RELATIONSHIP DIAGRAM │
└─────────────────────────────────────────────────────────┘
┌──────────────┐
│ TENANT │
│ │
│ • tenantCode │
│ • business │
│ Name │
└──────────────┘
│
┌────────────┼────────────┐
│ │ │
▼ ▼ ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ USER │ │ ORDER │ │ CUSTOMER │
│ │ │ │ │ │
│ • userId │ │ • orderId│ │ • phone │
│ • tenant │ │ • tenant │ │ • tenant │
│ Code │ │ Code │ │ Code │
│ • role │ │ • status │ │ • address│
└──────────┘ └──────────┘ └──────────┘
│ │ │
│ │ │
└────────────┼────────────┘
│
┌──────┴──────┐
│ MEDICATION │
│ (Embedded) │
│ │
│ • name │
│ • qty │
│ • price │
└─────────────┘


### 13.2 Indexing Strategy

**Indexed Fields:**
- **Orders Collection**:
  - `orderId` (unique index) - Fast order lookups
  - `tenantCode` - Filter orders by pharmacy
  - `date` - Date-based filtering
  - `status` - Status-based filtering

- **Users Collection**:
  - `userId` (unique index) - Fast user lookups
  - `tenantCode` - Filter users by pharmacy
  - `email` (if unique) - Email-based lookups

- **Tenants Collection**:
  - `tenantCode` (unique index) - Fast tenant lookups
  - `mobile` (unique index) - Mobile-based lookups

**Benefits:**
- Faster query performance
- Efficient filtering and sorting
- Optimized search operations

---

## 🎨 User Interface

### 14.1 Design System

**Color Palette:**

**Primary Colors:**
- Primary: `#2EC4D6` (Teal) - Main actions, headers
- Primary Alt: `#37B9C5` (Light Teal) - Secondary actions
- Text: `#0A174E` (Dark Blue) - Primary text

**Status Colors:**
- Success: `#65B924` (Green) - Paid orders, success messages
- Danger: `#FF2A2A` (Red) - Credit orders, errors, delete
- Warning: `#F4A261` (Orange) - Pending orders
- Info: `#3B82F6` (Blue) - Information messages

**Neutral Colors:**
- Surface: `#FFFFFF` (White) - Background, cards
- Muted: `#888` (Gray) - Secondary text
- Border: `#eee` (Light Gray) - Borders, dividers
- Chip Background: `#e0f7fa` (Very Light Teal) - Chip backgrounds

**Typography:**
- Font Family: Manrope (Regular, SemiBold, Bold)
- Sizes: Responsive scaling based on device width
- Scale Factor: `width / 320` for consistent sizing

### 14.2 Screen Components

**Home Screen Layout:**
┌─────────────────────────────────────────┐
│ Header (Primary Color) │
│ • Pharmacy Logo │
│ • Business Name │
│ • Welcome Message │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Filters Section │
│ • Search Bar │
│ • Date Tabs (Today/Yesterday/Custom) │
│ • Status Chips (All/Paid/Credit/Pending)│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Metrics Row │
│ • Orders Count │
│ • Items Count │
│ • Revenue │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Orders List (Scrollable) │
│ ┌─────────────────────────────────┐ │
│ │ Order Card 1 │ │
│ │ • Order Info │ │
│ │ • Customer Details │ │
│ │ • Medications (chips) │ │
│ │ • Amounts (Total/Discount/Paid) │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Order Card 2 │ │
│ └─────────────────────────────────┘ │
│ ... │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Bottom Tab Bar │
│ [Home] [+ Add] [Customers] [Completed] │
│ [Profile] │
└─────────────────────────────────────────┘
**Order Card Swipe Actions:**
┌─────────────────────────────────────────┐
│ [PAID] ← Swipe Left │
│ │
│ Order Card │
│ │
│ Swipe Right → [CREDIT] [DELETE] │
└─────────────────────────────────────────┘


---

## 🚀 Future Enhancements

### 15.1 Planned Features

**Real-Time Delivery Tracking:**
- GPS-based location tracking
- Live delivery status updates
- Estimated delivery time
- Delivery route optimization

**Inventory Management:**
- Stock level tracking
- Low stock alerts
- Automatic reorder suggestions
- Medication expiry tracking

**Advanced Analytics:**
- Sales trends and forecasting
- Customer behavior analysis
- Profit margin analysis
- Peak time identification
- Geographic sales distribution

**Payment Gateway Integration:**
- Online payment processing
- Multiple payment methods (UPI, Cards, Wallets)
- Payment history tracking
- Receipt generation

**Customer App:**
- Order placement app for customers
- Order tracking
- Medication reminders
- Prescription upload

**Multi-Location Support:**
- Manage multiple pharmacy branches
- Centralized reporting
- Branch-wise analytics

**Report Generation:**
- Daily/Weekly/Monthly reports
- PDF export
- Email reports
- Print functionality

### 15.2 Technology Upgrades

**Kafka Integration:**
- Event-driven architecture
- High-throughput order processing
- Real-time notifications
- Scalable microservices architecture

**Push Notifications:**
- Real-time order status updates
- Payment reminders
- Delivery notifications
- Promotional messages

**Cloud Storage:**
- Prescription image storage
- Document management
- Backup and restore

**Offline Support:**
- Offline order creation
- Sync when online
- Local data caching

---

## 📝 Project Structure

### 16.1 Directory Structure
MEDLIVES/
├── app/ # React Native screens
│ ├── (auth)/ # Authentication screens
│ │ ├── First.tsx # Splash screen
│ │ ├── Register.tsx # Registration
│ │ ├── LoginPage.tsx # Login
│ │ └── ...
│ ├── HomeScreen.tsx # Main order screen
│ ├── CustomersScreen.tsx # Customer management
│ ├── ProfileScreen.tsx # User profile
│ ├── OrderDetails.tsx # Order details
│ ├── DeliveryManagement.tsx # Delivery management
│ └── components/ # Reusable components
│ ├── OrderSuccessModal.tsx
│ └── steps/ # Multi-step form components
├── src/ # Services and utilities
│ └── services/
│ ├── api.ts # API client
│ ├── otpApi.ts # OTP service
│ └── registrationApi.ts # Registration service
├── Medlives-backend/ # Backend server
│ ├── server.js # Express server entry
│ └── src/
│ ├── routes/ # API routes
│ ├── controllers/ # Request handlers
│ ├── models/ # Database models
│ ├── middleware/ # Express middleware
│ └── config/ # Configuration files
├── assets/ # Images, fonts, icons
├── android/ # Android native code
├── package.json # Frontend dependencies
└── README.md # Project documentation


---

## 🎓 Key Concepts Explained

### 17.1 Multi-Tenancy

**What is Multi-Tenancy?**
Multi-tenancy is an architecture where a single application instance serves multiple customers (tenants), with each tenant's data isolated and invisible to other tenants.

**In MEDLIVES:**
- Each pharmacy is a separate tenant
- All data is tagged with tenantCode
- Users can only access their pharmacy's data
- System can serve unlimited pharmacies

**Benefits:**
- Cost-effective (shared infrastructure)
- Easier maintenance (single codebase)
- Scalable (add more pharmacies easily)

### 17.2 Order Status Workflow

**Three States:**

1. **PENDING** (Yellow)
   - Order created but payment not received
   - Default status for new orders
   - Can transition to PAID or CREDIT

2. **PAID** (Green)
   - Payment received
   - Order confirmed
   - Ready for delivery

3. **CREDIT** (Red)
   - Order on credit
   - Payment pending
   - Can transition to PAID when payment received

**Status Transitions:**
- PENDING → PAID (via swipe left or payment received)
- PENDING → CREDIT (via swipe right → credit action)
- CREDIT → PAID (when payment received)

### 17.3 Data Synchronization

**Current Approach:**
- Direct API calls to backend
- Real-time data fetching
- Optimistic UI updates (update UI immediately, sync in background)

**Future Enhancement (with Kafka):**
- Event-driven synchronization
- Batch processing for efficiency
- Eventual consistency model
- Better scalability

---

## 📚 Summary

**MEDLIVES** is a comprehensive pharmacy management system that digitizes and streamlines pharmacy operations. The system provides:

- ✅ **Complete Order Management**: From creation to delivery tracking
- ✅ **Customer Relationship Management**: Track customers, orders, and credits
- ✅ **Multi-User Support**: Admin and staff roles with appropriate permissions
- ✅ **Multi-Tenant Architecture**: Serve multiple pharmacies with isolated data
- ✅ **Real-Time Updates**: Instant order status updates and notifications
- ✅ **Business Intelligence**: Analytics and reporting capabilities
- ✅ **Mobile-First Design**: Optimized for mobile pharmacy operations

The architecture is designed to be:
- **Scalable**: Can handle growth from single pharmacy to multiple locations
- **Maintainable**: Clean code structure and separation of concerns
- **Extensible**: Easy to add new features and integrations
- **User-Friendly**: Intuitive interface for pharmacy staff

With planned enhancements like Kafka integration, real-time delivery tracking, and advanced analytics, MEDLIVES is positioned to become a leading solution for modern pharmacy management.

---

## 📝 Document Information

| Property | Value |
|----------|-------|
| **Document Version** | 1.0 |
| **Last Updated** | 2024 |
| **Project Name** | MEDLIVES (MedDel) |
| **Platform** | React Native (Expo) + Express.js |
| **Status** | Active Development |

---

**© 2024 MEDLIVES. All rights reserved.**