# PowerShell deployment script
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Clean install
Write-Host "📦 Cleaning node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Install dependencies
Write-Host "⬇️ Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
