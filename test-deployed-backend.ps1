# Test LemoTech Backend Deployment
$backendUrl = "https://calm-moss-0a9f7fc03.2.azurestaticapps.net"

Write-Host "🧪 Testing LemoTech Backend Deployment" -ForegroundColor Cyan
Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "✅ Health Check Response:" -ForegroundColor Green
    $healthResponse | ConvertTo-Json -Depth 2
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Swagger Documentation
Write-Host "2. Testing Swagger Documentation..." -ForegroundColor Green
try {
    $swaggerResponse = Invoke-WebRequest -Uri "$backendUrl/api-docs" -Method GET
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "✅ Swagger UI is accessible (Status: $($swaggerResponse.StatusCode))" -ForegroundColor Green
        Write-Host "Content-Type: $($swaggerResponse.Headers['Content-Type'])" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Swagger Documentation Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: OpenAPI Spec JSON
Write-Host "3. Testing OpenAPI Spec JSON..." -ForegroundColor Green
try {
    $specResponse = Invoke-RestMethod -Uri "$backendUrl/api-docs/swagger.json" -Method GET
    Write-Host "✅ OpenAPI Spec Response:" -ForegroundColor Green
    Write-Host "API Title: $($specResponse.info.title)" -ForegroundColor Cyan
    Write-Host "API Version: $($specResponse.info.version)" -ForegroundColor Cyan
    Write-Host "Total Endpoints: $($specResponse.paths.Count)" -ForegroundColor Cyan
    
    # List all endpoint tags
    $tags = @()
    foreach ($path in $specResponse.paths.PSObject.Properties) {
        foreach ($method in $path.Value.PSObject.Properties) {
            if ($method.Value.tags) {
                $tags += $method.Value.tags
            }
        }
    }
    $uniqueTags = $tags | Sort-Object | Get-Unique
    Write-Host "Available Controller Tags: $($uniqueTags -join ', ')" -ForegroundColor Cyan
} catch {
    Write-Host "❌ OpenAPI Spec Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Root Endpoint
Write-Host "4. Testing Root Endpoint..." -ForegroundColor Green
try {
    $rootResponse = Invoke-RestMethod -Uri "$backendUrl/" -Method GET
    Write-Host "✅ Root Endpoint Response:" -ForegroundColor Green
    $rootResponse | ConvertTo-Json -Depth 2
} catch {
    Write-Host "❌ Root Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎯 Test Summary:" -ForegroundColor Magenta
Write-Host "- Backend URL: $backendUrl" -ForegroundColor White
Write-Host "- Swagger UI: $backendUrl/api-docs" -ForegroundColor White
Write-Host "- OpenAPI Spec: $backendUrl/api-docs/swagger.json" -ForegroundColor White
Write-Host ""
Write-Host "✨ Testing Complete!" -ForegroundColor Green
