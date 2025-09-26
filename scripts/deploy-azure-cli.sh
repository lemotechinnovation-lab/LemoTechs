#!/bin/bash

# LemoTech Platform - Azure CLI Deployment Script
# This script automates the entire deployment process

set -e  # Exit on any error

echo "🚀 LemoTech Platform - Azure CLI Deployment"
echo "=============================================="

# Configuration
RESOURCE_GROUP="lemotech-platform"
LOCATION="westeurope"
DB_SERVER_NAME="lemotech-db-server"
DB_ADMIN_USER="lemotech_admin"
DB_ADMIN_PASSWORD="SecureDB2024!Platform"
DB_NAME="lemotech_innovations"
APP_SERVICE_PLAN="lemotech-app-plan"
BACKEND_APP_NAME="lemotech-api-backend"
FRONTEND_APP_NAME="lemotech-frontend"
ADMIN_APP_NAME="lemotech-admin-dashboard"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI not found. Please install it first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js 20+."
        exit 1
    fi
    
    if ! command -v swa &> /dev/null; then
        print_warning "Static Web Apps CLI not found. Installing..."
        npm install -g @azure/static-web-apps-cli
    fi
    
    print_success "Prerequisites check passed"
}

# Login to Azure
azure_login() {
    print_step "Checking Azure authentication..."
    
    if ! az account show &> /dev/null; then
        print_step "Please login to Azure..."
        az login
    fi
    
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    print_success "Logged in to Azure (Subscription: $SUBSCRIPTION_ID)"
}

# Create resource group
create_resource_group() {
    print_step "Creating resource group: $RESOURCE_GROUP"
    
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION \
        --tags Project=LemoTech Environment=Production Owner=LemoTechInnovations
    
    print_success "Resource group created"
}

# Deploy database
deploy_database() {
    print_step "Deploying PostgreSQL database..."
    
    az postgres flexible-server create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --location $LOCATION \
        --admin-user $DB_ADMIN_USER \
        --admin-password $DB_ADMIN_PASSWORD \
        --sku-name Standard_B1ms \
        --tier Burstable \
        --version 15 \
        --storage-size 32 \
        --tags Project=LemoTech Environment=Production Component=Database
    
    # Create database
    az postgres flexible-server db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $DB_SERVER_NAME \
        --database-name $DB_NAME
    
    # Configure firewall
    az postgres flexible-server firewall-rule create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --rule-name "AllowAzureServices" \
        --start-ip-address 0.0.0.0 \
        --end-ip-address 0.0.0.0
    
    print_success "Database deployed"
}

# Deploy backend
deploy_backend() {
    print_step "Deploying backend API..."
    
    # Create App Service Plan
    az appservice plan create \
        --resource-group $RESOURCE_GROUP \
        --name $APP_SERVICE_PLAN \
        --location $LOCATION \
        --sku F1 \
        --is-linux \
        --tags Project=LemoTech Environment=Production
    
    # Create Web App
    az webapp create \
        --resource-group $RESOURCE_GROUP \
        --plan $APP_SERVICE_PLAN \
        --name $BACKEND_APP_NAME \
        --runtime "NODE:20-lts" \
        --tags Project=LemoTech Environment=Production Component=Backend
    
    # Configure app settings
    az webapp config appsettings set \
        --resource-group $RESOURCE_GROUP \
        --name $BACKEND_APP_NAME \
        --settings \
            NODE_ENV=production \
            PORT=8000 \
            DATABASE_URL="postgresql://$DB_ADMIN_USER:$DB_ADMIN_PASSWORD@$DB_SERVER_NAME.postgres.database.azure.com:5432/$DB_NAME?sslmode=require" \
            JWT_SECRET="LemoTech2024!SecureJWT!Production!Key!9x8v7c6b5n4m3" \
            CORS_ORIGIN="*" \
            AUTO_MIGRATE=true \
            SEED_TEST_DATA=false
    
    print_success "Backend deployed"
}

# Deploy frontend
deploy_frontend() {
    print_step "Deploying frontend..."
    
    # Create Static Web App
    az staticwebapp create \
        --resource-group $RESOURCE_GROUP \
        --name $FRONTEND_APP_NAME \
        --location $LOCATION \
        --tags Project=LemoTech Environment=Production Component=Frontend
    
    print_success "Frontend Static Web App created"
    print_warning "Use 'az staticwebapp secrets list' to get deployment token"
}

# Deploy admin dashboard
deploy_admin() {
    print_step "Deploying admin dashboard..."
    
    # Create Static Web App for admin
    az staticwebapp create \
        --resource-group $RESOURCE_GROUP \
        --name $ADMIN_APP_NAME \
        --location $LOCATION \
        --tags Project=LemoTech Environment=Production Component=AdminDashboard
    
    print_success "Admin dashboard Static Web App created"
    print_warning "Use 'az staticwebapp secrets list' to get deployment token"
}

# Show deployment summary
show_summary() {
    print_step "Deployment Summary"
    echo "=================="
    echo "Resource Group: $RESOURCE_GROUP"
    echo "Database: $DB_SERVER_NAME.postgres.database.azure.com"
    echo "Backend API: https://$BACKEND_APP_NAME.azurewebsites.net"
    echo ""
    echo "Next steps:"
    echo "1. Get deployment tokens for Static Web Apps"
    echo "2. Build and deploy frontend and admin dashboard"
    echo "3. Run database migrations"
    echo "4. Test all services"
    print_success "Deployment completed!"
}

# Main execution
main() {
    check_prerequisites
    azure_login
    create_resource_group
    deploy_database
    deploy_backend
    deploy_frontend
    deploy_admin
    show_summary
}

# Run main function
main "$@"
