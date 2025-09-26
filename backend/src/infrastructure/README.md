# LemoTech Infrastructure Setup Guide

## 🗄️ Database Configuration

### Environment Variables
Create a `.env` file in the backend directory with:

```env
# Database Configuration (Innovations Project)
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/lemotech_innovations

# Optional: Admin User Setup
ADMIN_EMAIL=admin@lemotech.com
ADMIN_PASSWORD=admin123

# Optional: Seed Test Data
SEED_TEST_DATA=false
```

### Database Setup (Innovations Project)
1. **Install PostgreSQL** (if not already installed)
2. **Create Database**:
   ```sql
   CREATE DATABASE lemotech_innovations;
   ```
3. **Project Structure**: Database is part of the "Innovations" project
4. **Update Connection**: The migration configuration is already set for your database

## 🚀 Migration Management

### Available Commands

#### Run Migrations
```bash
# Run all pending migrations
npm run migrate:up

# Or use the infrastructure directly
npx ts-node -e "import('./src/infrastructure').then(m => m.runMigrations())"
```

#### Check Migration Status
```bash
# Check which migrations are pending/completed
npm run migrate:status

# Or use the infrastructure
npx ts-node -e "import('./src/infrastructure').then(m => m.checkMigrationStatus())"
```

#### Create New Migration
```bash
# Create a new migration file
npm run migrate:create <migration_name>

# Or use the infrastructure
npx ts-node -e "import('./src/infrastructure').then(m => m.createMigration('add_new_table'))"
```

#### Rollback Migration
```bash
# Rollback the last migration
npm run migrate:down

# Or use the infrastructure
npx ts-node -e "import('./src/infrastructure').then(m => m.rollbackMigration())"
```

### Migration Files Structure
```
backend/src/infrastructure/migrations/
├── 1758275501746_baseline-schema.js    # Core tables (users, drivers, shops, bookings)
├── 1758275504237_shop-orders.js        # Shop order management
├── 1758275506988_payments.js           # Payment tables (Stripe, PayFast)
└── sql/
    ├── baselineSchema.sql              # Complete baseline schema
    ├── createPaymentTables.sql         # Payment system tables
    └── migrateShopOrderTables.sql      # Shop order tables
```

## 🏗️ Infrastructure Architecture

### Data Context (EF Core Equivalent)
```typescript
import { db } from './infrastructure';

// Users
const user = await db.users().findById(userId);
const newUser = await db.users().create(userData);

// Bookings
const booking = await db.bookings().findById(bookingId);
const userBookings = await db.bookings().findByUserId(userId);

// Payment Transactions
const transaction = await db.paymentTransactions().findByPayfastId(paymentId);
const newTransaction = await db.paymentTransactions().create(transactionData);

// Service Items
const allItems = await db.serviceItems().findAll();
const shoeItems = await db.serviceItems().findByCategory('shoes');
```

### Database Operations
```typescript
import { query, getClient } from './infrastructure';

// Simple queries
const result = await query('SELECT * FROM users WHERE role = $1', ['admin']);

// Transactions
await db.transaction(async (client) => {
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO drivers ...');
});
```

## 🔧 Database Initialization

### Automatic Initialization
The app automatically initializes the database on startup:
1. Tests database connection
2. Checks migration status
3. Runs pending migrations
4. Validates schema
5. Seeds initial data (if needed)

### Manual Initialization
```typescript
import { initDatabase } from './infrastructure';

const result = await initDatabase();
if (result.success) {
  console.log('Database initialized successfully');
} else {
  console.error('Initialization failed:', result.errors);
}
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts (customers, drivers, shops, admins)
- **drivers**: Driver profiles and vehicle information
- **shops**: Cleaning service shops
- **bookings**: Pickup and delivery bookings
- **service_items**: Available cleaning services
- **payment_transactions**: Payment records
- **payment_methods**: User payment methods

### Supporting Tables
- **files**: File uploads and attachments
- **phone_verifications**: SMS verification codes
- **booking_steps**: Booking workflow steps
- **booking_history**: Booking progress tracking
- **in_progress_bookings**: Temporary booking data

## 🚨 Troubleshooting

### Common Issues

#### Migration Errors
```bash
# Check migration status
npx pg-migrate status

# Reset database (⚠️ DESTROYS ALL DATA)
npx pg-migrate reset
```

#### Connection Issues
```bash
# Test database connection
npx ts-node -e "import('./src/infrastructure').then(m => m.testConnection())"
```

#### Schema Validation
```bash
# Validate current schema
npx ts-node -e "import('./src/infrastructure').then(m => m.validateSchema())"
```

### Health Check
```typescript
import { healthCheck } from './infrastructure';

const health = await healthCheck();
console.log('Database Health:', health);
```

## 🔄 Development Workflow

### Adding New Features
1. **Create Migration**: `npm run migrate:create add_feature_table`
2. **Update Entities**: Add new interfaces in `entities/index.ts`
3. **Update Data Context**: Add repository methods in `dataContext.ts`
4. **Test**: Run migrations and test the new functionality

### Database Changes
1. **Never modify existing migrations** - create new ones instead
2. **Always test migrations** on a copy of production data
3. **Use transactions** for complex operations
4. **Backup before major changes**

## 📝 Notes

- **Project**: Part of the "Innovations" project structure
- **Migrations are managed by `node-pg-migrate`**
- **All data operations go through the infrastructure layer**
- **Frontend never directly accesses the database**
- **Payment integration supports both Stripe and PayFast**
- **Real-time updates use SignalR hubs**
- **Database automatically seeds initial data on first run**
