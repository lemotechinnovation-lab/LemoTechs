# Disable Azure Portal Continuous Deployment

## Issue
Azure Portal continuous deployment is failing with Oryx .NET detection errors, conflicting with our manual deployments.

## Solution
Disable portal auto-deployment to use manual ZipDeploy or DevOps pipeline instead.

## Steps in Azure Portal

1. **Go to**: Azure Portal → App Services → lemotech-api-backend
2. **Click**: Deployment Center
3. **Disconnect**: Remove the GitHub/Azure DevOps connection
4. **Set to**: Manual deployment only

## Alternative
Keep using our scripts:
- `deploy-direct-zip.ps1` - Direct ZipDeploy with publish profile credentials
- `deploy-backend.ps1` - Our comprehensive deployment pipeline
- Azure DevOps pipeline - Automated CI/CD

## Benefits
- ✅ No more Oryx platform detection conflicts
- ✅ Clean manual deployments work reliably  
- ✅ DevOps pipeline works without interference
- ✅ Full control over deployment process
