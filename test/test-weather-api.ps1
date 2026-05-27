# Weather API Test Script
# Usage: .\test\test-weather-api.ps1
# Reads API Key from test/key file

# Set code page to UTF-8
chcp 65001 > $null

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$scriptPath = $PSScriptRoot
$keyFile = Join-Path $scriptPath "key"
$rootPath = Join-Path $scriptPath ".."

# Read API Key
if (Test-Path $keyFile) {
    $ApiKey = Get-Content $keyFile -Raw -Encoding UTF8
    $ApiKey = $ApiKey.Trim()
} else {
    Write-Host "Error: key file not found" -ForegroundColor Red
    Write-Host "Please create a 'key' file in the test directory with your API Key" -ForegroundColor Yellow
    exit 1
}

if (-not $ApiKey) {
    Write-Host "Error: key file is empty" -ForegroundColor Red
    exit 1
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Weather API Test Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variable
$env:VITE_QWEATHER_API_KEY = $ApiKey

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install --frozen-lockfile --dir app

if ($LASTEXITCODE -ne 0) {
    Write-Host "Dependency installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Yellow
Write-Host "API Key: $($ApiKey.Substring(0, [Math]::Min(8, $ApiKey.Length)))..." -ForegroundColor Gray
Write-Host ""

# Start dev server from root path
pnpm --dir app run dev
