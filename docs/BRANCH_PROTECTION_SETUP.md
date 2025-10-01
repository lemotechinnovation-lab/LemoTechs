# Branch Protection Policies Setup Guide

## 🛡️ Azure DevOps Branch Protection Configuration

This guide helps you set up branch protection policies for the LemoTech project to ensure code quality and secure deployments.

---

## 📋 Branch Protection Strategy

### Protected Branches
- **`master`** - Production releases only
- **`develop`** - Development integration
- **`release/*`** - Release candidates
- **`hotfix/*`** - Emergency fixes

---

## 🔧 Setting Up Branch Policies

### 1. Navigate to Branch Policies
1. Go to **Azure DevOps** → **LemoTech Project**
2. Click **Repos** → **Branches**
3. Find the **master** branch
4. Click the **"..."** menu → **Branch policies**

### 2. Master Branch Protection

#### Required Policies:
✅ **Require a minimum number of reviewers**
- Minimum reviewers: `2`
- Allow requestors to approve their own changes: `❌ Disabled`
- Allow completion even if some reviewers vote to wait or reject: `❌ Disabled`
- Reset code reviewer votes when there are new changes: `✅ Enabled`

✅ **Check for linked work items**
- Require associated work item: `✅ Enabled`

✅ **Check for comment resolution**
- All comments must be resolved: `✅ Enabled`

✅ **Build validation**
- Build pipeline: `LemoTech Unified Pipeline`
- Trigger: `Automatic`
- Policy requirement: `Required`
- Build expiration: `12 hours`

#### Optional Policies:
⚪ **Require merge strategy**
- Squash merge: `✅ Enabled`
- Basic merge (no fast-forward): `❌ Disabled`
- Rebase and fast-forward: `❌ Disabled`
- Rebase with merge commit: `❌ Disabled`

⚪ **Automatically include code reviewers**
- Required reviewers: Add team leads/senior developers
- Path-based reviewers for specific folders

### 3. Develop Branch Protection

#### Required Policies:
✅ **Require a minimum number of reviewers**
- Minimum reviewers: `1`
- Allow requestors to approve their own changes: `✅ Enabled`
- Reset code reviewer votes when there are new changes: `✅ Enabled`

✅ **Build validation**
- Build pipeline: `LemoTech Unified Pipeline`
- Trigger: `Automatic`
- Policy requirement: `Required`

### 4. Release Branch Protection (Pattern: `release/*`)

#### Setup Wildcard Policy:
1. In **Branch policies**, click **"+ Add policy"**
2. Select **"Branch name pattern"**
3. Enter pattern: `release/*`

#### Required Policies:
✅ **Require a minimum number of reviewers**
- Minimum reviewers: `2`
- Allow requestors to approve their own changes: `❌ Disabled`
- Reset code reviewer votes when there are new changes: `✅ Enabled`

✅ **Build validation**
- Build pipeline: `LemoTech Unified Pipeline`
- Trigger: `Automatic`
- Policy requirement: `Required`

✅ **Check for linked work items**
- Require associated work item: `✅ Enabled`

### 5. Hotfix Branch Protection (Pattern: `hotfix/*`)

#### Setup Wildcard Policy:
1. In **Branch policies**, click **"+ Add policy"**
2. Select **"Branch name pattern"**
3. Enter pattern: `hotfix/*`

#### Required Policies:
✅ **Require a minimum number of reviewers**
- Minimum reviewers: `1`
- Allow requestors to approve their own changes: `❌ Disabled`
- Allow completion even if some reviewers vote to wait or reject: `✅ Enabled` (for emergencies)

✅ **Build validation**
- Build pipeline: `LemoTech Unified Pipeline`
- Trigger: `Automatic`
- Policy requirement: `Required`

---

## 🌿 Branch Structure Setup

### 1. Create Core Branches

```bash
# Ensure you're on master
git checkout master
git pull origin master

# Create develop branch
git checkout -b develop
git push -u origin develop

# Create initial release branch structure
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0
git checkout master

# Create hotfix branch structure (example)
git checkout -b hotfix/v1.0.1
git push -u origin hotfix/v1.0.1
git checkout master
```

### 2. Set Default Branch
1. Go to **Repos** → **Branches**
2. Find **develop** branch
3. Click **"..."** → **Set as default branch**
4. Confirm the change

---

## 🔄 Workflow Integration

### Pull Request Templates
Create `.azuredevops/pull_request_template.md`:

```markdown
## 📋 Pull Request Checklist

### Description
Brief description of changes made.

### Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Maintenance/refactoring

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] No breaking changes to existing functionality

### Deployment
- [ ] Changes are backward compatible
- [ ] Database migrations included (if applicable)
- [ ] Environment variables documented (if applicable)

### Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] Corresponding changes to documentation made
- [ ] No new warnings introduced
- [ ] Related work items linked

### Screenshots (if applicable)
Add screenshots to help explain your changes.

### Additional Notes
Any additional information that reviewers should know.
```

### Work Item Integration
1. Go to **Project Settings** → **Repositories** → **Policies**
2. Enable **"Require work items to be linked to pull requests"**
3. Configure work item types that require linking

---

## 🚀 Release Process Integration

### Automated Release Creation
Your `create-release.ps1` script already validates branch requirements:

```powershell
# Production releases should be from master
if ($Type -eq "production" -and $CurrentBranch -ne "master") {
    Write-Host "⚠️ WARNING: Production releases should be created from 'master' branch!" -ForegroundColor Yellow
}
```

### Pipeline Triggers
Your `azure-pipelines-unified.yml` already includes proper triggers:

```yaml
trigger:
  branches:
    include:
    - master
    - main
    - develop
    - release/*
```

---

## 📊 Monitoring & Compliance

### Branch Policy Reports
1. Go to **Repos** → **Pull requests**
2. Use filters to monitor policy compliance
3. Review policy violations regularly

### Metrics to Track
- Pull request completion time
- Policy bypass frequency
- Code review participation
- Build success rates

---

## 🔧 Troubleshooting

### Common Issues

#### Policy Bypass
- **Issue**: Users bypassing policies
- **Solution**: Remove bypass permissions, educate team

#### Build Failures
- **Issue**: Policies blocking legitimate changes
- **Solution**: Fix build issues, don't bypass policies

#### Review Bottlenecks
- **Issue**: PRs waiting too long for reviews
- **Solution**: Add more reviewers, set up automatic reviewers

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Master branch requires 2 reviewers
- [ ] Build validation works on all protected branches
- [ ] Work items are required for master/release branches
- [ ] Wildcard policies work for release/* and hotfix/*
- [ ] Default branch is set to develop
- [ ] Pull request template is available
- [ ] Team members understand the new workflow

---

This branch protection setup ensures code quality while maintaining development velocity for the LemoTech platform.
