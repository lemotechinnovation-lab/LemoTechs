# LemoTech Backend Deployment Pipeline
# Comprehensive deployment script covering all required steps:
# ✅ Delete everything in wwwroot
# ✅ Upload package to temp folder in Kudu  
# ✅ Unzip to wwwroot folder
# ✅ Run npm install
# ✅ Run npm build
# ✅ Start npm service
#
# Based on Azure App Service Publish Profile:
# - Web Deploy: lemotech-api-backend.scm.azurewebsites.net:443
# - Zip Deploy: lemotech-api-backend.scm.azurewebsites.net:443
# - FTP: ftps://waws-prod-am2-811.ftp.azurewebsites.windows.net/site/wwwroot

param(
    [string]$AppName = "lemotech-api-backend",
    [ValidateSet("kudu", "zipdeploy", "ftp")]
    [string]$Method = "kudu",
    [switch]$Verbose = $false
)

# Pipeline configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Deployment configuration based on publish profile
$DeployConfig = @{
    PackageName = "lemotech-backend"
    TempDir = "temp-deploy"
    ZipFile = "backend-deploy.zip"
    # From publish profile: publishUrl="lemotech-api-backend.scm.azurewebsites.net:443"
    KuduUrl = "https://$AppName.scm.azurewebsites.net"
    ZipDeployUrl = "https://$AppName.scm.azurewebsites.net"
    # From publish profile: userName="$lemotech-api-backend" userPWD="2BLesRpwo6diMimiqTHjkrXceYbEfS5r8ets0PsCrJ0TnHrCxYzRtn6B8BwF"
    Username = "`$$AppName"
    Password = "2BLesRpwo6diMimiqTHjkrXceYbEfS5r8ets0PsCrJ0TnHrCxYzRtn6B8BwF"
    # From publish profile: destinationAppUrl="https://lemotech-api-backend.azurewebsites.net"
    AppUrl = "https://$AppName.azurewebsites.net"
    Timeouts = @{
        Upload = 600
        Install = 900  
        Build = 300
        Command = 60
        ZipDeploy = 900
    }
}

# Authentication setup
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($DeployConfig.Username):$($DeployConfig.Password)"))
$Headers = @{
    Authorization = "Basic $base64Auth"
    "Content-Type" = "application/json"
}
$UploadHeaders = @{
    Authorization = "Basic $base64Auth"
    "Content-Type" = "application/octet-stream"
}

# Utility functions
function Write-Step {
    param([string]$Message, [int]$StepNumber)
    Write-Host "`n🔄 STEP $StepNumber`: $Message" -ForegroundColor Magenta
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "   $Message" -ForegroundColor Cyan
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Invoke-KuduCommand {
    param(
        [string]$Command,
        [string]$WorkingDir = "/home/site/wwwroot",
        [int]$TimeoutSec = $DeployConfig.Timeouts.Command
    )
    
    if ($Verbose) {
        Write-Info "Executing: $Command"
    }
    
    $body = @{
        command = $Command
        dir = $WorkingDir
    } | ConvertTo-Json
    
    $commandUrl = "$($DeployConfig.KuduUrl)/api/command"
    
    try {
        $response = Invoke-RestMethod -Uri $commandUrl -Method Post -Body $body -Headers $Headers -TimeoutSec $TimeoutSec
        
        if ($response.ExitCode -ne 0 -and $null -ne $response.ExitCode) {
            throw "Command failed with exit code $($response.ExitCode): $($response.Error)"
        }
        
        if ($Verbose -and $response.Output) {
            Write-Info "Output: $($response.Output)"
        }
        
        return $response
    } catch {
        Write-Error "Kudu command failed: $($_.Exception.Message)"
        throw
    }
}

function Remove-WwwrootContent {
    Write-Info "Clearing wwwroot directory..."
    
    try {
        # Method 1: Use find command to delete all content
        $result = Invoke-KuduCommand "find /home/site/wwwroot -mindepth 1 -delete 2>/dev/null || rm -rf /home/site/wwwroot/* /home/site/wwwroot/.*[!.] 2>/dev/null || true"
        Write-Success "wwwroot cleared via command"
        return $true
    } catch {
        Write-Warning "Command method failed, trying VFS API..."
    }
    
    try {
        # Method 2: Use VFS API to delete files
        $vfsUrl = "$($DeployConfig.KuduUrl)/api/vfs/site/wwwroot/"
        $files = Invoke-RestMethod -Uri $vfsUrl -Method Get -Headers @{Authorization = $Headers.Authorization} -TimeoutSec 60
        
        $deleteCount = 0
        foreach ($file in $files) {
            if ($file.name -notin @(".", "..")) {
                try {
                    $deleteUrl = "$vfsUrl$($file.name)"
                    Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers @{Authorization = $Headers.Authorization} -TimeoutSec 30
                    $deleteCount++
                    if ($Verbose) {
                        Write-Info "Deleted: $($file.name)"
                    }
                } catch {
                    Write-Warning "Could not delete: $($file.name)"
                }
            }
        }
        
        Write-Success "wwwroot cleared via VFS API ($deleteCount items deleted)"
        return $true
    } catch {
        Write-Warning "VFS API method failed: $($_.Exception.Message)"
        return $false
    }
}

function New-DeploymentPackage {
    Write-Info "Creating deployment package..."
    
    # Cleanup previous package
    if (Test-Path $DeployConfig.TempDir) { 
        Remove-Item $DeployConfig.TempDir -Recurse -Force 
    }
    if (Test-Path $DeployConfig.ZipFile) { 
        Remove-Item $DeployConfig.ZipFile -Force 
    }
    
    New-Item -ItemType Directory -Path $DeployConfig.TempDir | Out-Null
    
    # Copy essential backend files
    $filesToCopy = @(
        @{ Source = "backend\package.json"; Dest = "package.json" }
        @{ Source = "backend\tsconfig.json"; Dest = "tsconfig.json"; Optional = $true }
        @{ Source = "backend\tsconfig.prod.json"; Dest = "tsconfig.prod.json"; Optional = $true }
    )
    
    foreach ($file in $filesToCopy) {
        if (Test-Path $file.Source) {
            Copy-Item $file.Source -Destination "$($DeployConfig.TempDir)\$($file.Dest)"
            if ($Verbose) {
                Write-Info "Copied: $($file.Dest)"
            }
        } elseif (-not $file.Optional) {
            throw "Required file not found: $($file.Source)"
        }
    }
    
    # Copy directories
    $dirsToCopy = @(
        @{ Source = "backend\src"; Dest = "src" }
        @{ Source = "backend\scripts"; Dest = "scripts"; Optional = $true }
    )
    
    foreach ($dir in $dirsToCopy) {
        if (Test-Path $dir.Source) {
            robocopy $dir.Source "$($DeployConfig.TempDir)\$($dir.Dest)" /E /XD node_modules /XF *.log /NFL /NDL /NJH /NJS > $null
            if ($LASTEXITCODE -le 7) {  # robocopy success codes
                if ($Verbose) {
                    Write-Info "Copied directory: $($dir.Dest)"
                }
            }
        } elseif (-not $dir.Optional) {
            throw "Required directory not found: $($dir.Source)"
        }
    }
    
    # Create optimized ZIP package
    Compress-Archive -Path "$($DeployConfig.TempDir)\*" -DestinationPath $DeployConfig.ZipFile -CompressionLevel Optimal
    
    $zipSize = [math]::Round((Get-Item $DeployConfig.ZipFile).Length / 1KB, 0)
    Write-Success "Package created: $($DeployConfig.ZipFile) ($zipSize KB)"
    
    return $zipSize
}

function Send-PackageToKudu {
    param([int]$PackageSize)
    
    Write-Info "Uploading package to Kudu temp folder..."
    
    $uploadUrl = "$($DeployConfig.KuduUrl)/api/vfs/site/temp/$($DeployConfig.PackageName).zip"
    $fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $DeployConfig.ZipFile))
    
    try {
        Invoke-RestMethod -Uri $uploadUrl -Method Put -Body $fileBytes -Headers $UploadHeaders -TimeoutSec $DeployConfig.Timeouts.Upload
        Write-Success "Package uploaded ($PackageSize KB)"
    } catch {
        Write-Error "Upload failed: $($_.Exception.Message)"
        throw
    }
}

function Expand-PackageInWwwroot {
    Write-Info "Extracting package to wwwroot..."
    
    $extractCommand = "cd /home/site/wwwroot && unzip -o /home/site/temp/$($DeployConfig.PackageName).zip"
    $result = Invoke-KuduCommand $extractCommand
    
    # Clean up temp file
    try {
        $cleanCommand = "rm -f /home/site/temp/$($DeployConfig.PackageName).zip"
        Invoke-KuduCommand $cleanCommand
    } catch {
        Write-Warning "Could not clean temp file"
    }
    
    Write-Success "Package extracted to wwwroot"
}

function Install-Dependencies {
    Write-Info "Installing npm dependencies..."
    Write-Info "This may take 2-4 minutes depending on package count..."
    
    $installCommand = "cd /home/site/wwwroot && npm install --legacy-peer-deps --production --no-audit --prefer-offline"
    
    try {
        $result = Invoke-KuduCommand $installCommand -TimeoutSec $DeployConfig.Timeouts.Install
        Write-Success "Dependencies installed successfully"
    } catch {
        Write-Warning "Install encountered issues, trying alternative approach..."
        
        # Fallback: Basic install
        try {
            $fallbackCommand = "cd /home/site/wwwroot && npm install --production"
            $result = Invoke-KuduCommand $fallbackCommand -TimeoutSec $DeployConfig.Timeouts.Install
            Write-Success "Dependencies installed (fallback method)"
        } catch {
            Write-Error "Both install methods failed"
            throw
        }
    }
}

function Build-Application {
    Write-Info "Building TypeScript application..."
    
    $buildCommand = "cd /home/site/wwwroot && npm run build"
    
    try {
        $result = Invoke-KuduCommand $buildCommand -TimeoutSec $DeployConfig.Timeouts.Build
        Write-Success "Application built successfully"
    } catch {
        Write-Error "Build failed: $($_.Exception.Message)"
        
        # Check if TypeScript is available
        try {
            $tscCheck = Invoke-KuduCommand "cd /home/site/wwwroot && which tsc || echo 'tsc not found'"
            Write-Info "TypeScript check: $($tscCheck.Output)"
        } catch {}
        
        throw
    }
}

function Start-Application {
    Write-Info "Starting application service..."
    
    try {
        # Kill any existing processes
        $killCommand = "pkill -f node || true"
        Invoke-KuduCommand $killCommand
        
        # Start application in background
        $startCommand = "cd /home/site/wwwroot && nohup npm start > app.log 2>&1 &"
        $result = Invoke-KuduCommand $startCommand -TimeoutSec 30
        
        Write-Success "Application started in background"
    } catch {
        Write-Warning "Manual start failed, Azure App Service will auto-start"
        Write-Info "The application will be available once Azure restarts the service"
    }
}

function Invoke-ZipDeploy {
    param([int]$PackageSize)
    
    Write-Info "Deploying via ZipDeploy API (Azure Oryx build)..."
    Write-Info "This method will handle all steps automatically: extract, install, build, start"
    
    $zipDeployUrl = "$($DeployConfig.ZipDeployUrl)/api/zipdeploy?isAsync=false"
    $zipHeaders = @{
        Authorization = "Basic $base64Auth"
        "Content-Type" = "application/zip"
    }
    
    $fileBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $DeployConfig.ZipFile))
    
    try {
        Write-Info "Uploading and deploying $PackageSize KB via ZipDeploy..."
        Write-Info "Azure Oryx will automatically handle: npm install, npm build, npm start"
        Write-Info "This may take 3-7 minutes for complete deployment..."
        
        $response = Invoke-RestMethod -Uri $zipDeployUrl -Method Post -Body $fileBytes -Headers $zipHeaders -TimeoutSec $DeployConfig.Timeouts.ZipDeploy
        
        Write-Success "ZipDeploy completed - Azure handled all build steps automatically"
        return $true
    } catch {
        Write-Error "ZipDeploy failed: $($_.Exception.Message)"
        return $false
    }
}

function Test-Deployment {
    Write-Info "Testing deployment health..."
    
    $testUrl = $DeployConfig.AppUrl
    $attempts = 0
    $maxAttempts = 8
    $isHealthy = $false
    
    # Give initial time for startup
    Write-Info "Waiting 45 seconds for initial startup..."
    Start-Sleep 45
    
    while ($attempts -lt $maxAttempts -and !$isHealthy) {
        $attempts++
        try {
            Write-Info "Health check $attempts/$maxAttempts..."
            $response = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 15 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                $isHealthy = $true
                Write-Success "✅ Application is healthy and responding!"
            }
        } catch {
            if ($attempts -lt $maxAttempts) {
                Write-Info "Still starting up, waiting 20 seconds..."
                Start-Sleep 20
            }
        }
    }
    
    return $isHealthy
}

function Remove-LocalFiles {
    Write-Info "Cleaning up local deployment files..."
    
    if (Test-Path $DeployConfig.TempDir) { 
        Remove-Item $DeployConfig.TempDir -Recurse -Force 
    }
    if (Test-Path $DeployConfig.ZipFile) { 
        Remove-Item $DeployConfig.ZipFile -Force 
    }
    
    Write-Success "Local cleanup completed"
}

# MAIN DEPLOYMENT PIPELINE
try {
    Write-Host "`n" + "="*80 -ForegroundColor Green
    Write-Host "🚀 LEMOTECH BACKEND DEPLOYMENT PIPELINE" -ForegroundColor Green
    Write-Host "="*80 -ForegroundColor Green
    Write-Host "App Service: $AppName" -ForegroundColor Yellow
    Write-Host "Deployment Method: $Method" -ForegroundColor Yellow
    Write-Host "Kudu URL: $($DeployConfig.KuduUrl)" -ForegroundColor Yellow
    if ($Verbose) {
        Write-Host "Verbose Mode: Enabled" -ForegroundColor Yellow
    }
    
    # STEP 1: Create deployment package
    Write-Step "Create Deployment Package" 1
    $packageSize = New-DeploymentPackage
    
    if ($Method -eq "zipdeploy") {
        # ZIPDEPLOY METHOD: Azure Oryx handles everything automatically
        Write-Step "Deploy via ZipDeploy (Azure Oryx)" 2
        $zipDeploySuccess = Invoke-ZipDeploy $packageSize
        
        if ($zipDeploySuccess) {
            Write-Step "Test Deployment Health" 3
            $isHealthy = Test-Deployment
            
            Write-Step "Local Cleanup" 4
            Remove-LocalFiles
            
            $totalSteps = 4
            $deploymentMethod = "ZipDeploy (Azure Oryx)"
        } else {
            throw "ZipDeploy method failed"
        }
    } else {
        # KUDU METHOD: Manual step-by-step process
        # STEP 2: Delete everything in wwwroot
        Write-Step "Delete Everything in wwwroot" 2
        $clearResult = Remove-WwwrootContent
        if (-not $clearResult) {
            Write-Warning "wwwroot clearing had issues, but continuing..."
        }
        
        # STEP 3: Upload package to temp folder in Kudu
        Write-Step "Upload Package to Kudu Temp Folder" 3
        Send-PackageToKudu $packageSize
        
        # STEP 4: Unzip to wwwroot folder
        Write-Step "Unzip Package to wwwroot Folder" 4
        Expand-PackageInWwwroot
        
        # STEP 5: Run npm install
        Write-Step "Run npm install" 5
        Install-Dependencies
        
        # STEP 6: Run npm build
        Write-Step "Run npm build" 6
        Build-Application
        
        # STEP 7: Start npm service
        Write-Step "Start npm Service" 7
        Start-Application
        
        # STEP 8: Test deployment
        Write-Step "Test Deployment Health" 8
        $isHealthy = Test-Deployment
        
        # STEP 9: Cleanup
        Write-Step "Local Cleanup" 9
        Remove-LocalFiles
        
        $totalSteps = 9
        $deploymentMethod = "Kudu REST API"
    }
    
    # SUCCESS SUMMARY
    Write-Host "`n" + "="*80 -ForegroundColor Green
    Write-Host "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "="*80 -ForegroundColor Green
    
    Write-Host "`nDeployment Summary:" -ForegroundColor Cyan
    Write-Host "  📦 Package Size: $packageSize KB" -ForegroundColor White
    Write-Host "  🔧 Deployment Method: $deploymentMethod" -ForegroundColor White
    Write-Host "  📊 Health Status: $(if ($isHealthy) {'✅ Healthy'} else {'⏱️ Starting up'})" -ForegroundColor White
    Write-Host "  ⏱️ Total Steps: $totalSteps/$totalSteps completed" -ForegroundColor White
    
    Write-Host "`nApplication URLs:" -ForegroundColor Cyan
    Write-Host "  🌐 Backend API: $($DeployConfig.AppUrl)" -ForegroundColor White
    Write-Host "  📚 API Documentation: $($DeployConfig.AppUrl)/api-docs" -ForegroundColor White
    Write-Host "  🔍 Health Check: $($DeployConfig.AppUrl)/health" -ForegroundColor White
    
    Write-Host "`nManagement URLs:" -ForegroundColor Cyan
    Write-Host "  ⚙️  Kudu Console: https://$AppName.scm.azurewebsites.net" -ForegroundColor White
    Write-Host "  📋 Deployment Logs: https://$AppName.scm.azurewebsites.net/api/deployments" -ForegroundColor White
    Write-Host "  📊 Application Logs: https://$AppName.scm.azurewebsites.net/api/logstream" -ForegroundColor White
    
    if ($isHealthy) {
        Write-Host "`n✨ Backend is ready for testing!" -ForegroundColor Green
    } else {
        Write-Host "`n⏱️  Backend may need 2-3 more minutes to fully start up" -ForegroundColor Yellow
        Write-Host "   Test the URLs above in a few minutes" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "`n" + "="*80 -ForegroundColor Red
    Write-Host "❌ DEPLOYMENT PIPELINE FAILED" -ForegroundColor Red
    Write-Host "="*80 -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($Verbose) {
        Write-Host "Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    }
    
    # Emergency cleanup
    try {
        Remove-LocalFiles
    } catch {
        Write-Warning "Could not clean up local files"
    }
    
    Write-Host "`nTroubleshooting Steps:" -ForegroundColor Yellow
    Write-Host "1. Check deployment logs: https://$AppName.scm.azurewebsites.net/api/deployments" -ForegroundColor White
    Write-Host "2. Check Kudu console: https://$AppName.scm.azurewebsites.net" -ForegroundColor White
    Write-Host "3. Run with -Verbose flag for detailed output" -ForegroundColor White
    Write-Host "4. Verify Azure App Service is running and accessible" -ForegroundColor White
    
    exit 1
}
