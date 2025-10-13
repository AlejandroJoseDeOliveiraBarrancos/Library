# PowerShell script to start the Library Management System

Write-Host "🚀 Starting Library Management System..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is running
Write-Host ""
Write-Host "1. Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Create environment files if they don't exist
Write-Host ""
Write-Host "2. Setting up environment files..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "✅ Created root .env file" -ForegroundColor Green
} else {
    Write-Host "✅ Root .env already exists" -ForegroundColor Green
}

if (!(Test-Path "frontend\.env")) {
    Copy-Item "frontend\env.example" "frontend\.env"
    Write-Host "✅ Created frontend .env file" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env already exists" -ForegroundColor Green
}

if (!(Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ Created backend .env file" -ForegroundColor Green
} else {
    Write-Host "✅ Backend .env already exists" -ForegroundColor Green
}

# Start the system
Write-Host ""
Write-Host "3. Starting all services..." -ForegroundColor Yellow
Write-Host "This will build and start:"
Write-Host "  📊 PostgreSQL Database (port 5432)"
Write-Host "  🔧 FastAPI Backend (port 8000)"
Write-Host "  🌐 React Frontend (port 80)"
Write-Host ""

Write-Host "Starting services..." -ForegroundColor Gray
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 System started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access points:" -ForegroundColor Cyan
    Write-Host "  🌐 Frontend: http://localhost" -ForegroundColor White
    Write-Host "  🔧 Backend API: http://localhost:8000" -ForegroundColor White
    Write-Host "  📚 API Docs: http://localhost:8000/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Configure Firebase credentials in frontend/.env" -ForegroundColor White
    Write-Host "  2. Visit http://localhost to see the app" -ForegroundColor White
    Write-Host "  3. Check logs with: docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop the system: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to start system. Check the logs above for errors." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure Docker Desktop is running" -ForegroundColor White
    Write-Host "  - Check ports 80, 8000, 5432 are available" -ForegroundColor White
    Write-Host "  - Try: docker-compose down && docker-compose up --build" -ForegroundColor White
}
