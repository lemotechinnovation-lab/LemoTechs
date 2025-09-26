# 🚗 LemoTech Driver Assignment System

## Overview

The LemoTech Driver Assignment System is an intelligent, proximity-based matching algorithm that automatically assigns the best available driver to customer bookings. This system ensures optimal service delivery, efficient resource utilization, and superior customer experience.

## 🎯 Key Features

### 1. **Intelligent Proximity Matching**
- Uses PostgreSQL's PostGIS extension for accurate distance calculations
- Considers real-time driver locations
- Configurable search radius (default: 50km)
- Optimized for South African geography

### 2. **Multi-Factor Scoring Algorithm**
The system scores drivers based on multiple weighted factors:

```typescript
const SCORING_WEIGHTS = {
  DISTANCE: 0.4,        // Distance to pickup location
  RATING: 0.2,          // Driver rating (1-5 stars)
  RESPONSE_TIME: 0.15,   // How quickly driver responds
  LOAD_BALANCE: 0.15,   // Current driver workload
  PRIORITY_BONUS: 0.1   // Priority customer bonus
};
```

### 3. **Priority Queuing System**
- **Urgent**: Emergency cleanings (20% bonus)
- **High**: Premium customers (10% bonus)
- **Normal**: Regular customers (no bonus)
- **Low**: Non-urgent requests (no bonus)

### 4. **Customer Tier Support**
- **VIP**: 15% priority bonus
- **Premium**: 5% priority bonus
- **Regular**: No bonus

### 5. **Load Balancing**
- Distributes jobs evenly among drivers
- Prevents driver burnout
- Ensures fair earning opportunities

## 🏗️ Architecture

### Core Components

1. **DriverAssignmentService** (`/services/driverAssignmentService.ts`)
   - Main assignment logic
   - Scoring algorithm
   - Batch processing

2. **DriverAssignmentController** (`/controllers/driverAssignmentController.ts`)
   - API endpoints
   - Request validation
   - Response formatting

3. **DriverAssignmentRoutes** (`/routes/driverAssignmentRoutes.ts`)
   - Route definitions
   - Authentication
   - Permission checks

### Database Integration

The system leverages PostgreSQL with PostGIS for spatial operations:

```sql
-- Driver location tracking
CREATE INDEX idx_drivers_location ON drivers USING GIST (
  ST_GeogFromText('POINT(' || (current_location->>'lng') || ' ' || (current_location->>'lat') || ')')
);

-- Spatial queries for proximity matching
SELECT ST_Distance(
  ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
  ST_GeogFromText('POINT(' || (current_location->>'lng') || ' ' || (current_location->>'lat') || ')')
) / 1000 as distance_km
```

## 📡 API Endpoints

### Assignment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/assignments/assign` | Assign driver to booking | Admin |
| `GET` | `/api/assignments/available-drivers` | Get available drivers in area | Driver/Admin |
| `PUT` | `/api/assignments/driver-location` | Update driver location | Driver |
| `POST` | `/api/assignments/reject` | Handle driver rejection | Driver |
| `GET` | `/api/assignments/driver-stats/:driverId` | Get driver statistics | Admin/Business |
| `POST` | `/api/assignments/batch-assign` | Batch assign multiple jobs | Admin |
| `GET` | `/api/assignments/alternatives/:bookingId` | Get alternative drivers | User/Admin |

### Booking Integration Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/bookings/:id/assign-driver` | Auto-assign driver to booking | Admin |
| `GET` | `/api/bookings/:id/assignment-status` | Get assignment status | User/Driver/Shop/Admin |

## 🔄 Assignment Flow

### 1. **Booking Creation**
```typescript
// Customer creates booking
const booking = await createBooking({
  pickupLocation: { lat: -26.2041, lng: 28.0473 },
  items: ['shoes', 'jacket'],
  priority: 'normal',
  customerTier: 'regular'
});
```

### 2. **Driver Assignment**
```typescript
// System automatically finds best driver
const assignmentRequest: AssignmentRequest = {
  bookingId: booking.id,
  pickupLocation: booking.pickupLocation,
  priority: booking.priority,
  estimatedPickupTime: booking.estimatedPickupTime,
  customerTier: booking.customerTier
};

const result = await DriverAssignmentService.findBestDriver(assignmentRequest);
```

### 3. **Real-time Notifications**
```typescript
// Notify driver and customer
await bookingHub.notifyDriverAssignment(driver.userId, bookingId, driverInfo);
await bookingHub.notifyCustomerDriverAssigned(customer.userId, bookingId, driverInfo);
```

## 🎛️ Configuration

### Environment Variables

```bash
# Driver assignment settings
MAX_SEARCH_RADIUS=50          # Maximum search radius in km
MAX_DRIVERS_TO_CONSIDER=20     # Maximum drivers to evaluate
DRIVER_TIMEOUT_MINUTES=15      # Driver response timeout
```

### Scoring Weights

Customize the scoring algorithm by modifying weights in `driverAssignmentService.ts`:

```typescript
const SCORING_WEIGHTS = {
  DISTANCE: 0.4,        // Higher = prioritize closer drivers
  RATING: 0.2,          // Higher = prioritize better rated drivers
  RESPONSE_TIME: 0.15,   // Higher = prioritize active drivers
  LOAD_BALANCE: 0.15,   // Higher = prioritize less busy drivers
  PRIORITY_BONUS: 0.1   // Higher = more priority customer bonus
};
```

## 📊 Performance Metrics

### Key Performance Indicators (KPIs)

1. **Assignment Success Rate**: >95%
2. **Average Assignment Time**: <2 seconds
3. **Driver Response Time**: <5 minutes
4. **Customer Satisfaction**: >4.5/5 stars
5. **Driver Utilization**: 70-85%

### Monitoring

The system tracks:
- Assignment success/failure rates
- Driver response times
- Customer wait times
- Driver workload distribution
- Geographic coverage

## 🧪 Testing

### Unit Tests

```bash
# Run driver assignment tests
npm run test:driver-assignment

# Run performance tests
npm run test:performance
```

### Test Script

Use the provided test script to validate the system:

```bash
cd backend
npx ts-node src/scripts/testDriverAssignment.ts
```

## 🚀 Deployment

### Prerequisites

1. **PostgreSQL with PostGIS**
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Configure database connection
   DATABASE_URL=postgresql://user:password@localhost:5432/lemotech
   ```

3. **Database Migration**
   ```bash
   npm run migrate
   ```

### Production Deployment

1. **Railway Deployment**
   ```bash
   # Deploy to Railway
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   ```bash
   # Set production environment variables
   railway variables set NODE_ENV=production
   railway variables set MAX_SEARCH_RADIUS=50
   ```

## 🔧 Troubleshooting

### Common Issues

1. **No Drivers Available**
   - Check driver status (must be 'available')
   - Verify driver location data
   - Increase search radius

2. **Assignment Failures**
   - Check database connectivity
   - Verify PostGIS extension
   - Review error logs

3. **Performance Issues**
   - Optimize database indexes
   - Reduce search radius
   - Limit concurrent assignments

### Debug Mode

Enable debug logging:

```bash
DEBUG=driver-assignment npm run dev
```

## 📈 Future Enhancements

### Planned Features

1. **Machine Learning Integration**
   - Predictive driver availability
   - Demand forecasting
   - Route optimization

2. **Advanced Matching**
   - Driver preferences
   - Service area restrictions
   - Time-based availability

3. **Analytics Dashboard**
   - Real-time metrics
   - Performance insights
   - Driver analytics

4. **Multi-City Support**
   - City-specific algorithms
   - Regional preferences
   - Cross-city assignments

## 🤝 Contributing

### Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/lemotechinnovations.git
   cd lemotechinnovations
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   npm run db:setup
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

### Code Standards

- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Document all public APIs
- Use meaningful commit messages

## 📞 Support

For technical support or questions:

- **Email**: tech@lemotech.co.za
- **Documentation**: [docs.lemotech.co.za](https://docs.lemotech.co.za)
- **Issues**: [GitHub Issues](https://github.com/yourusername/lemotechinnovations/issues)

---

**Built with ❤️ for the LemoTech platform**
