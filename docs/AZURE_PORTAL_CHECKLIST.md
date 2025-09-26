# Azure Portal Configuration Checklist for DevOps Pipeline

## 🎯 **Azure Portal Settings to Verify/Update**

Before running your Azure DevOps pipeline, ensure these Azure Portal configurations are correct:

---

## 🔧 **App Service Configuration**

### 1. **General Settings**
Navigate to: **Azure Portal** → **App Services** → **lemotech-api-backend** → **Configuration** → **General settings**

✅ **Runtime stack**: `Node 20 LTS`
✅ **Platform**: `Linux`
✅ **Always On**: `On` (prevents cold starts)
✅ **ARR affinity**: `Off` (better for stateless APIs)

### 2. **Application Settings**
Navigate to: **Configuration** → **Application settings**

**Required Environment Variables:**
```bash
NODE_ENV = production
PORT = 8000
DATABASE_URL = postgresql://[user]:[password]@[server].postgres.database.azure.com:5432/[db]?sslmode=require
JWT_SECRET = LemoTech2024!SecureJWT!Production!Key!9x8v7c6b5n4m3
CORS_ORIGIN = *
AUTO_MIGRATE = true
SEED_TEST_DATA = false
```

**Optional Environment Variables:**
```bash
WEBSITE_NODE_DEFAULT_VERSION = 20-lts
SCM_DO_BUILD_DURING_DEPLOYMENT = true
WEBSITE_RUN_FROM_PACKAGE = 1
```

### 3. **Startup Command**
Navigate to: **Configuration** → **General settings** → **Startup Command**

**Current Setting**: Should be `npm start` (not the old complex command)

**Why**: The Azure DevOps pipeline deploys a pre-built package, so we don't need:
```bash
# ❌ OLD (remove this):
cd backend && npm install && npm run build && npm start

# ✅ NEW (keep this):
npm start
```

---

## 🔐 **Deployment Settings**

### 4. **Deployment Center**
Navigate to: **Deployment Center**

✅ **Source**: Should show your Azure DevOps setup
✅ **Build provider**: Azure Pipelines
✅ **Repository**: Your Azure DevOps repository
✅ **Branch**: master/main

### 5. **Authentication**
Navigate to: **Authentication**

✅ **App Service authentication**: Can be `Off` for API (use JWT instead)
✅ **SCM Basic Auth**: `On` (required for Azure DevOps deployment)

---

## 📊 **Monitoring & Logging**

### 6. **Application Insights** (Recommended)
Navigate to: **Application Insights**

✅ **Status**: `Enabled`
✅ **Runtime instrumentation**: `On`
✅ **Collection level**: `Recommended`

### 7. **Diagnostic Settings**
Navigate to: **Monitoring** → **Diagnostic settings**

✅ **Application logs**: `File System` (Level: `Information`)
✅ **Web server logs**: `File System`
✅ **Failed request tracing**: `On`

---

## 🛡️ **Security Settings**

### 8. **TLS/SSL Settings**
Navigate to: **TLS/SSL settings**

✅ **Minimum TLS version**: `1.2`
✅ **HTTPS Only**: `On`
✅ **HTTP version**: `2.0`

### 9. **CORS Settings**
Navigate to: **API** → **CORS**

✅ **Allowed Origins**: 
- `https://your-frontend-domain.com`
- `https://your-admin-domain.com`
- OR `*` for development

✅ **Access-Control-Allow-Credentials**: `False` (unless needed)

---

## ⚡ **Performance Settings**

### 10. **Scale Settings**
Navigate to: **Scale up (App Service plan)**

✅ **Current tier**: `B1 Basic` or higher (F1 Free may be too slow)
✅ **Scale out**: Configure auto-scaling if needed

### 11. **Connection Strings** (If using)
Navigate to: **Configuration** → **Connection strings**

If you prefer connection strings over app settings:
```bash
Name: DefaultConnection
Value: postgresql://[user]:[password]@[server].postgres.database.azure.com:5432/[db]?sslmode=require
Type: PostgreSQL
```

---

## 🧪 **Testing Endpoints**

After configuring, test these URLs:

✅ **Health Check**: `https://lemotech-api-backend.azurewebsites.net`
✅ **API Docs**: `https://lemotech-api-backend.azurewebsites.net/api-docs`
✅ **Specific endpoint**: `https://lemotech-api-backend.azurewebsites.net/api/health`

---

## 🔄 **DevOps Integration Specific**

### 12. **Continuous Deployment**
Navigate to: **Deployment Center** → **Settings**

✅ **Build provider**: `Azure Pipelines`
✅ **Repository**: Connected to your Azure DevOps
✅ **Branch**: `master` or `main`
✅ **Workflow configuration**: Should point to `azure-pipelines-backend.yml`

### 13. **Deployment Slots** (Optional)
Navigate to: **Deployment slots**

Consider creating a `staging` slot for:
- Testing deployments before production
- Blue-green deployments
- Rollback capabilities

---

## 🚨 **Common Issues & Fixes**

### Issue 1: 500 Internal Server Error
**Check**: Application Settings - ensure all required environment variables are set

### Issue 2: 404 Not Found
**Check**: Startup Command - should be `npm start`, not complex build command

### Issue 3: Cold Start Issues
**Check**: Always On setting - should be `On` for production

### Issue 4: CORS Errors
**Check**: CORS settings and `CORS_ORIGIN` app setting

### Issue 5: Database Connection Issues
**Check**: DATABASE_URL format and PostgreSQL firewall rules

---

## 📝 **Quick Verification Script**

Run this in Azure Cloud Shell to verify settings:

```bash
# Set variables
RESOURCE_GROUP="Default-Web-EastUS"
APP_NAME="lemotech-api-backend"

# Check app settings
echo "=== App Settings ==="
az webapp config appsettings list --resource-group $RESOURCE_GROUP --name $APP_NAME --output table

# Check general config
echo "=== General Configuration ==="
az webapp config show --resource-group $RESOURCE_GROUP --name $APP_NAME --query "{nodeVersion:nodeVersion,alwaysOn:alwaysOn,httpVersion:httpVersion}" --output table

# Check deployment source
echo "=== Deployment Source ==="
az webapp deployment source show --resource-group $RESOURCE_GROUP --name $APP_NAME
```

---

## ✅ **Final Checklist**

Before running Azure DevOps pipeline:

- [ ] **Runtime stack**: Node 20 LTS
- [ ] **Startup command**: `npm start` 
- [ ] **Always On**: Enabled
- [ ] **Environment variables**: All set correctly
- [ ] **HTTPS Only**: Enabled
- [ ] **SCM Basic Auth**: Enabled
- [ ] **CORS**: Configured for your domains
- [ ] **Application Insights**: Enabled (recommended)
- [ ] **Deployment Center**: Connected to Azure DevOps

---

## 🎯 **Expected Result**

After correct configuration:
1. ✅ Azure DevOps pipeline runs successfully
2. ✅ App deploys without errors
3. ✅ Health checks pass
4. ✅ API endpoints respond correctly
5. ✅ Swagger documentation accessible

**Pipeline should complete in 5-10 minutes with proper configuration!**
