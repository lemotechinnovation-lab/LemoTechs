# LemoTech API Documentation

## Overview
Complete API documentation for the LemoTech on-demand cleaning service platform.

## Controllers Overview

### 🔐 Authentication & Authorization
**File:** `authController.ts` (15.5KB)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-phone` - Verify phone number

### 👨‍💼 Admin Management
**File:** `adminController.ts` (7.8KB)
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - List all users
- `GET /api/admin/statistics` - Platform statistics
- `PUT /api/admin/users/:id` - Update user details
- `DELETE /api/admin/users/:id` - Delete user

### 📋 Booking System
**File:** `bookingController.ts` (14.4KB)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `POST /api/bookings/:id/confirm` - Confirm booking

**File:** `bookingStateController.ts` (4.7KB)
- `GET /api/booking-states/:id` - Get booking state
- `PUT /api/booking-states/:id` - Update booking state
- `GET /api/booking-states/:id/history` - Booking state history

### 🧽 Cleaning Workflow
**File:** `cleaningWorkflowController.ts` (9.3KB)
- `GET /api/cleaning/workflows` - List cleaning workflows
- `POST /api/cleaning/workflows` - Create workflow
- `PUT /api/cleaning/workflows/:id` - Update workflow
- `GET /api/cleaning/workflows/:id/steps` - Get workflow steps
- `POST /api/cleaning/workflows/:id/complete` - Complete workflow

### 🚗 Driver Management
**File:** `driverController.ts` (12.1KB)
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Register new driver
- `GET /api/drivers/:id` - Get driver details
- `PUT /api/drivers/:id` - Update driver info
- `GET /api/drivers/:id/earnings` - Driver earnings
- `PUT /api/drivers/:id/status` - Update driver status

**File:** `driverAssignmentController.ts` (9.2KB)
- `POST /api/drivers/assign` - Assign driver to booking
- `GET /api/drivers/assignments` - List driver assignments
- `PUT /api/drivers/assignments/:id` - Update assignment
- `GET /api/drivers/available` - Get available drivers

**File:** `driverJobController.ts` (11.0KB)
- `GET /api/drivers/:id/jobs` - Get driver jobs
- `POST /api/drivers/jobs/:id/start` - Start job
- `POST /api/drivers/jobs/:id/complete` - Complete job
- `PUT /api/drivers/jobs/:id/status` - Update job status
- `GET /api/drivers/jobs/:id/route` - Get job route

### 🗺️ Route Optimization
**File:** `routeOptimizationController.ts` (5.4KB)
- `POST /api/routes/optimize` - Optimize delivery route
- `GET /api/routes/:id` - Get route details
- `PUT /api/routes/:id` - Update route
- `GET /api/routes/analytics` - Route analytics

### 🏪 Shop Management
**File:** `shopController.ts` (10.8KB)
- `GET /api/shops` - List all shops
- `POST /api/shops` - Create new shop
- `GET /api/shops/:id` - Get shop details
- `PUT /api/shops/:id` - Update shop info
- `GET /api/shops/:id/capacity` - Check shop capacity

**File:** `shopManagementController.ts` (34.6KB) - **LARGEST CONTROLLER**
- `GET /api/shop-management/dashboard` - Shop management dashboard
- `GET /api/shop-management/orders` - Manage orders
- `GET /api/shop-management/inventory` - Inventory management
- `POST /api/shop-management/equipment` - Add equipment
- `GET /api/shop-management/staff` - Staff management
- `GET /api/shop-management/analytics` - Shop analytics
- `POST /api/shop-management/schedule` - Schedule management
- `GET /api/shop-management/quality-control` - Quality control
- `POST /api/shop-management/maintenance` - Equipment maintenance

**File:** `shopOrderController.ts` (8.8KB)
- `GET /api/shop-orders` - List shop orders
- `POST /api/shop-orders` - Create shop order
- `PUT /api/shop-orders/:id` - Update order status
- `GET /api/shop-orders/:id/items` - Get order items

**File:** `shopQueueController.ts` (6.4KB)
- `GET /api/shop-queue` - Get current queue
- `POST /api/shop-queue/add` - Add to queue
- `PUT /api/shop-queue/:id/position` - Update queue position
- `DELETE /api/shop-queue/:id` - Remove from queue

### 📦 Inventory Management
**File:** `shopInventoryTrackingController.ts` (7.6KB)
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory
- `GET /api/inventory/low-stock` - Low stock alerts
- `POST /api/inventory/restock` - Restock items

### 💳 Payment Processing
**File:** `payfastController.ts` (7.3KB)
- `POST /api/payments/payfast/initiate` - Initiate PayFast payment
- `POST /api/payments/payfast/notify` - PayFast webhook
- `GET /api/payments/payfast/return` - Payment return URL
- `GET /api/payments/payfast/cancel` - Payment cancel URL
- `POST /api/payments/payfast/refund` - Process refund

### 📁 File Management
**File:** `uploadController.ts` (6.3KB)
- `POST /api/upload/image` - Upload image
- `POST /api/upload/document` - Upload document
- `GET /api/upload/:id` - Get uploaded file
- `DELETE /api/upload/:id` - Delete file
- `POST /api/upload/multiple` - Multiple file upload

## API Base URLs
- **Development:** `http://localhost:8000`
- **Production (App Service):** `https://lemotech-api-backend.azurewebsites.net`
- **Production (Static Web App):** `https://lemotech-backend-static.azurestaticapps.net`

## Authentication
All API endpoints require JWT Bearer token authentication except:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/payments/payfast/notify (webhook)

## Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "timestamp": "2025-09-26T10:00:00Z",
    "requestId": "uuid"
  }
}
```

## Error Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "meta": {
    "timestamp": "2025-09-26T10:00:00Z",
    "requestId": "uuid"
  }
}
```
