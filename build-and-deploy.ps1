# Build and Deploy - Create proper Node.js package for Azure
# Ensures Oryx detects Node.js correctly by building locally first

param(
    [string]$AppName = "lemotech-api-backend"
)

Write-Host "Building and Deploying Backend with Proper Node.js Structure" -ForegroundColor Green

try {
    # Step 1: Build locally first
    Write-Host "`nStep 1: Building TypeScript locally..." -ForegroundColor Cyan
    
    Set-Location "backend"
    
    # Clean previous build
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
    }
    
    # Install dependencies
    Write-Host "  Installing dependencies..." -ForegroundColor White
    npm install --legacy-peer-deps
    
    # Build TypeScript
    Write-Host "  Building TypeScript..." -ForegroundColor White
    npm run build
    
    # Verify build
    if (-not (Test-Path "dist/app.js")) {
        throw "Build failed - dist/app.js not found"
    }
    
    Write-Host "  Build completed successfully!" -ForegroundColor Green
    
    Set-Location ".."
    
    # Step 2: Create deployment package with built files
    Write-Host "`nStep 2: Creating deployment package..." -ForegroundColor Cyan
    
    $tempDir = "temp-built-deploy"
    $zipFile = "backend-built.zip"
    
    # Cleanup
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    if (Test-Path $zipFile) { Remove-Item $zipFile -Force }
    
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # Copy package.json (CRITICAL - must be at root)
    Copy-Item "backend\package.json" -Destination $tempDir
    Write-Host "  Copied package.json to root" -ForegroundColor Gray
    
    # Copy built JavaScript files
    if (Test-Path "backend\dist") {
        robocopy "backend\dist" "$tempDir\dist" /E /NFL /NDL /NJH /NJS > $null
        Write-Host "  Copied dist/ (built JS files)" -ForegroundColor Gray
    }
    
    # Copy node_modules for production (optional, but safer)
    Write-Host "  Creating production node_modules..." -ForegroundColor Gray
    Set-Location $tempDir
    npm install --production --legacy-peer-deps > $null 2>&1
    Set-Location ".."
    
    # Copy other essential files
    @("web.config", ".deployment") | ForEach-Object {
        if (Test-Path "backend\$_") {
            Copy-Item "backend\$_" -Destination $tempDir
            Write-Host "  Copied $_" -ForegroundColor Gray
        }
    }
    
    # Create ZIP
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -CompressionLevel Optimal
    $zipSize = [math]::Round((Get-Item $zipFile).Length / 1KB, 0)
    Write-Host "  Package created: $zipFile ($zipSize KB)" -ForegroundColor Green
    
    # Step 3: Deploy using ZipDeploy with proper headers
    Write-Host "`nStep 3: Deploying pre-built package..." -ForegroundColor Cyan
    
    $zipDeployUrl = "https://lemotech-api-backend.scm.azurewebsites.net"
    $username = "`$lemotech-api-backend"
    $password = "2BLesRpwo6diMimiqTHjkrXceYbEfS5r8ets0PsCrJ0TnHrCxYzRtn6B8BwF"
    
    $base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$username`:$password"))
    $headers = @{
        Authorization = "Basic $base64Auth"
        "Content-Type" = "application/zip"
        "SCM-DISABLE-BUILD" = "true"  # Skip Oryx build since we pre-built
    }
    
    $deployUrl = "$zipDeployUrl/api/zipdeploy"
    $zipBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $zipFile))
    
    Write-Host "  Uploading pre-built package ($zipSize KB)..." -ForegroundColor Yellow
    Write-Host "  Skipping Oryx build (using pre-built files)..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $deployUrl -Method Post -Body $zipBytes -Headers $headers -TimeoutSec 600
    
    Write-Host "  Deployment completed!" -ForegroundColor Green
    
    # Step 4: Test deployment
    Write-Host "`nStep 4: Testing deployment..." -ForegroundColor Cyan
    
    Start-Sleep 20
    
    $testUrl = "https://$AppName.azurewebsites.net"
    $attempts = 0
    $maxAttempts = 5
    
    while ($attempts -lt $maxAttempts) {
        $attempts++
        try {
            Write-Host "  Health check $attempts/$maxAttempts..." -ForegroundColor Gray
            $healthResponse = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 10 -UseBasicParsing
            if ($healthResponse.StatusCode -eq 200) {
                Write-Host "  Application is responding!" -ForegroundColor Green
                break
            }
        } catch {
            if ($attempts -lt $maxAttempts) {
                Write-Host "    Waiting 15 seconds..." -ForegroundColor Yellow
                Start-Sleep 15
            }
        }
    }
    
    # Step 5: Cleanup
    Remove-Item $tempDir -Recurse -Force
    Remove-Item $zipFile -Force
    
    # Success
    Write-Host "`nDEPLOYMENT COMPLETED!" -ForegroundColor Green
    Write-Host "Backend URL: https://$AppName.azurewebsites.net" -ForegroundColor Cyan
    Write-Host "API Docs: https://$AppName.azurewebsites.net/api-docs" -ForegroundColor Cyan
    Write-Host "Health: https://$AppName.azurewebsites.net/health" -ForegroundColor Cyan
    
} catch {
    Write-Host "`nDEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Cleanup on failure
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    if (Test-Path $zipFile) { Remove-Item $zipFile -Force }
}
