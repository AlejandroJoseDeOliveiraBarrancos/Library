# PowerShell script to check if the project is properly set up

Write-Host "🔍 Checking Library App Setup..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Check Docker
Write-Host ""
Write-Host "1. Checking Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker is installed" -ForegroundColor Green
    try {
        docker ps | Out-Null
        Write-Host "✓ Docker is running" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        $errors++
    }
}
else {
    Write-Host "✗ Docker is not installed" -ForegroundColor Red
    $errors++
}

# Check Docker Compose
Write-Host ""
Write-Host "2. Checking Docker Compose..." -ForegroundColor Yellow
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
}
else {
    Write-Host "✗ Docker Compose is not installed" -ForegroundColor Red
    $errors++
}

# Check environment files
Write-Host ""
Write-Host "3. Checking environment files..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✓ Root .env file exists" -ForegroundColor Green
}
else {
    Write-Host "! Root .env file missing (run: cp env.example .env)" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "frontend/.env") {
    Write-Host "✓ Frontend .env file exists" -ForegroundColor Green
}
else {
    Write-Host "! Frontend .env file missing (run: cp frontend/env.example frontend/.env)" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "backend/.env") {
    Write-Host "✓ Backend .env file exists" -ForegroundColor Green
}
else {
    Write-Host "! Backend .env file missing (run: cp backend/env.example backend/.env)" -ForegroundColor Yellow
    $warnings++
}

# Check Firebase credentials
Write-Host ""
Write-Host "4. Checking Firebase credentials..." -ForegroundColor Yellow
if (Test-Path "backend/firebase-credentials.json") {
    Write-Host "✓ Firebase credentials file exists" -ForegroundColor Green
}
else {
    Write-Host "! Firebase credentials missing (backend/firebase-credentials.json)" -ForegroundColor Yellow
    Write-Host "   Get it from: Firebase Console > Project Settings > Service Accounts" -ForegroundColor Gray
    $warnings++
}

# Check if ports are available
Write-Host ""
Write-Host "5. Checking required ports..." -ForegroundColor Yellow

function Test-Port {
    param($Port, $Service)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "! Port $Port is already in use (needed for $Service)" -ForegroundColor Yellow
        $script:warnings++
    }
    else {
        Write-Host "✓ Port $Port is available ($Service)" -ForegroundColor Green
    }
}

Test-Port 80 "Frontend"
Test-Port 8000 "Backend"
Test-Port 5432 "Database"

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Summary:"
Write-Host "Errors: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $warnings" -ForegroundColor $(if ($warnings -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✓ All checks passed! You're ready to start." -ForegroundColor Green
    Write-Host ""
    Write-Host "Run: docker-compose up --build" -ForegroundColor Cyan
    exit 0
}
elseif ($errors -eq 0) {
    Write-Host "! Some warnings found, but you can proceed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run: docker-compose up --build" -ForegroundColor Cyan
    exit 0
}
else {
    Write-Host "✗ Please fix the errors above before starting." -ForegroundColor Red
    exit 1
}

