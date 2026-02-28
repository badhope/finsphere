# FinSphere Pro Environment Check

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  FinSphere Pro Environment Check" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check project files
Write-Host "Checking project files..." -ForegroundColor Yellow
$files = @("package.json", "vite.config.ts", "tsconfig.json")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Found $file" -ForegroundColor Green
    } else {
        Write-Host "Missing $file" -ForegroundColor Red
    }
}

Write-Host ""

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Dependencies not installed" -ForegroundColor Yellow
    Write-Host "Run: npm install" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Environment check completed!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Start dev server: npm run dev" -ForegroundColor White
Write-Host "3. Build for production: npm run build" -ForegroundColor White
Write-Host ""

Write-Host "Default login:" -ForegroundColor Yellow
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: 123456" -ForegroundColor White
Write-Host ""

pause