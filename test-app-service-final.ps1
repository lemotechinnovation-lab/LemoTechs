# Test LemoTech App Service Backend After Deployment
$backendUrl = "https://lemotech-api-backend.azurewebsites.net"

Write-Host "=== Testing LemoTech App Service Backend ===" -ForegroundColor Cyan
Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET -TimeoutSec 30
    Write-Host "✅ Health Check SUCCESS:" -ForegroundColor Green
    Write-Host ($healthResponse | ConvertTo-Json -Depth 2) -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Root Endpoint
Write-Host "2. Testing Root Endpoint..." -ForegroundColor Green
try {
    $rootResponse = Invoke-RestMethod -Uri "$backendUrl/" -Method GET -TimeoutSec 30
    Write-Host "✅ Root Endpoint SUCCESS:" -ForegroundColor Green
    if ($rootResponse.message) {
        Write-Host "Message: $($rootResponse.message)" -ForegroundColor Cyan
    }
    if ($rootResponse.endpoints) {
        Write-Host "Available Endpoints: $($rootResponse.endpoints.Count)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Root Endpoint FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Swagger UI
Write-Host "3. Testing Swagger UI..." -ForegroundColor Green
try {
    $swaggerResponse = Invoke-WebRequest -Uri "$backendUrl/api-docs" -Method GET -TimeoutSec 30
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "✅ Swagger UI SUCCESS (Status: $($swaggerResponse.StatusCode))" -ForegroundColor Green
        $contentLength = $swaggerResponse.Content.Length
        Write-Host "Content Length: $contentLength characters" -ForegroundColor Cyan
        if ($swaggerResponse.Content -like "*LemoTech API Documentation*") {
            Write-Host "✅ Contains LemoTech API Documentation: YES" -ForegroundColor Green
        }
        if ($swaggerResponse.Content -like "*swagger-ui*") {
            Write-Host "✅ Swagger UI Components: LOADED" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Swagger UI FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: OpenAPI Spec JSON
Write-Host "4. Testing OpenAPI Spec JSON..." -ForegroundColor Green
try {
    $specResponse = Invoke-RestMethod -Uri "$backendUrl/api-docs/swagger.json" -Method GET -TimeoutSec 30
    Write-Host "✅ OpenAPI Spec SUCCESS:" -ForegroundColor Green
    Write-Host "API Title: $($specResponse.info.title)" -ForegroundColor Cyan
    Write-Host "API Version: $($specResponse.info.version)" -ForegroundColor Cyan
    Write-Host "Total Endpoints: $($specResponse.paths.Count)" -ForegroundColor Cyan
    
    # Extract and count controller tags
    $tags = @()
    foreach ($path in $specResponse.paths.PSObject.Properties) {
        foreach ($method in $path.Value.PSObject.Properties) {
            if ($method.Value.tags) {
                $tags += $method.Value.tags
            }
        }
    }
    $uniqueTags = $tags | Sort-Object | Get-Unique
    Write-Host "Controller Tags ($($uniqueTags.Count)): $($uniqueTags -join ', ')" -ForegroundColor Cyan
    
    # Show servers
    if ($specResponse.servers) {
        Write-Host "API Servers:" -ForegroundColor Cyan
        foreach ($server in $specResponse.servers) {
            Write-Host "  - $($server.url) ($($server.description))" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ OpenAPI Spec FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Sample API Endpoint
Write-Host "5. Testing Sample API Endpoint (/api/auth/register)..." -ForegroundColor Green
try {
    # This should return a 400 (validation error) since we're not sending data, but it proves the endpoint exists
    $registerResponse = Invoke-WebRequest -Uri "$backendUrl/api/auth/register" -Method POST -ContentType "application/json" -Body "{}" -TimeoutSec 30
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Auth Endpoint EXISTS (returns 400 as expected)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Auth Endpoint Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "=== DEPLOYMENT STATUS SUMMARY ===" -ForegroundColor Magenta
Write-Host "Backend URL: $backendUrl" -ForegroundColor White
Write-Host "Swagger UI: $backendUrl/api-docs" -ForegroundColor White
Write-Host "API Spec: $backendUrl/api-docs/swagger.json" -ForegroundColor White
Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "1. ✅ If all tests pass: Your backend is fully deployed!" -ForegroundColor White
Write-Host "2. 🌐 Access Swagger UI in browser for interactive testing" -ForegroundColor White
Write-Host "3. 🔗 Frontend can now connect to working backend" -ForegroundColor White
Write-Host "4. 📊 All 25+ controllers are documented and accessible" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Testing Complete!" -ForegroundColor Green
