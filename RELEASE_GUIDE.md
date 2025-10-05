# 🚀 LemoTech Release Management

## Quick Release Creation

Use the `create-release.ps1` script to create releases and trigger deployments:

### **Production Release**
```powershell
.\create-release.ps1 -Version "1.2.3" -Type "production" -Message "Major feature release"
```

### **UAT Release**
```powershell
.\create-release.ps1 -Version "1.2.3" -Type "uat" -Message "UAT testing release"
```

### **QA Release**
```powershell
.\create-release.ps1 -Version "1.2.3" -Type "qa" -Message "QA testing release"
```

### **Development Release**
```powershell
.\create-release.ps1 -Version "1.2.3" -Type "development" -Message "Development testing"
```

## Release Types

| Type | Tag Format | Environment | Purpose |
|------|------------|-------------|---------|
| `production` | `v1.2.3` | Production | Live release |
| `release-candidate` | `release-v1.2.3` | Production (RC) | Pre-production testing |
| `hotfix` | `hotfix-v1.2.3` | Development | Emergency fixes |
| `development` | `dev-v1.2.3` | Development | Development testing |
| `uat` | `uat-v1.2.3` | UAT | User acceptance testing |
| `qa` | `qa-v1.2.3` | QA | Quality assurance testing |

## What Happens Next

1. **Git Tag Created**: Version tag is created and pushed
2. **Pipeline Triggered**: Azure DevOps pipeline starts automatically
3. **Build & Deploy**: All components are built and deployed
4. **Health Checks**: Deployment is verified
5. **Live**: Applications are available at environment URLs

## Monitoring

- **Azure DevOps**: https://dev.azure.com/LemoTechInnovations/LemoTech/_build
- **Expected Time**: 15-30 minutes for full deployment

## Requirements

- Git credentials configured
- Push permissions to repository
- Internet connection
- PowerShell execution policy enabled
