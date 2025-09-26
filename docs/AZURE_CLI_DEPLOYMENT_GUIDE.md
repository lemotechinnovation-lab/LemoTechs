# LemoTech Platform - Azure CLI Deployment Guide

This comprehensive guide walks you through deploying the entire LemoTech platform using Azure CLI commands.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Deployment](#database-deployment)
4. [Backend API Deployment](#backend-api-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Admin Dashboard Deployment](#admin-dashboard-deployment)
7. [Configuration & Testing](#configuration--testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
```bash
# Install Azure CLI
# Windows (PowerShell as Administrator)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# macOS
brew install azure-cli

# Linux (Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

```bash
# Install Node.js 20+ and npm
# Download from https://nodejs.org/

# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Verify installations
az --version
node --version
npm --version
swa --version
```

### Azure Account Setup
```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account list --output table
az account set --subscription "Your-Subscription-Name"

# Verify current subscription
az account show --output table
```

---

## Environment Setup

### 1. Create Resource Group
```bash
# Set variables
RESOURCE_GROUP="lemotech-platform"
LOCATION="westeurope"
SUBSCRIPTION_ID=$(az account show --query id --output tsv)

# Create resource group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --tags Project=LemoTech Environment=Production Owner=LemoTechInnovations
```

### 2. Clone Repository
```bash
# Clone your repository
git clone https://dev.azure.com/LemoTechInnovations/LemoTech/_git/LemoTech
cd LemoTech

# Or if using your local directory
cd /path/to/lemotechinnovations
```

---

## Database Deployment

### 1. Create PostgreSQL Server
```bash
# Set database variables
DB_SERVER_NAME="lemotech-db-server"
DB_ADMIN_USER="lemotech_admin"
DB_ADMIN_PASSWORD="SecureDB2024!Platform"
DB_NAME="lemotech_innovations"

# Create PostgreSQL Flexible Server
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
```

### 2. Configure Database
```bash
# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_NAME

# Configure firewall (allow Azure services)
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name "AllowAzureServices" \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Add your current IP (replace with your actual IP)
MY_IP=$(curl -s https://api.ipify.org)
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name "AllowMyIP" \
  --start-ip-address $MY_IP \
  --end-ip-address $MY_IP
```

### 3. Run Database Migrations
```bash
# Set database connection string
export DATABASE_URL="postgresql://$DB_ADMIN_USER:$DB_ADMIN_PASSWORD@$DB_SERVER_NAME.postgres.database.azure.com:5432/$DB_NAME?sslmode=require"

# Navigate to backend and run migrations
cd backend
npm install
npm run db:legacy:up

# Verify tables created
echo "Database deployed successfully!"
cd ..
```

---

## Backend API Deployment

### 1. Create App Service Plan
```bash
# Set backend variables
APP_SERVICE_PLAN="lemotech-app-plan"
BACKEND_APP_NAME="lemotech-api-backend"

# Create App Service Plan (F1 Free tier)
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --location $LOCATION \
  --sku F1 \
  --is-linux \
  --tags Project=LemoTech Environment=Production
```

### 2. Create Web App
```bash
# Create Node.js Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $BACKEND_APP_NAME \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=Production Component=Backend
```

### 3. Configure App Settings
```bash
# Set environment variables
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
```

### 4. Configure Deployment
```bash
# Set startup command
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --startup-file "cd backend && npm install && npm run build && npm start"

# Enable basic auth for SCM
az webapp auth update \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --enabled true
```

### 5. Deploy Code
```bash
# Create deployment files
cat > .deployment << EOF
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
PROJECT = backend
EOF

# Deploy using local git
az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME

# Get deployment URL
BACKEND_GIT_URL=$(az webapp deployment source show \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --query repoUrl --output tsv)

# Add git remote and push
git remote add azure-backend $BACKEND_GIT_URL
git push azure-backend master

echo "Backend deployed to: https://$BACKEND_APP_NAME.azurewebsites.net"
```

---

## Frontend Deployment

### 1. Create Static Web App
```bash
# Set frontend variables
FRONTEND_APP_NAME="lemotech-frontend"

# Create Static Web App
az staticwebapp create \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --location $LOCATION \
  --tags Project=LemoTech Environment=Production Component=Frontend

# Get deployment token
FRONTEND_TOKEN=$(az staticwebapp secrets list \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --query properties.apiKey --output tsv)

echo "Frontend deployment token: $FRONTEND_TOKEN"
```

### 2. Build and Deploy Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies and build
npm install
npm run build

# Deploy using Static Web Apps CLI
swa deploy ./dist --deployment-token "$FRONTEND_TOKEN"

# Get the URL
FRONTEND_URL=$(az staticwebapp show \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --query defaultHostname --output tsv)

echo "Frontend deployed to: https://$FRONTEND_URL"
cd ..
```

---

## Admin Dashboard Deployment

### 1. Create Admin Static Web App
```bash
# Set admin variables
ADMIN_APP_NAME="lemotech-admin-dashboard"

# Create Static Web App for admin
az staticwebapp create \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_APP_NAME \
  --location $LOCATION \
  --tags Project=LemoTech Environment=Production Component=AdminDashboard

# Get deployment token
ADMIN_TOKEN=$(az staticwebapp secrets list \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_APP_NAME \
  --query properties.apiKey --output tsv)

echo "Admin deployment token: $ADMIN_TOKEN"
```

### 2. Build and Deploy Admin Dashboard
```bash
# Navigate to admin-dashboard directory
cd admin-dashboard

# Install dependencies and build (if not already built)
npm install
npm run build

# Deploy using Static Web Apps CLI
swa deploy ./dist --deployment-token "$ADMIN_TOKEN"

# Get the URL
ADMIN_URL=$(az staticwebapp show \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_APP_NAME \
  --query defaultHostname --output tsv)

echo "Admin dashboard deployed to: https://$ADMIN_URL"
cd ..
```

---

## Configuration & Testing

### 1. Test Deployments
```bash
# Test backend health
echo "Testing backend..."
curl -I https://$BACKEND_APP_NAME.azurewebsites.net/health

# Test frontend
echo "Testing frontend..."
curl -I https://$FRONTEND_URL

# Test admin dashboard
echo "Testing admin dashboard..."
curl -I https://$ADMIN_URL
```

### 2. Configure Custom Domains (Optional)
```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --hostname "app.lemotech.com"

# Add custom domain to backend
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $BACKEND_APP_NAME \
  --hostname "api.lemotech.com"
```

### 3. View Deployment Summary
```bash
echo "=== LemoTech Platform Deployment Complete ==="
echo "Resource Group: $RESOURCE_GROUP"
echo "Database: $DB_SERVER_NAME.postgres.database.azure.com"
echo "Backend API: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend: https://$FRONTEND_URL"
echo "Admin Dashboard: https://$ADMIN_URL"
echo "================================================"
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Check database status
az postgres flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --query state

# Test connection
psql "$DATABASE_URL" -c "SELECT version();"
```

#### 2. Backend Build Failures
```bash
# Check logs
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME

# Restart app
az webapp restart \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME
```

#### 3. Static Web App Deployment Issues
```bash
# Check deployment status
az staticwebapp show \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME

# Redeploy if needed
swa deploy ./frontend/dist --deployment-token "$FRONTEND_TOKEN"
```

#### 4. Environment Variables
```bash
# List current app settings
az webapp config appsettings list \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --output table

# Update specific setting
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings KEY=VALUE
```

### Useful Commands
```bash
# List all resources
az resource list \
  --resource-group $RESOURCE_GROUP \
  --output table

# Get resource costs
az consumption usage list \
  --start-date $(date -d "30 days ago" +%Y-%m-%d) \
  --end-date $(date +%Y-%m-%d)

# Clean up (BE CAREFUL!)
# az group delete --resource-group $RESOURCE_GROUP --yes --no-wait
```

---

## Environment Variables Reference

### Backend Required Variables
- `NODE_ENV`: production
- `PORT`: 8000
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string
- `CORS_ORIGIN`: Frontend domain or *
- `AUTO_MIGRATE`: true/false
- `SEED_TEST_DATA`: true/false

### Frontend Environment Variables (Optional)
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- Firebase configuration (if using Firebase)

---

## Security Considerations

1. **Change default passwords** before production
2. **Use Azure Key Vault** for sensitive secrets
3. **Configure proper CORS** origins
4. **Enable HTTPS** for all services
5. **Set up proper firewall rules**
6. **Enable logging and monitoring**

---

## Cost Optimization

### Free Tier Resources Used
- App Service Plan: F1 (Free)
- PostgreSQL: Burstable B1ms (~$12/month)
- Static Web Apps: Free tier (2 apps)

### Scaling Considerations
- Upgrade App Service Plan for production load
- Consider Azure Database for PostgreSQL scaling
- Monitor usage and costs regularly

---

This guide provides a complete Azure CLI deployment workflow for the LemoTech platform. Adjust variables and configuration as needed for your specific environment.
