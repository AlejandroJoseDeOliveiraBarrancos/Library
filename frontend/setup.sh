#!/bin/bash

echo "🚀 Setting up Library Frontend..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Check Node.js version
echo ""
echo "1. Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} Node.js $(node -v) is installed"
    else
        echo -e "${RED}✗${NC} Node.js version 18 or higher is required (found $(node -v))"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    ((errors++))
fi

# Check if npm is available
echo ""
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm $(npm -v) is installed"
else
    echo -e "${RED}✗${NC} npm is not installed"
    ((errors++))
fi

if [ $errors -gt 0 ]; then
    echo ""
    echo -e "${RED}✗ Please install Node.js 18+ before continuing${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check for .env file
echo ""
echo "3. Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${YELLOW}!${NC} .env file not found, creating from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✓${NC} Created .env from env.example"
        echo -e "${YELLOW}⚠${NC}  Please edit .env and add your Firebase credentials"
    else
        echo -e "${RED}✗${NC} env.example not found"
    fi
fi

# Install dependencies
echo ""
echo "4. Installing dependencies..."
echo "This may take a few minutes..."
if npm install; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

# Check if all required files exist
echo ""
echo "5. Verifying project structure..."
required_files=(
    "src/main.tsx"
    "src/App.tsx"
    "index.html"
    "vite.config.ts"
    "tsconfig.json"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        all_files_exist=false
    fi
done

# Summary
echo ""
echo "=================================="
if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✓ Setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env and add your Firebase credentials"
    echo "2. Run: npm run dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "For more information, see SETUP.md"
else
    echo -e "${RED}✗ Setup incomplete. Please check the errors above.${NC}"
    exit 1
fi

