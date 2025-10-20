@echo off
REM ==========================================
REM Todo App - Development Startup Script (No Docker)
REM ==========================================

echo.
echo ========================================
echo  Todo App Development Environment
echo  (No Docker - Using MySQL Database)
echo ========================================
echo.

REM Check Java
echo [1/4] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java not found! Please install Java 17 or higher.
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
java -version
echo [OK] Java is installed
echo.

REM Check Node.js
echo [2/4] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js 18 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
node -v
echo [OK] Node.js is installed
echo.

REM Check if ports are available
echo [3/4] Checking port availability...
netstat -an | find "8081" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 8081 is already in use. Backend will use port 8082.
    set BACKEND_PORT=8082
) else (
    set BACKEND_PORT=8081
)

netstat -an | find "3001" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3001 is already in use. Frontend will use port 3002.
    set FRONTEND_PORT=3002
) else (
    set FRONTEND_PORT=3001
)
echo [OK] Ports checked
echo.

REM Start Backend with MySQL database
echo [4/4] Starting Backend (Spring Boot with MySQL)...
cd /d "%~dp0..\backend"
start "Todo App - Backend" cmd /k "echo Starting Backend on port %BACKEND_PORT%... && set SPRING_PROFILES_ACTIVE=mysql && set SERVER_PORT=%BACKEND_PORT% && gradlew bootRun"
echo [OK] Backend is starting on port %BACKEND_PORT%
echo     (Check the new window for backend logs)
echo.

REM Wait for backend
echo Waiting for backend to start (this may take 30-60 seconds)...
timeout /t 30 /nobreak >nul
echo.

REM Start Frontend
echo Starting Frontend (React + Vite)...
cd /d "%~dp0..\frontend"
start "Todo App - Frontend" cmd /k "echo Starting Frontend on port %FRONTEND_PORT%... && npm run dev -- --port %FRONTEND_PORT%"
echo [OK] Frontend is starting on port %FRONTEND_PORT%
echo     (Check the new window for frontend logs)
echo.

echo ========================================
echo  Todo App is starting!
echo ========================================
echo.
echo Services:
echo   - Frontend:  http://localhost:%FRONTEND_PORT%
echo   - Backend:   http://localhost:%BACKEND_PORT%
echo   - API Docs:  http://localhost:%BACKEND_PORT%/swagger-ui.html
echo   - Database:  MySQL via XAMPP (localhost:3306)
echo     (Database: tododb, Username: root, Password: )
echo.
echo Demo Accounts:
echo   - Admin: admin@todo.local / Admin@123
echo   - User:  user@todo.local  / Pass@123
echo.
echo To stop all services:
echo   1. Close Backend and Frontend windows
echo   2. Press Ctrl+C in each window
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:%FRONTEND_PORT%

echo.
echo Have a great development session!
echo.

