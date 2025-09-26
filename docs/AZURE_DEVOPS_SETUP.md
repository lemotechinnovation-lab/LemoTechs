# Azure DevOps Pipeline Setup Guide

## 🚀 Setting Up LemoTech Backend Deployment Pipeline

This guide explains how to configure Azure DevOps for automated backend deployment using our `azure-pipelines-backend.yml` file.

### 📋 Prerequisites

1. **Azure DevOps Account** - [Create free account](https://dev.azure.com)
2. **Azure Subscription** - With App Service deployed
3. **Git Repository** - Your LemoTech codebase
4. **Service Principal** - For Azure authentication

### 🔧 Step 1: Create Azure DevOps Project

1. Go to [Azure DevOps](https://dev.azure.com)
2. Click **"New Project"**
3. Enter project details:
   - **Project name**: `LemoTech-Platform`
   - **Visibility**: Private
   - **Version control**: Git
4. Click **"Create"**

### 🔗 Step 2: Connect Repository

#### Option A: Import from GitHub
1. Go to **Repos** → **Import**
2. Enter repository URL: `https://github.com/yourusername/lemotechinnovations`
3. Click **Import**

#### Option B: Push existing repo
```bash
git remote add azure https://dev.azure.com/yourorg/LemoTech-Platform/_git/LemoTech-Platform
git push azure master
```

### ⚙️ Step 3: Configure Service Connection

1. Go to **Project Settings** → **Service connections**
2. Click **"New service connection"**
3. Select **"Azure Resource Manager"**
4. Choose **"Service principal (automatic)"**
5. Configure:
   - **Subscription**: Your Azure subscription
   - **Resource group**: `Default-Web-EastUS`
   - **Service connection name**: `LemoTech-Azure-Connection`
6. Click **"Save"**

### 📁 Step 4: Configure Agent Pool

1. Go to **Project Settings** → **Agent pools**
2. Ensure **"Default"** pool is available and has agents
3. If no agents, you may need to set up a self-hosted agent or use Azure Pipelines agents

### 📁 Step 5: Upload Pipeline YAML

1. Go to **Pipelines** → **Create Pipeline**
2. Select **"Azure Repos Git"**
3. Choose your repository
4. Select **"Existing Azure Pipelines YAML file"**
5. Choose `/azure-pipelines-backend.yml`
6. Click **"Continue"**

### 🎯 Step 6: Configure Pipeline Variables

Before running the pipeline, verify these variables in `azure-pipelines-backend.yml`:

```yaml
variables:
  # Update these to match your environment
  azureServiceConnection: 'LemoTech-Azure-Connection'  # Match Step 3
  resourceGroupName: 'Default-Web-EastUS'             # Your resource group
  backendAppName: 'lemotech-api-backend'              # Your App Service name
```

### 🔐 Step 7: Set Up Secrets (Optional)

For sensitive variables, add them as pipeline variables:

1. Go to **Pipelines** → **Edit**
2. Click **Variables**
3. Add variables:
   - `DB_CONNECTION_STRING` (if needed)
   - `API_KEYS` (if needed)
   - Mark as **"Keep this value secret"**

### 🚀 Step 8: Run the Pipeline

1. Click **"Run"** to start the pipeline
2. Monitor the build in real-time
3. Check the deployment logs

### 📊 Pipeline Stages Overview

#### Stage 1: Build Backend
- ✅ Install Node.js 20.x
- ✅ Install dependencies with `--legacy-peer-deps`
- ✅ Run TypeScript build
- ✅ Verify build output
- ✅ Create deployment package
- ✅ Publish build artifact

#### Stage 2: Deploy to Azure
- ✅ Download build artifact
- ✅ Pre-deployment verification
- ✅ Deploy to Azure App Service via ZipDeploy
- ✅ Post-deployment health check
- ✅ Display deployment URLs

### 🔧 Troubleshooting

#### Build Failures

**Problem**: `npm ci` fails
```bash
Solution: Check package.json dependencies
- Ensure all packages are compatible
- Use --legacy-peer-deps flag (already included)
```

**Problem**: TypeScript build fails
```bash
Solution: Check TypeScript configuration
- Verify tsconfig.json is correct
- Check for TypeScript errors in code
```

#### Agent Pool Issues

**Problem**: "No hosted parallelism has been purchased or granted"
```bash
Solution: Use Default agent pool
1. Go to Project Settings → Agent pools
2. Ensure "Default" pool has available agents
3. Pipeline already configured to use "Default" pool
```

**Problem**: No agents available in Default pool
```bash
Solution: Set up self-hosted agent or request parallel jobs
Option 1: Request free parallel jobs at https://aka.ms/azpipelines-parallelism-request
Option 2: Set up self-hosted agent (Windows/Linux)
```

#### Deployment Failures

**Problem**: Service connection authentication
```bash
Solution: Recreate service connection
1. Delete existing connection
2. Create new one with proper permissions
3. Update pipeline variables
```

**Problem**: App Service not found
```bash
Solution: Verify Azure resources
- Check App Service name matches pipeline variable
- Ensure resource group exists
- Verify subscription access
```

### 📈 Advanced Configuration

#### Trigger Configuration
```yaml
# Deploy on multiple branches
trigger:
- master
- main
- develop

# Deploy only on specific paths
trigger:
  branches:
    include:
    - master
  paths:
    include:
    - backend/*
    - azure-pipelines-backend.yml
```

#### Environment-Specific Deployments
```yaml
# Add staging environment
- stage: DeployStaging
  displayName: 'Deploy to Staging'
  variables:
    backendAppName: 'lemotech-api-backend-staging'
```

### 🎯 Success Criteria

After successful setup, you should see:

1. ✅ **Automatic builds** on code changes
2. ✅ **Successful deployments** to Azure App Service
3. ✅ **Health checks** confirming app is running
4. ✅ **Deployment URLs** in pipeline logs

### 📞 Support

If you encounter issues:

1. **Check pipeline logs** for detailed error messages
2. **Verify Azure resources** are correctly configured
3. **Test local deployment** using `deploy-backend.ps1`
4. **Review Azure App Service logs** in the Azure Portal

### 🔗 Useful Links

- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [Azure App Service Deploy Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-web-app)
- [Service Connections](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints)
- [Pipeline YAML Schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)

---

## 🎉 Pipeline Ready!

Your Azure DevOps pipeline is now configured for automated LemoTech backend deployment!
