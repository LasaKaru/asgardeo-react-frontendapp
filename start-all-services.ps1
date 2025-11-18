# Real Estate Management System - Start All Microservices (PowerShell)
# This script starts all 7 microservices in separate PowerShell windows

Write-Host "=========================================" -ForegroundColor Blue
Write-Host "Real Estate Microservices Startup" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Define services (API Gateway first, then microservices)
$services = @(
    @{Name="API Gateway"; Port=8080; Dir="APIGateway"},
    @{Name="Auth Service"; Port=5000; Dir="AuthService.API"},
    @{Name="Property Service"; Port=5001; Dir="PropertyService.API"},
    @{Name="Owner Service"; Port=5002; Dir="OwnerService.API"},
    @{Name="Tenant Service"; Port=5003; Dir="TenantService.API"},
    @{Name="Lease Service"; Port=5004; Dir="LeaseService.API"},
    @{Name="Payment Service"; Port=5005; Dir="PaymentService.API"},
    @{Name="Maintenance Service"; Port=5006; Dir="MaintenanceService.API"}
)

Write-Host "Checking service directories..." -ForegroundColor Cyan
$allExist = $true
foreach ($service in $services) {
    if (Test-Path $service.Dir) {
        Write-Host "✓ $($service.Name) found" -ForegroundColor Green
    } else {
        Write-Host "⚠ $($service.Name) not found" -ForegroundColor Yellow
        $allExist = $false
    }
}

Write-Host ""
Write-Host "Starting microservices..." -ForegroundColor Cyan
Write-Host ""

# Start each service in a new PowerShell window
foreach ($service in $services) {
    if (Test-Path $service.Dir) {
        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Green

        $command = "Set-Location '$($service.Dir)'; Write-Host 'Starting $($service.Name)...' -ForegroundColor Cyan; dotnet run"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

        Start-Sleep -Seconds 1
    } else {
        Write-Host "Skipping $($service.Name) (directory not found)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "API Gateway (Main Entry Point):" -ForegroundColor Cyan
Write-Host "  Gateway URL:         http://localhost:8080"
Write-Host "  Gateway Swagger:     http://localhost:8080/swagger"
Write-Host "  Gateway Info:        http://localhost:8080/gateway-info"
Write-Host "  Services Status:     http://localhost:8080/api/gateway/services-status"
Write-Host ""

Write-Host "Microservices (Backend):" -ForegroundColor Cyan
Write-Host "  Auth Service:        http://localhost:5000"
Write-Host "  Property Service:    http://localhost:5001"
Write-Host "  Owner Service:       http://localhost:5002"
Write-Host "  Tenant Service:      http://localhost:5003"
Write-Host "  Lease Service:       http://localhost:5004"
Write-Host "  Payment Service:     http://localhost:5005"
Write-Host "  Maintenance Service: http://localhost:5006"
Write-Host ""

Write-Host "Swagger Documentation:" -ForegroundColor Cyan
Write-Host "  Gateway Swagger:     http://localhost:8080/swagger"
Write-Host "  Auth Swagger:        http://localhost:5000/swagger"
Write-Host "  http://localhost:5001/swagger"
Write-Host "  http://localhost:5002/swagger"
Write-Host "  http://localhost:5003/swagger"
Write-Host "  http://localhost:5004/swagger"
Write-Host "  http://localhost:5005/swagger"
Write-Host "  http://localhost:5006/swagger"
Write-Host ""

Write-Host "Note: Services may take a few seconds to start" -ForegroundColor Yellow
Write-Host "Close each PowerShell window to stop a service" -ForegroundColor Yellow
Write-Host ""

Write-Host "Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Checking service health..." -ForegroundColor Cyan
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        Write-Host "✓ $($service.Name) is running on port $($service.Port)" -ForegroundColor Green
    } catch {
        Write-Host "⚠ $($service.Name) not responding yet on port $($service.Port)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Startup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the frontend:"
Write-Host "  npm start"
Write-Host ""
