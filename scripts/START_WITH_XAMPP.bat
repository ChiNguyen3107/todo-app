@echo off
echo ========================================
echo    TODO APP - START WITH XAMPP
echo ========================================
echo.

echo [1/4] Starting XAMPP services...
echo Starting Apache and MySQL services...

REM Start XAMPP services
cd /d "C:\xampp"
start "" "xampp-control.exe"

echo Waiting for XAMPP to start...
timeout /t 5 /nobreak > nul

echo.
echo [2/4] Checking MySQL connection...
mysql -u root -e "SELECT 1;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL. Please make sure XAMPP is running.
    echo Please start XAMPP manually and run this script again.
    pause
    exit /b 1
)

echo MySQL is running successfully!

echo.
echo [3/4] Creating database if not exists...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS tododb;" 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Could not create database. It might already exist.
)

echo.
echo [4/4] Starting Todo App Backend...
cd /d "%~dp0..\backend"

echo Starting Spring Boot application with MySQL profile...
echo Database: MySQL (XAMPP)
echo URL: jdbc:mysql://localhost:3306/tododb
echo.

start "Todo App Backend" cmd /k "gradlew bootRun --args='--spring.profiles.active=mysql'"

echo.
echo ========================================
echo    TODO APP STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend: http://localhost:8081
echo Swagger UI: http://localhost:8081/swagger-ui.html
echo Database: MySQL (XAMPP) - tododb
echo.
echo Admin Login:
echo Email: admin@todo.local
echo Password: Admin@123
echo.
echo User Login:
echo Email: user@todo.local  
echo Password: Admin@123
echo.
echo Press any key to start Frontend...
pause > nul

echo.
echo Starting Frontend...
cd /d "%~dp0..\frontend"
start "Todo App Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    BOTH SERVICES ARE RUNNING!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8081
echo.
echo Press any key to exit...
pause > nul
