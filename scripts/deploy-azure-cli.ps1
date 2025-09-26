# LemoTech Platform - Azure CLI Deployment Script (PowerShell)
# This script automates the entire deployment process for Windows

param(
    [string]$ResourceGroup = "lemotech-platform",
    [string]$Location = "westeurope",
    [switch]$SkipPrerequisites
)

# Configuration
$Config = @{
    ResourceGroup = $ResourceGroup
    Location = $Location
    DbServerName = "lemotech-db-server"
    DbAdminUser = "lemotech_admin"
    DbAdminPassword = "SecureDB2024!Platform"
    DbName = "lemotech_innovations"
    AppServicePlan = "lemotech-app-plan"
    BackendAppName = "lemotech-api-backend"
    FrontendAppName = "lemotech-frontend"
    AdminAppName = "lemotech-admin-dashboard"
}

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Blue = "Blue"
    Yellow = "Yellow"
}

function Write-Step {
    param([string]$Message)
    Write-Host "[STEP] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Test-Prerequisites {
    Write-Step "Checking prerequisites..."
    
    # Check Azure CLI
    if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
        Write-Error "Azure CLI not found. Please install it first."
        Write-Host "Download from: https://aka.ms/installazurecliwindows"
        exit 1
    }
    
    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js not found. Please install Node.js 20+."
        Write-Host "Download from: https://nodejs.org/"
        exit 1
    }
    
    # Check Static Web Apps CLI
    if (-not (Get-Command swa -ErrorAction SilentlyContinue)) {
        Write-Warning "Static Web Apps CLI not found. Installing..."
        npm install -g @azure/static-web-apps-cli
    }
    
    Write-Success "Prerequisites check passed"
}

function Connect-Azure {
    Write-Step "Checking Azure authentication..."
    
    $account = az account show 2>$null | ConvertFrom-Json
    if (-not $account) {
        Write-Step "Please login to Azure..."
        az login
        $account = az account show | ConvertFrom-Json
    }
    
    Write-Success "Logged in to Azure (Subscription: $($account.id))"
    return $account.id
}

function New-ResourceGroup {
    Write-Step "Creating resource group: $($Config.ResourceGroup)"
    
    az group create `
        --name $Config.ResourceGroup `
        --location $Config.Location `
        --tags Project=LemoTech Environment=Production Owner=LemoTechInnovations
    
    Write-Success "Resource group created"
}

function New-Database {
    Write-Step "Deploying PostgreSQL database..."
    
    # Create PostgreSQL Flexible Server
    az postgres flexible-server create `
        --resource-group $Config.ResourceGroup `
        --name $Config.DbServerName `
        --location $Config.Location `
        --admin-user $Config.DbAdminUser `
        --admin-password $Config.DbAdminPassword `
        --sku-name Standard_B1ms `
        --tier Burstable `
        --version 15 `
        --storage-size 32 `
        --tags Project=LemoTech Environment=Production Component=Database
    
    # Create database
    az postgres flexible-server db create `
        --resource-group $Config.ResourceGroup `
        --server-name $Config.DbServerName `
        --database-name $Config.DbName
    
    # Configure firewall for Azure services
    az postgres flexible-server firewall-rule create `
        --resource-group $Config.ResourceGroup `
        --name $Config.DbServerName `
        --rule-name "AllowAzureServices" `
        --start-ip-address 0.0.0.0 `
        --end-ip-address 0.0.0.0
    
    Write-Success "Database deployed"
}

function New-Backend {
    Write-Step "Deploying backend API..."
    
    # Create App Service Plan
    az appservice plan create `
        --resource-group $Config.ResourceGroup `
        --name $Config.AppServicePlan `
        --location $Config.Location `
        --sku F1 `
        --is-linux `
        --tags Project=LemoTech Environment=Production
    
    # Create Web App
    az webapp create `
        --resource-group $Config.ResourceGroup `
        --plan $Config.AppServicePlan `
        --name $Config.BackendAppName `
        --runtime "NODE:20-lts" `
        --tags Project=LemoTech Environment=Production Component=Backend
    
    # Configure app settings
    $databaseUrl = "postgresql://$($Config.DbAdminUser):$($Config.DbAdminPassword)@$($Config.DbServerName).postgres.database.azure.com:5432/$($Config.DbName)?sslmode=require"
    
    az webapp config appsettings set `
        --resource-group $Config.ResourceGroup `
        --name $Config.BackendAppName `
        --settings `
            NODE_ENV=production `
            PORT=8000 `
            "DATABASE_URL=$databaseUrl" `
            JWT_SECRET="LemoTech2024!SecureJWT!Production!Key!9x8v7c6b5n4m3" `
            CORS_ORIGIN="*" `
            AUTO_MIGRATE=true `
            SEED_TEST_DATA=false
    
    Write-Success "Backend deployed to: https://$($Config.BackendAppName).azurewebsites.net"
}

function New-Frontend {
    Write-Step "Creating frontend Static Web App..."
    
    az staticwebapp create `
        --resource-group $Config.ResourceGroup `
        --name $Config.FrontendAppName `
        --location $Config.Location `
        --tags Project=LemoTech Environment=Production Component=Frontend
    
    Write-Success "Frontend Static Web App created"
    Write-Warning "Get deployment token with: az staticwebapp secrets list --resource-group $($Config.ResourceGroup) --name $($Config.FrontendAppName)"
}

function New-AdminDashboard {
    Write-Step "Creating admin dashboard Static Web App..."
    
    az staticwebapp create `
        --resource-group $Config.ResourceGroup `
        --name $Config.AdminAppName `
        --location $Config.Location `
        --tags Project=LemoTech Environment=Production Component=AdminDashboard
    
    Write-Success "Admin dashboard Static Web App created"
    Write-Warning "Get deployment token with: az staticwebapp secrets list --resource-group $($Config.ResourceGroup) --name $($Config.AdminAppName)"
}

function Show-Summary {
    Write-Step "Deployment Summary"
    Write-Host "==================" -ForegroundColor White
    Write-Host "Resource Group: $($Config.ResourceGroup)"
    Write-Host "Database: $($Config.DbServerName).postgres.database.azure.com"
    Write-Host "Backend API: https://$($Config.BackendAppName).azurewebsites.net"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Get deployment tokens for Static Web Apps"
    Write-Host "2. Build and deploy frontend: cd frontend && npm run build && swa deploy ./dist --deployment-token [TOKEN]"
    Write-Host "3. Build and deploy admin: cd admin-dashboard && npm run build && swa deploy ./dist --deployment-token [TOKEN]"
    Write-Host "4. Run database migrations: cd backend && npm run db:legacy:up"
    Write-Host "5. Test all services"
    Write-Success "Deployment completed!"
}

function Invoke-Deployment {
    Write-Host "🚀 LemoTech Platform - Azure CLI Deployment" -ForegroundColor Blue
    Write-Host "==============================================" -ForegroundColor Blue
    
    try {
        if (-not $SkipPrerequisites) {
            Test-Prerequisites
        }
        
        Connect-Azure
        New-ResourceGroup
        New-Database
        New-Backend
        New-Frontend
        New-AdminDashboard
        Show-Summary
    }
    catch {
        Write-Error "Deployment failed: $($_.Exception.Message)"
        exit 1
    }
}

# Main execution
Invoke-Deployment
