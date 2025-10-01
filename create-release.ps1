# LemoTech Release Creation Script
# Usage: .\create-release.ps1 -Version "1.2.3" -Type "production" -Message "Release description"

param(
    [Parameter(Mandatory=$true, HelpMessage="Version number (e.g., 1.2.3)")]
    [string]$Version,
    
    [Parameter(Mandatory=$false, HelpMessage="Release type: production, release-candidate, hotfix, development, uat, or qa")]
    [ValidateSet("production", "release-candidate", "hotfix", "development", "uat", "qa")]
    [string]$Type = "production",
    
    [Parameter(Mandatory=$false, HelpMessage="Custom release message")]
    [string]$Message = "",
    
    [Parameter(Mandatory=$false, HelpMessage="Skip confirmation prompts")]
    [switch]$Force
)

# Validate version format
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Error "❌ Version must be in format: MAJOR.MINOR.PATCH (e.g., 1.2.3)"
    exit 1
}

# Create tag name based on type
switch ($Type) {
    "production" { 
        $TagName = "v$Version"
        $DefaultMessage = "🚀 Production Release v$Version"
        $Environment = "Production"
        $Domains = @(
            "Frontend: https://www.lemotechinnovations.co.za",
            "Backend:  https://api.lemotechinnovations.co.za", 
            "Admin:    https://admin.lemotechinnovations.co.za"
        )
    }
    "release-candidate" { 
        $TagName = "release-v$Version"
        $DefaultMessage = "🧪 Release Candidate v$Version"
        $Environment = "Production (RC)"
        $Domains = @(
            "Frontend: https://www.lemotechinnovations.co.za",
            "Backend:  https://api.lemotechinnovations.co.za",
            "Admin:    https://admin.lemotechinnovations.co.za"
        )
    }
    "hotfix" { 
        $TagName = "hotfix-v$Version"
        $DefaultMessage = "🔥 Hotfix Release v$Version"
        $Environment = "Hotfix"
        $Domains = @(
            "Frontend: https://lemotech-frontend-avbgchgjexfdbpa7.southafricanorth-01.azurewebsites.net",
            "Backend:  https://lemotech-api-backend.azurewebsites.net",
            "Admin:    https://lemotech-admin-aya0hbfgc2dbh8c0.southafricanorth-01.azurewebsites.net"
        )
    }
    "development" {
        $TagName = "dev-v$Version"
        $DefaultMessage = "🛠️ Development Release v$Version"
        $Environment = "Development"
        $Domains = @(
            "Frontend: https://lemotech-frontend-avbgchgjexfdbpa7.southafricanorth-01.azurewebsites.net",
            "Backend:  https://lemotech-api-backend.azurewebsites.net",
            "Admin:    https://lemotech-admin-aya0hbfgc2dbh8c0.southafricanorth-01.azurewebsites.net"
        )
    }
    "uat" {
        $TagName = "uat-v$Version"
        $DefaultMessage = "🧪 UAT Release v$Version"
        $Environment = "UAT"
        $Domains = @(
            "Frontend: https://lemotech-frontend-avbgchgjexfdbpa7.southafricanorth-01.azurewebsites.net",
            "Backend:  https://lemotech-api-backend.azurewebsites.net",
            "Admin:    https://lemotech-admin-aya0hbfgc2dbh8c0.southafricanorth-01.azurewebsites.net"
        )
    }
    "qa" {
        $TagName = "qa-v$Version"
        $DefaultMessage = "🔍 QA Release v$Version"
        $Environment = "QA"
        $Domains = @(
            "Frontend: https://lemotech-frontend-avbgchgjexfdbpa7.southafricanorth-01.azurewebsites.net",
            "Backend:  https://lemotech-api-backend.azurewebsites.net",
            "Admin:    https://lemotech-admin-aya0hbfgc2dbh8c0.southafricanorth-01.azurewebsites.net"
        )
    }
}

$TagMessage = if ($Message) { $Message } else { $DefaultMessage }

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    🚀 LemoTech Release Creator                    " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Display release information
Write-Host "📋 Release Information:" -ForegroundColor Yellow
Write-Host "   Tag Name:     $TagName" -ForegroundColor White
Write-Host "   Type:         $Type" -ForegroundColor White
Write-Host "   Environment:  $Environment" -ForegroundColor White
Write-Host "   Message:      $TagMessage" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 Deployment Targets:" -ForegroundColor Yellow
foreach ($domain in $Domains) {
    Write-Host "   $domain" -ForegroundColor White
}
Write-Host ""

# Check current branch
$CurrentBranch = git branch --show-current
Write-Host "📍 Current Branch: $CurrentBranch" -ForegroundColor Cyan

# Validate branch for production releases
if ($Type -eq "production" -and $CurrentBranch -ne "master") {
    Write-Host "⚠️  WARNING: Production releases should be created from 'master' branch!" -ForegroundColor Yellow
    if (-not $Force) {
        $Continue = Read-Host "Continue anyway? (y/N)"
        if ($Continue -ne 'y' -and $Continue -ne 'Y') {
            Write-Host "❌ Release creation cancelled." -ForegroundColor Red
            exit 1
        }
    }
}

# Check if tag already exists
$ExistingTag = git tag -l $TagName
if ($ExistingTag) {
    Write-Host "❌ ERROR: Tag '$TagName' already exists!" -ForegroundColor Red
    Write-Host "   Use a different version number or delete the existing tag:" -ForegroundColor Gray
    Write-Host "   git tag -d $TagName" -ForegroundColor Gray
    Write-Host "   git push origin :refs/tags/$TagName" -ForegroundColor Gray
    exit 1
}

# Check for uncommitted changes
$GitStatus = git status --porcelain
if ($GitStatus) {
    Write-Host "⚠️  WARNING: You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
    if (-not $Force) {
        $Continue = Read-Host "Continue with uncommitted changes? (y/N)"
        if ($Continue -ne 'y' -and $Continue -ne 'Y') {
            Write-Host "❌ Release creation cancelled. Please commit or stash changes first." -ForegroundColor Red
            exit 1
        }
    }
}

# Final confirmation
if (-not $Force) {
    Write-Host ""
    Write-Host "🔍 Ready to create release. This will:" -ForegroundColor Magenta
    Write-Host "   1. Create tag: $TagName" -ForegroundColor White
    Write-Host "   2. Push to Azure DevOps" -ForegroundColor White
    Write-Host "   3. Trigger automatic deployment pipeline" -ForegroundColor White
    Write-Host "   4. Deploy to $Environment environment" -ForegroundColor White
    Write-Host ""
    
    $Confirm = Read-Host "Create release? (Y/n)"
    if ($Confirm -eq 'n' -or $Confirm -eq 'N') {
        Write-Host "❌ Release creation cancelled." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Creating Release..." -ForegroundColor Green

try {
    # Fetch latest changes
    Write-Host "📥 Fetching latest changes..." -ForegroundColor Blue
    git fetch origin
    
    # Create the tag
    Write-Host "🏷️  Creating tag: $TagName" -ForegroundColor Blue
    git tag -a $TagName -m $TagMessage
    
    # Push the tag
    Write-Host "📤 Pushing tag to trigger deployment..." -ForegroundColor Blue
    git push origin $TagName
    
    Write-Host ""
    Write-Host "✅ SUCCESS! Release created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 What happens next:" -ForegroundColor Yellow
    Write-Host "   1. Azure DevOps pipeline will start automatically (30-60 seconds)" -ForegroundColor White
    Write-Host "   2. Release information will be validated" -ForegroundColor White
    Write-Host "   3. All components will be built and deployed" -ForegroundColor White
    Write-Host "   4. Health checks will verify deployment" -ForegroundColor White
    Write-Host "   5. Applications will be available at the URLs above" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Monitor Progress:" -ForegroundColor Yellow
    Write-Host "   Azure DevOps: https://dev.azure.com/LemoTechInnovations/LemoTech/_build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⏱️  Expected deployment time: 15-30 minutes" -ForegroundColor Magenta
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to create release!" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check your Git credentials" -ForegroundColor White
    Write-Host "   2. Verify you have push permissions" -ForegroundColor White
    Write-Host "   3. Ensure you're connected to the internet" -ForegroundColor White
    exit 1
}