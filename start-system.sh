#!/bin/bash

# Bash script to start the Library Management System

echo "🚀 Starting Library Management System..."
echo "========================================"

# Check if Docker is running
echo ""
echo "1. Checking Docker..."
if docker ps &> /dev/null; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Create environment files if they don't exist
echo ""
echo "2. Setting up environment files..."

if [ ! -f ".env" ]; then
    cp env.example .env
    echo "✅ Created root .env file"
else
    echo "✅ Root .env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Created frontend .env file"
else
    echo "✅ Frontend .env already exists"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend .env file"
else
    echo "✅ Backend .env already exists"
fi

# Start the system
echo ""
echo "3. Starting all services..."
echo "This will build and start:"
echo "  📊 PostgreSQL Database (port 5432)"
echo "  🔧 FastAPI Backend (port 8000)"
echo "  🌐 React Frontend (port 80)"
echo ""

echo "Starting services..."
if docker-compose up --build -d; then
    echo ""
    echo "🎉 System started successfully!"
    echo ""
    echo "📍 Access points:"
    echo "  🌐 Frontend: http://localhost"
    echo "  🔧 Backend API: http://localhost:8000"
    echo "  📚 API Docs: http://localhost:8000/docs"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Configure Firebase credentials in frontend/.env"
    echo "  2. Visit http://localhost to see the app"
    echo "  3. Check logs with: docker-compose logs -f"
    echo ""
    echo "🛑 To stop the system: docker-compose down"
else
    echo ""
    echo "❌ Failed to start system. Check the logs above for errors."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "  - Make sure Docker Desktop is running"
    echo "  - Check ports 80, 8000, 5432 are available"
    echo "  - Try: docker-compose down && docker-compose up --build"
fi
