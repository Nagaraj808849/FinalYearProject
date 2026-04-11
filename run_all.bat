@echo off
echo =======================================================
echo Starting Restaurant Management System
echo =======================================================
echo.
echo Starting Backend (ASP.NET Core)...
start cmd /k "title Backend && cd /d %~dp0RestaurantManagementSystem\RestaurantManagementSystem && dotnet run --launch-profile ""https"""

echo Starting Frontend (React/Vite)...
start cmd /k "title Frontend && cd /d %~dp0AcademicProjects && npm run dev"

echo.
echo Both services have been launched in separate windows!
echo - Backend API: https://localhost:7080
echo - Frontend App: http://localhost:5173 (or as indicated in the new window)
echo.
pause
