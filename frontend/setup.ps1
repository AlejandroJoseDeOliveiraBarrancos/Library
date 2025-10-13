# PowerShell setup script for Windows

Write-Host "Setting up Library Frontend..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

$errors = 0

# Check Node.js version
Write-Host ""
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -ge 18) {
        Write-Host "Node.js $nodeVersion is installed" -ForegroundColor Green
    } else {
        Write-Host "Node.js version 18 or higher is required (found $nodeVersion)" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "Node.js is not installed" -ForegroundColor Red
    $errors++
}

# Check npm
Write-Host ""
Write-Host "2. Checking npm..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm -v
    Write-Host "npm $npmVersion is installed" -ForegroundColor Green
} else {
    Write-Host "npm is not installed" -ForegroundColor Red
    $errors++
}

if ($errors -gt 0) {
    Write-Host ""
    Write-Host "Please install Node.js 18+ before continuing" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check for .env file
Write-Host ""
Write-Host "3. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host ".env file exists" -ForegroundColor Green
} else {
    Write-Host ".env file not found, creating from template..." -ForegroundColor Yellow
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "Created .env from env.example" -ForegroundColor Green
        Write-Host "Please edit .env and add your Firebase credentials" -ForegroundColor Yellow
    } else {
        Write-Host "env.example not found" -ForegroundColor Red
    }
}

# Install dependencies
Write-Host ""
Write-Host "4. Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    npm install
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if all required files exist
Write-Host ""
Write-Host "5. Verifying project structure..." -ForegroundColor Yellow
$requiredFiles = @(
    "src/main.tsx",
    "src/App.tsx",
    "index.html",
    "vite.config.ts",
    "tsconfig.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "$file" -ForegroundColor Green
    } else {
        Write-Host "$file (missing)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
if ($allFilesExist) {
    Write-Host "Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Edit .env and add your Firebase credentials"
    Write-Host "2. Run: npm run dev"
    Write-Host "3. Open http://localhost:3000 in your browser"
    Write-Host ""
    Write-Host "For more information, see SETUP.md"
} else {
    Write-Host "Setup incomplete. Please check the errors above." -ForegroundColor Red
    exit 1
}

