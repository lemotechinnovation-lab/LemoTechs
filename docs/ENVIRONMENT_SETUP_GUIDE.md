# LemoTech Environment Setup Guide

## 🎯 **Complete Environment Strategy**

This guide helps you set up all 6 environments for the LemoTech platform with proper isolation and configuration.

---

## 📋 **Environment Overview**

| Environment | Trigger | Purpose | URLs |
|-------------|---------|---------|------|
| **Development** | `dev-*` tags | Daily development | Azure default URLs |
| **QA** | `qa-*` tags | Quality assurance testing | `lemotech-*-qa.azurewebsites.net` |
| **UAT** | `uat-*` tags | User acceptance testing | `lemotech-*-uat.azurewebsites.net` |
| **Staging** | `release/*` branches | Pre-production staging | Azure default URLs |
| **Hotfix** | `hotfix-*` tags | Emergency fixes | Azure default URLs |
| **Production** | `v*.*.*` tags | Live production | Custom domains |

---

## 🔧 **Required Azure App Services**

### **Existing App Services (Keep These):**
- ✅ `lemotech-api-backend` (Production)
- ✅ `lemotech-frontend` (Production) 
- ✅ `lemotech-admin` (Production)

### **New App Services to Create:**

#### **UAT Environment:**
- `lemotech-api-uat`
- `lemotech-frontend-uat`
- `lemotech-admin-uat`

#### **QA Environment:**
- `lemotech-api-qa`
- `lemotech-frontend-qa`
- `lemotech-admin-qa`

---

## 🚀 **Step-by-Step Azure Setup**

### **1. Create UAT App Services**

#### **Backend API (UAT):**
```bash
# Create App Service Plan for UAT
az appservice plan create \
  --resource-group lemotech-platform \
  --name lemotech-uat-plan \
  --location southafricanorth \
  --sku F1 \
  --is-linux

# Create Backend API App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-uat-plan \
  --name lemotech-api-uat \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=UAT Component=Backend
```

#### **Frontend App (UAT):**
```bash
# Create Frontend App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-uat-plan \
  --name lemotech-frontend-uat \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=UAT Component=Frontend
```

#### **Admin Dashboard (UAT):**
```bash
# Create Admin App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-uat-plan \
  --name lemotech-admin-uat \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=UAT Component=Admin
```

### **2. Create QA App Services**

#### **Backend API (QA):**
```bash
# Create App Service Plan for QA
az appservice plan create \
  --resource-group lemotech-platform \
  --name lemotech-qa-plan \
  --location southafricanorth \
  --sku F1 \
  --is-linux

# Create Backend API App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-qa-plan \
  --name lemotech-api-qa \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=QA Component=Backend
```

#### **Frontend App (QA):**
```bash
# Create Frontend App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-qa-plan \
  --name lemotech-frontend-qa \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=QA Component=Frontend
```

#### **Admin Dashboard (QA):**
```bash
# Create Admin App Service
az webapp create \
  --resource-group lemotech-platform \
  --plan lemotech-qa-plan \
  --name lemotech-admin-qa \
  --runtime "NODE:20-lts" \
  --tags Project=LemoTech Environment=QA Component=Admin
```

---

## ⚙️ **App Service Configuration**

### **Environment-Specific Settings**

#### **UAT Environment Variables:**
```bash
# Backend UAT Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-api-uat \
  --settings \
    NODE_ENV=uat \
    PORT=8000 \
    BACKEND_URL=https://lemotech-api-uat.azurewebsites.net \
    FRONTEND_URL=https://lemotech-frontend-uat.southafricanorth-01.azurewebsites.net \
    ADMIN_URL=https://lemotech-admin-uat.southafricanorth-01.azurewebsites.net

# Frontend UAT Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-frontend-uat \
  --settings \
    NODE_ENV=uat \
    FRONTEND_URL=https://lemotech-frontend-uat.southafricanorth-01.azurewebsites.net \
    BACKEND_URL=https://lemotech-api-uat.azurewebsites.net

# Admin UAT Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-admin-uat \
  --settings \
    NODE_ENV=uat \
    ADMIN_URL=https://lemotech-admin-uat.southafricanorth-01.azurewebsites.net \
    BACKEND_URL=https://lemotech-api-uat.azurewebsites.net
```

#### **QA Environment Variables:**
```bash
# Backend QA Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-api-qa \
  --settings \
    NODE_ENV=qa \
    PORT=8000 \
    BACKEND_URL=https://lemotech-api-qa.azurewebsites.net \
    FRONTEND_URL=https://lemotech-frontend-qa.southafricanorth-01.azurewebsites.net \
    ADMIN_URL=https://lemotech-admin-qa.southafricanorth-01.azurewebsites.net

# Frontend QA Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-frontend-qa \
  --settings \
    NODE_ENV=qa \
    FRONTEND_URL=https://lemotech-frontend-qa.southafricanorth-01.azurewebsites.net \
    BACKEND_URL=https://lemotech-api-qa.azurewebsites.net

# Admin QA Settings
az webapp config appsettings set \
  --resource-group lemotech-platform \
  --name lemotech-admin-qa \
  --settings \
    NODE_ENV=qa \
    ADMIN_URL=https://lemotech-admin-qa.southafricanorth-01.azurewebsites.net \
    BACKEND_URL=https://lemotech-api-qa.azurewebsites.net
```

---

## 🎯 **Testing the Environments**

### **1. Commit and Push Configuration**
```bash
git add .
git commit -m "Configure UAT and QA environments with dedicated App Services"
git push origin master
```

### **2. Test UAT Environment**
```powershell
.\create-release.ps1 -Version "1.0.0" -Type "uat" -Message "Test UAT environment"
```

### **3. Test QA Environment**
```powershell
.\create-release.ps1 -Version "1.0.0" -Type "qa" -Message "Test QA environment"
```

### **4. Verify Deployments**
Check that the applications are accessible at:
- **UAT**: `lemotech-*-uat.azurewebsites.net`
- **QA**: `lemotech-*-qa.azurewebsites.net`

---

## 📊 **Environment Benefits**

### **✅ Proper Isolation**
- Each environment has its own App Services
- No interference between environments
- Independent scaling and configuration

### **✅ Environment-Specific Configuration**
- Different database connections
- Environment-specific feature flags
- Separate monitoring and logging

### **✅ Team Collaboration**
- QA team can test without affecting UAT
- UAT team can validate without affecting production
- Developers can test in isolation

### **✅ Deployment Safety**
- Test deployments before production
- Rollback capabilities per environment
- Gradual rollout strategy

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **App Service Creation Fails:**
- Check resource group permissions
- Verify App Service Plan exists
- Ensure unique names across Azure

#### **Deployment Fails:**
- Verify App Service names match pipeline configuration
- Check service connection permissions
- Review deployment logs in Azure DevOps

#### **Environment Variables Not Applied:**
- Verify App Service names are correct
- Check Azure CLI permissions
- Review app settings in Azure Portal

---

## 🎉 **Success Criteria**

Your environment setup is complete when:
- ✅ All 6 App Services exist in Azure
- ✅ Environment variables are configured
- ✅ Pipeline deployments succeed
- ✅ Applications are accessible at correct URLs
- ✅ Each environment is isolated and functional

This gives you a **complete enterprise-grade multi-environment CI/CD pipeline**! 🚀
