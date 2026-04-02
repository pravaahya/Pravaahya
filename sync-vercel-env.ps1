$envFile = ".env"
$vercelFrontendDir = "frontend"

Write-Host "Initializing Vercel Environment Synchronization..." -ForegroundColor Cyan

# Read .env file
if (-Not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found at root." -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envFile
$keysToSync = @("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_RAZORPAY_KEY_ID")

# Ensure user is inside frontend directory to target the correct Vercel project
Push-Location $vercelFrontendDir

foreach ($line in $envContent) {
    if ($line -match "^(.*?)={1}(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Remove surrounding quotes if they exist
        if ($value -match '^"(.*)"$') {
            $value = $matches[1]
        }

        if ($keysToSync -contains $key) {
            Write-Host "Pushing $key to Vercel Production..." -ForegroundColor Yellow
            # Pipe the value directly to standard input to bypass interactive prompts
            $value | npx -y vercel env add $key production
            Write-Host "Successfully queued/updated $key" -ForegroundColor Green
        }
    }
}

Pop-Location
Write-Host "Synchronization Routine Complete. Please re-deploy your project on Vercel to enforce the new variables." -ForegroundColor Cyan
