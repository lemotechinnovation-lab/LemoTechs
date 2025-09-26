#!/bin/bash

# LemoTech Production Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting LemoTech Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git and try again."
        exit 1
    fi
    
    print_status "All dependencies are installed ✓"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    # Install dependencies
    npm install
    
    # Build TypeScript
    npm run build
    
    # Run tests (optional)
    if [ "$1" = "--test" ]; then
        print_status "Running backend tests..."
        npm test
    fi
    
    cd ..
    print_status "Backend build completed ✓"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    cd ..
    print_status "Frontend build completed ✓"
}

# Deploy to Railway (Backend)
deploy_railway() {
    print_status "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it first:"
        echo "npm install -g @railway/cli"
        echo "Then run: railway login"
        return 1
    fi
    
    cd backend
    
    # Deploy to Railway
    railway up
    
    cd ..
    print_status "Backend deployed to Railway ✓"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Please install it first:"
        echo "npm install -g vercel"
        echo "Then run: vercel login"
        return 1
    fi
    
    cd frontend
    
    # Deploy to Vercel
    vercel --prod
    
    cd ..
    print_status "Frontend deployed to Vercel ✓"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd backend
    
    # Run migrations
    npm run migrate:prod
    
    cd ..
    print_status "Database migrations completed ✓"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Get deployment URLs (you'll need to update these)
    BACKEND_URL="https://lemotech-backend.railway.app"
    FRONTEND_URL="https://lemotech-frontend.vercel.app"
    
    # Check backend health
    if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        print_status "Backend health check passed ✓"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
        print_status "Frontend health check passed ✓"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    print_status "All health checks passed ✓"
}

# Main deployment function
main() {
    echo "🚀 LemoTech Production Deployment"
    echo "================================"
    
    # Check dependencies
    check_dependencies
    
    # Build applications
    build_backend "$1"
    build_frontend
    
    # Deploy applications
    if [ "$1" = "--deploy" ]; then
        deploy_railway
        deploy_vercel
        run_migrations
        health_check
    else
        print_warning "Use --deploy flag to actually deploy to production"
        print_status "Build completed. Ready for deployment."
    fi
    
    echo ""
    print_status "🎉 Deployment process completed!"
    echo ""
    echo "Next steps:"
    echo "1. Set up environment variables in Railway and Vercel"
    echo "2. Configure custom domains (optional)"
    echo "3. Set up monitoring and alerts"
    echo "4. Test all functionality"
    echo ""
    echo "For detailed instructions, see: docs/PRODUCTION_DEPLOYMENT_GUIDE.md"
}

# Handle command line arguments
case "$1" in
    --test)
        main --test
        ;;
    --deploy)
        main --deploy
        ;;
    --help)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --test    Build and run tests"
        echo "  --deploy  Build and deploy to production"
        echo "  --help    Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Build only"
        echo "  $0 --test       # Build and test"
        echo "  $0 --deploy     # Build and deploy"
        ;;
    *)
        main
        ;;
esac
