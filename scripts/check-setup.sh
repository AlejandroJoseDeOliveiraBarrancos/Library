#!/bin/bash

# Script to check if the project is properly set up

echo "🔍 Checking Library App Setup..."
echo "================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check Docker
echo ""
echo "1. Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed"
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker is running"
    else
        echo -e "${RED}✗${NC} Docker is not running. Please start Docker Desktop."
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Docker is not installed"
    ((errors++))
fi

# Check Docker Compose
echo ""
echo "2. Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is installed"
else
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    ((errors++))
fi

# Check environment files
echo ""
echo "3. Checking environment files..."

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Root .env file exists"
else
    echo -e "${YELLOW}!${NC} Root .env file missing (run: cp env.example .env)"
    ((warnings++))
fi

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env file exists"
else
    echo -e "${YELLOW}!${NC} Frontend .env file missing (run: cp frontend/env.example frontend/.env)"
    ((warnings++))
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
else
    echo -e "${YELLOW}!${NC} Backend .env file missing (run: cp backend/env.example backend/.env)"
    ((warnings++))
fi

# Check Firebase credentials
echo ""
echo "4. Checking Firebase credentials..."
if [ -f "backend/firebase-credentials.json" ]; then
    echo -e "${GREEN}✓${NC} Firebase credentials file exists"
else
    echo -e "${YELLOW}!${NC} Firebase credentials missing (backend/firebase-credentials.json)"
    echo "   Get it from: Firebase Console > Project Settings > Service Accounts"
    ((warnings++))
fi

# Check if ports are available
echo ""
echo "5. Checking required ports..."

check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -ano | grep ":$port " >/dev/null 2>&1; then
        echo -e "${YELLOW}!${NC} Port $port is already in use (needed for $service)"
        ((warnings++))
    else
        echo -e "${GREEN}✓${NC} Port $port is available ($service)"
    fi
}

check_port 80 "Frontend"
check_port 8000 "Backend"
check_port 5432 "Database"

# Summary
echo ""
echo "================================"
echo "Summary:"
echo -e "Errors: ${RED}$errors${NC}"
echo -e "Warnings: ${YELLOW}$warnings${NC}"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to start.${NC}"
    echo ""
    echo "Run: docker-compose up --build"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}! Some warnings found, but you can proceed.${NC}"
    echo ""
    echo "Run: docker-compose up --build"
    exit 0
else
    echo -e "${RED}✗ Please fix the errors above before starting.${NC}"
    exit 1
fi

