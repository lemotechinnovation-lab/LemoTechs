# 🍋 LemoTech Innovations - Full Stack Application

## 📁 Project Structure

```
lemotech-innovations/
├── 📁 frontend/                    # React + TypeScript Frontend
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 components/         # React components
│   │   ├── 📁 pages/              # Page components
│   │   ├── 📁 services/           # API services
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 types/              # TypeScript types
│   │   ├── 📁 constants/          # App constants
│   │   ├── 📁 context/            # React context
│   │   └── 📁 styles/             # CSS styles
│   ├── 📁 public/                 # Static assets
│   ├── 📁 dist/                   # Build output
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tsconfig.json              # TypeScript config
│   └── eslint.config.js           # ESLint configuration
│
├── 📁 backend/                     # Node.js + TypeScript Backend
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 controllers/        # Route controllers
│   │   ├── 📁 services/           # Business logic
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 routes/             # API routes
│   │   ├── 📁 types/              # TypeScript types
│   │   └── 📁 utils/              # Utility functions
│   ├── 📁 dist/                   # Build output
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── Dockerfile                 # Docker configuration
│
├── 📁 docs/                       # Documentation files
├── 📁 templates/                   # CI/CD templates
├── 📄 package.json                # Root package.json (workspace)
├── 📄 azure-pipelines.yml         # Azure DevOps CI/CD
└── 📄 README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lemotech-innovations
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 3000) and backend (port 3001) simultaneously.

## 🛠️ Development Commands

### Root Level Commands (Workspace)
```bash
# Start both frontend and backend
npm run dev

# Build both applications
npm run build

# Run tests for both
npm run test

# Lint both codebases
npm run lint

# Clean build artifacts
npm run clean
```

### Frontend Only
```bash
# Navigate to frontend
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Backend Only
```bash
# Navigate to backend
cd backend

# Start development server
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Material-UI + Custom CSS
- **State Management**: React Context + Hooks
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API with custom services
- **Authentication**: Firebase Auth

### Backend (Node.js + TypeScript + Express)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: Firebase Admin SDK
- **Database**: Firebase Firestore
- **File Upload**: Multer middleware
- **Validation**: Custom middleware

## 📦 Key Features

### Frontend Features
- 🎨 Modern UI with Material-UI components
- 📱 Responsive design (mobile, tablet, desktop)
- 🔐 Firebase authentication
- 📊 Analytics dashboard
- 🗓️ Advanced booking system with date/time pickers
- 💳 Payment integration
- 🗺️ Google Maps integration
- 📈 Business metrics and revenue analytics
- 🎯 Real-time notifications

### Backend Features
- 🔒 Secure API endpoints
- 🔐 Firebase authentication middleware
- 📁 File upload handling
- 📊 Booking management
- 💰 Payment processing
- 📧 Email notifications
- 🗃️ Data validation and sanitization

## 🌍 Environment Setup

### Frontend Environment Variables
Create `frontend/.env`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### Backend Environment Variables
Create `backend/.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Firebase Admin
FIREBASE_ADMIN_SDK_KEY=path_to_service_account_key.json

# Database
DATABASE_URL=your_database_url
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend Deployment
The backend can be deployed to:
- Railway (current setup)
- Vercel Functions
- AWS Lambda
- Google Cloud Functions
- Traditional VPS/Cloud servers

## 📚 Documentation

- [Frontend Cleanup Summary](FRONTEND_CLEANUP_SUMMARY.md)
- [Card Sizing Summary](CARD_SIZING_SUMMARY.md)
- [Build Fix Summary](BUILD_FIX_SUMMARY.md)
- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Competitor Analysis](COMPETITOR_ANALYSIS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@lemotech.co.za or join our Slack channel.

---

**Built with ❤️ by LemoTech Innovations Team**