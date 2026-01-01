# PowerShell script to install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Green
Set-Location client
npm install
Set-Location ..
Write-Host "Client dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Yellow


