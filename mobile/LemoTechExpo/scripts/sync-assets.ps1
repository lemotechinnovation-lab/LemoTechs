param(
  [string]$FrontendPublic = "$(Split-Path -Parent $PSScriptRoot)\..\..\frontend\public",
  [string]$MobileAssets = "$(Split-Path -Parent $PSScriptRoot)\assets"
)

Write-Host "Syncing assets from:" $FrontendPublic
Write-Host "To mobile assets:" $MobileAssets

if (!(Test-Path $FrontendPublic)) {
  Write-Error "Frontend public folder not found: $FrontendPublic"
  exit 1
}

if (!(Test-Path $MobileAssets)) {
  New-Item -ItemType Directory -Force -Path $MobileAssets | Out-Null
}

$frontendFull = (Resolve-Path -Path $FrontendPublic).Path
$mobileFull = (Resolve-Path -Path $MobileAssets).Path

$patterns = @('*.png','*.jpg','*.jpeg','*.gif','*.svg','*.webp','*.ico')

foreach ($pattern in $patterns) {
  Get-ChildItem -Path $frontendFull -Recurse -Filter $pattern | ForEach-Object {
    $relative = [System.IO.Path]::GetRelativePath($frontendFull, $_.FullName)
    $dest = Join-Path $mobileFull $relative
    $destDir = Split-Path -Parent $dest
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
    Copy-Item -Path $_.FullName -Destination $dest -Force
  }
}

Write-Host "Asset sync complete."


