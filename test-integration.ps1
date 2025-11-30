#!/usr/bin/env pwsh
# Quick Integration Test Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 Backend Integration Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
Write-Host "✓ Checking .env.local..." -NoNewline
if (Test-Path ".env.local") {
    Write-Host " ✅ Found" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contents:" -ForegroundColor Yellow
    Get-Content ".env.local"
    Write-Host ""
} else {
    Write-Host " ❌ Not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creating .env.local..." -ForegroundColor Yellow
    Set-Content -Path ".env.local" -Value @"
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_BACKEND=true
NEXT_PUBLIC_DEBUG_API=true
"@
    Write-Host "✓ Created .env.local" -ForegroundColor Green
    Write-Host ""
}

# Check if backend is running
Write-Host "✓ Checking backend server (port 5000)..." -NoNewline
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/movies" -TimeoutSec 2 -ErrorAction Stop
    $backendRunning = $true
    Write-Host " ✅ Running" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  Backend server is not running at port 5000!" -ForegroundColor Yellow
    Write-Host "   Please start backend server:" -ForegroundColor Yellow
    Write-Host "   cd server" -ForegroundColor Cyan
    Write-Host "   npm start" -ForegroundColor Cyan
    Write-Host ""
}

# Check if frontend is running
Write-Host "✓ Checking frontend server (port 3000)..." -NoNewline
$frontendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction Stop
    $frontendRunning = $true
    Write-Host " ✅ Running" -ForegroundColor Green
} catch {
    Write-Host " ⚠️  Not running (will start)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📊 Integration Status" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($backendRunning -and $frontendRunning) {
    Write-Host "✅ Ready to test!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Open browser:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test login flow:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000/account/login" -ForegroundColor Cyan
    Write-Host ""
} elseif ($backendRunning) {
    Write-Host "⚠️  Backend is ready, but frontend needs to start" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Start frontend:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Backend server is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Start backend first:" -ForegroundColor Yellow
    Write-Host "  cd server" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then start frontend:" -ForegroundColor Yellow
    Write-Host "  cd .." -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
