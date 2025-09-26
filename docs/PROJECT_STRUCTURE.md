# LemoTech Innovations Project Structure

## 🏗️ Project Overview

**LemoTech Innovations** is a comprehensive on-demand pickup and delivery service for shoe and laundry cleaning, operating similarly to Uber/Mr Delivery/Bolt.

## 📁 Project Structure

```
lemotechinnovations/                    # Root project directory
├── backend/                           # Backend API server
│   ├── src/
│   │   ├── infrastructure/           # Data layer (EF Core equivalent)
│   │   │   ├── database.ts           # PostgreSQL connection
│   │   │   ├── dataContext.ts        # DbContext with repositories
│   │   │   ├── entities/             # TypeScript interfaces
│   │   │   ├── migrationManager.ts   # Migration management
│   │   │   └── databaseInitializer.ts # DB setup & seeding
│   │   ├── controllers/              # API controllers
│   │   ├── services/                 # Business logic services
│   │   ├── routes/                   # Express routes
│   │   ├── models/                   # Legacy models (being migrated)
│   │   └── app.ts                    # Main application
│   ├── infrastructure/               # Database migrations
│   │   └── migrations/               # node-pg-migrate files
│   └── migrate.json                  # Migration configuration
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API service layer
│   │   └── hooks/                    # Custom React hooks
├── mobile/                          # React Native mobile app
│   └── LemoTechExpo/                # Expo project
└── docs/                            # Project documentation
```

## 🗄️ Database Architecture (Innovations Project)

### Database Configuration
- **Project**: Innovations
- **Database**: `lemotech_innovations`
- **Host**: `localhost:5435`
- **Connection**: `postgresql://postgres:postgres@localhost:5435/lemotech_innovations`

### Core Tables
- **users**: User accounts (customers, drivers, shops, admins)
- **drivers**: Driver profiles and vehicle information
- **shops**: Cleaning service shops
- **bookings**: Pickup and delivery bookings
- **service_items**: Available cleaning services
- **payment_transactions**: Payment records (Stripe & PayFast)
- **payment_methods**: User payment methods

## 🚀 Key Features

### Backend (Node.js + TypeScript)
- **Infrastructure Layer**: EF Core equivalent with repositories
- **Migration Management**: Automated database schema management
- **Payment Integration**: Stripe and PayFast support
- **Real-time Communication**: SignalR hubs for live updates
- **API-First Design**: RESTful APIs with proper error handling

### Frontend (React + TypeScript)
- **Component Architecture**: Modular React components
- **Service Layer**: Clean API communication
- **State Management**: Context API for global state
- **Responsive Design**: Mobile-first approach

### Mobile (React Native + Expo)
- **Cross-platform**: iOS and Android support
- **Driver App**: Real-time order management
- **Customer App**: Simplified booking flow

## 🔧 Development Workflow

### Database Management
```bash
# Run migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Create new migration
npm run migrate:create <name>
```

### Infrastructure Usage
```typescript
import { db } from './infrastructure';

// Data operations
const user = await db.users().findById(userId);
const booking = await db.bookings().create(bookingData);
```

### API Development
```typescript
// Controllers use infrastructure
const users = await db.users().findAll();
const bookings = await db.bookings().findByUserId(userId);
```

## 📊 Technology Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Custom infrastructure (EF Core equivalent)
- **Migrations**: node-pg-migrate
- **Payments**: Stripe + PayFast
- **Real-time**: SignalR

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State**: Context API

### Mobile
- **Framework**: React Native
- **Platform**: Expo
- **Language**: TypeScript

## 🎯 Business Logic

### Service Types
- **Shoes**: Sneakers, dress shoes, boots
- **Clothing**: Shirts, pants, jackets, dresses
- **Accessories**: Handbags, etc.

### Workflow
1. **Customer Booking**: Location → Items → Service Type → Confirmation
2. **Driver Assignment**: Automatic matching based on location and availability
3. **Pickup**: Driver collects items from customer
4. **Cleaning**: Items processed at assigned shop
5. **Delivery**: Items returned to customer

### Payment Processing
- **Multiple Methods**: Card, mobile, cash
- **Providers**: Stripe (international), PayFast (South Africa)
- **Real-time**: Payment status updates via SignalR

## 🚨 Important Notes

- **Infrastructure First**: All data operations go through the infrastructure layer
- **No Direct DB Access**: Frontend never directly accesses the database
- **Migration Driven**: Database schema changes via migrations only
- **Project Structure**: Part of the "Innovations" project ecosystem
- **Scalable Architecture**: Designed for growth and complexity
