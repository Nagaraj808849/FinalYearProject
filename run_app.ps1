Write-Host "Starting the Restaurant Management System..." -ForegroundColor Green

# Start the Backend
Write-Host "Starting Backend API on port 7080..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd RestaurantManagementSystem\RestaurantManagementSystem; dotnet run --profile https"

# Wait a few seconds for backend to start up
Start-Sleep -Seconds 5

# Start the Frontend
Write-Host "Starting Frontend React App..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd AcademicProjects; npm run dev"

Write-Host "Both applications are starting in separate windows!" -ForegroundColor Green
