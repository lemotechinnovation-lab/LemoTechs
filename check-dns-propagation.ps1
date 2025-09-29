$domain = "lemotechinnovations.co.za"
$expectedNameservers = @(
    "ns1-01.azure-dns.com",
    "ns2-01.azure-dns.net",
    "ns3-01.azure-dns.org",
    "ns4-01.azure-dns.info"
)
$dnsServers = @(
    @{ Name = "Google DNS"; IP = "8.8.8.8" },
    @{ Name = "Cloudflare"; IP = "1.1.1.1" },
    @{ Name = "Quad9"; IP = "9.9.9.9" },
    @{ Name = "OpenDNS"; IP = "208.67.222.222" }
)

function Check-Nameservers {
    param (
        [string]$dnsServer,
        [string]$serverName
    )
    
    Write-Host "`nChecking $serverName ($dnsServer)..."
    $result = nslookup -type=NS $domain $dnsServer 2>&1
    $nsLines = $result | Where-Object { $_ -match "nameserver = (.+)$" }
    $foundServers = $nsLines | ForEach-Object { ($_ -split "=")[1].Trim() }
    
    $allMatch = $true
    foreach ($expected in $expectedNameservers) {
        if ($foundServers -notcontains $expected) {
            $allMatch = $false
        }
    }
    
    if ($allMatch) {
        Write-Host "✅ Correct nameservers found" -ForegroundColor Green
        return @{ Status = "Ready"; Server = $serverName }
    } else {
        Write-Host "⏳ Still showing old nameservers" -ForegroundColor Yellow
        $foundServers | ForEach-Object { Write-Host "   Found: $_" }
        return @{ Status = "Pending"; Server = $serverName }
    }
}

Write-Host "DNS Propagation Monitor for $domain`n"
Write-Host "Expected nameservers:"
$expectedNameservers | ForEach-Object { Write-Host "- $_" }

$checkCount = 1
$readyServers = @()

while ($readyServers.Count -lt $dnsServers.Count) {
    Write-Host "`n=== Check #$checkCount ($(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')) ==="
    
    $results = @()
    foreach ($server in $dnsServers) {
        $result = Check-Nameservers -dnsServer $server.IP -serverName $server.Name
        if ($result.Status -eq "Ready" -and $readyServers -notcontains $result.Server) {
            $readyServers += $result.Server
        }
    }
    
    Write-Host "`nPropagation Progress: $($readyServers.Count)/$($dnsServers.Count) DNS servers updated"
    Write-Host "Ready: $($readyServers -join ', ')"
    
    if ($readyServers.Count -lt $dnsServers.Count) {
        Write-Host "`n⏳ Waiting 5 minutes before next check..." -ForegroundColor Yellow
        Write-Host "While waiting, you can:"
        Write-Host "1. Prepare Azure Static Web App configuration"
        Write-Host "2. Review SSL certificate setup"
        Write-Host "3. Press Ctrl+C to stop monitoring"
        Start-Sleep -Seconds 300
    } else {
        Write-Host "`n✅ Propagation complete! All DNS servers showing correct nameservers." -ForegroundColor Green
        Write-Host "Ready to proceed with Azure Static Web App configuration and SSL setup."
    }
    
    $checkCount++
}