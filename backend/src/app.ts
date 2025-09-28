import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import uploadRoutes from './routes/uploadRoutes';
import bookingStateRoutes from './routes/bookingStateRoutes';
import driverRoutes from './routes/driverRoutes';
import shopRoutes from './routes/shopRoutes';
import shopOrderRoutes from './routes/shopOrderRoutes';
import adminRoutes from './routes/adminRoutes';
import driverAssignmentRoutes from './routes/driverAssignmentRoutes';
import payfastRoutes from './routes/payfastRoutes';
import cleaningWorkflowRoutes from './routes/cleaningWorkflowRoutes';
import shopQueueRoutes from './routes/shopQueueRoutes';
import shopInventoryTrackingRoutes from './routes/shopInventoryTrackingRoutes';
import routeOptimizationRoutes from './routes/routeOptimizationRoutes';
import shopManagementRoutes from './routes/shopManagementRoutes';
import swaggerRoutes from './routes/swagger';

// Import utilities
import { testConnection, initDatabase } from './infrastructure';
import seedTestData from './scripts/seedTestData';

// Import Dependency Injection
import { SimpleServiceFactory } from './infrastructure/di/simpleServiceFactory';
import { Logger } from './utils/logger';

// Import SignalR Hub
import { BookingHubServer as SocketBookingHub } from './hubs/bookingHub';
import { BookingHubServer } from './hubs/bookingHubServer';
import { setBookingHub } from './controllers/bookingController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for SignalR
const server = createServer(app);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
if (process.env.ENABLE_RATE_LIMITING === 'true') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many request(s) from this IP, please try again later.'
    }
  });
  app.use(limiter);
}

// Logging
if (process.env.ENABLE_LOGGING === 'true') {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for local file uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LemoTech API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome endpoint with API overview
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to LemoTech API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      authentication: '/api/auth',
      bookings: '/api/bookings',
      drivers: '/api/drivers',
      shops: '/api/shops',
      payments: '/api/payfast',
      admin: '/api/admin',
      documentation: '/api-docs'
    },
    health: `${req.protocol}://${req.get('host')}/health`
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/booking-state', bookingStateRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api', shopOrderRoutes); // Shop orders and driver jobs
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/assignments', driverAssignmentRoutes); // Driver assignment routes
app.use('/api/payfast', payfastRoutes); // PayFast payment routes
app.use('/api/cleaning', cleaningWorkflowRoutes); // Cleaning workflow routes
app.use('/api/shop-queue', shopQueueRoutes); // Shop queue management routes
app.use('/api/shop-inventory', shopInventoryTrackingRoutes); // Shop inventory tracking routes
app.use('/api/route-optimization', routeOptimizationRoutes); // Route optimization routes
app.use('/api/shop-management', shopManagementRoutes); // Shop management routes

// API Documentation
app.use('/api-docs', swaggerRoutes); // Swagger API documentation

// PayFast payment result pages
app.get('/payment/success', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Successful - LemoTech</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .success { color: #28a745; font-size: 24px; margin-bottom: 20px; }
            .message { color: #333; font-size: 16px; }
        </style>
    </head>
    <body>
        <div class="success">✅ Payment Successful!</div>
        <div class="message">Your payment has been processed successfully.</div>
        <p><a href="/">Return to Home</a></p>
    </body>
    </html>
  `);
});

app.get('/payment/cancel', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Cancelled - LemoTech</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .cancel { color: #dc3545; font-size: 24px; margin-bottom: 20px; }
            .message { color: #333; font-size: 16px; }
        </style>
    </head>
    <body>
        <div class="cancel">❌ Payment Cancelled</div>
        <div class="message">Your payment was cancelled.</div>
        <p><a href="/">Return to Home</a></p>
    </body>
    </html>
  `);
});

// Service items endpoint (public)
app.get('/api/service-items', async (req, res) => {
  try {
    const { query } = require('./infrastructure/database');
    const result = await query('SELECT * FROM service_items WHERE is_active = true ORDER BY category, name');

    res.json({
      success: true,
      message: 'Service items retrieved successfully',
      data: result.rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        basePrice: parseFloat(item.base_price),
        description: item.description,
        estimatedTime: item.estimated_time,
        icon: item.icon
      }))
    });
  } catch (error) {
    Logger.error('Get service items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  Logger.error('Global error handler:', error);

  // Multer error handling
  if (error.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'File size too large'
    });
    return;
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({
      success: false,
      message: 'Too many files or unexpected field name'
    });
    return;
  }

  // JWT error handling
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired'
    });
    return;
  }

  // Database error handling
  if (error.code === '23505') { // Unique violation
    res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
    return;
  }

  if (error.code === '23503') { // Foreign key violation
    res.status(400).json({
      success: false,
      message: 'Invalid reference'
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'Internal server error'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    Logger.info('🚀 Starting LemoTech API server...');

    // Initialize database with migrations and seed data (can be skipped)
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const shouldInitDb = hasDatabaseUrl && (process.env.INIT_DB_ON_START || 'true') !== 'false';
    if (shouldInitDb) {
      Logger.info('🔄 Initializing database...');
      const initResult = await initDatabase();
      if (!initResult.success) {
        Logger.error('❌ Database initialization failed:', initResult.message);
        if (initResult.errors) {
          initResult.errors.forEach(error => Logger.error('  -', error));
        }
        process.exit(1);
      }
      Logger.info('✅ Database initialized successfully');
    } else if (!hasDatabaseUrl) {
      Logger.warn('⏭️  Skipping database initialization: DATABASE_URL not set');
    } else {
      Logger.warn('⏭️  Skipping database initialization on start (INIT_DB_ON_START=false)');
    }

    // Initialize Dependency Injection (requires DATABASE_URL)
    if (hasDatabaseUrl) {
      Logger.info('🔄 Initializing dependency injection...');
      try {
        await SimpleServiceFactory.initialize();
        Logger.info('✅ Dependency injection initialized successfully');
      } catch (error) {
        const err = error as Error;
        Logger.error('❌ Dependency injection initialization failed:', {
          message: err?.message || 'Unknown error',
          stack: err?.stack || 'No stack trace',
          details: error
        });
        // Don't exit - continue without DI for basic functionality
        Logger.warn('⚠️ Continuing without full dependency injection...');
      }
    } else {
      Logger.warn('⏭️  Skipping DI initialization: DATABASE_URL not set');
    }

    // Optionally seed test data
    if (process.env.SEED_TEST_DATA === 'true') {
      Logger.info('🌱 Seeding test data (SEED_TEST_DATA=true) ...');
      await seedTestData();
    }

    // Initialize Socket.IO SignalR Hub
    const socketHub = new SocketBookingHub(server);
    const bookingHub = new BookingHubServer(socketHub);
    setBookingHub(bookingHub); // Pass hub to controllers
    Logger.info('📡 Socket.IO SignalR Hub initialized successfully');
    Logger.info('📡 Real-time connection available at: http://localhost:3001/hubs/bookingHub');

    // Start server
    server.listen(PORT, () => {
      Logger.info(`✅ LemoTech API server running on http://localhost:${PORT}`);
      Logger.info(`📚 Health check: http://localhost:${PORT}/health`);
      Logger.info(`🔗 API endpoints: http://localhost:${PORT}/api`);
      Logger.info(`📡 SignalR Hub: http://localhost:${PORT}/hubs/bookingHub (Socket.IO)`);
      Logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      Logger.info('🎉 STARTUP COMPLETE - Server ready to accept connections!');
      
      // For Azure deployment, signal completion and then let the process run normally
      if (process.env.NODE_ENV === 'production') {
        console.log('DEPLOYMENT_COMPLETE');
        console.log('APPLICATION_READY');
        console.log(`[${new Date().toISOString()}] LemoTech API - Server fully initialized and ready`);
        
        // Only output health status for first 2 minutes, then go quiet
        let healthCount = 0;
        const healthInterval = setInterval(() => {
          healthCount++;
          console.log(`[${new Date().toISOString()}] Health check ${healthCount}/4 - Server operational`);
          
          if (healthCount >= 4) { // 4 * 30s = 2 minutes
            clearInterval(healthInterval);
            console.log(`[${new Date().toISOString()}] Health monitoring complete - Server running in background`);
          }
        }, 30000);
      }
    });
  } catch (error) {
    Logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;

