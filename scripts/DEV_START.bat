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
echo [1/6] Checking Java...
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
echo [2/6] Checking Node.js...
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

REM Kill existing processes and clear ports
echo [3/6] Killing existing processes...
echo Stopping Node.js processes...
taskkill /f /im node.exe >nul 2>&1
echo Stopping Java processes...
taskkill /f /im java.exe >nul 2>&1
echo [OK] Existing processes stopped
echo.

REM Check and kill processes on specific ports
echo [4/6] Checking and clearing ports...
echo Checking port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| find "8081" ^| find "LISTENING"') do (
    echo Killing process on port 8081: PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Checking port 8082...
for /f "tokens=5" %%a in ('netstat -ano ^| find "8082" ^| find "LISTENING"') do (
    echo Killing process on port 8082: PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Checking port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| find "3001" ^| find "LISTENING"') do (
    echo Killing process on port 3001: PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Checking port 3002...
for /f "tokens=5" %%a in ('netstat -ano ^| find "3002" ^| find "LISTENING"') do (
    echo Killing process on port 3002: PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo Checking port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| find "5173" ^| find "LISTENING"') do (
    echo Killing process on port 5173: PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo [OK] Ports cleared
echo.

REM Set default ports
set BACKEND_PORT=8081
set FRONTEND_PORT=3001
echo [5/6] Ports configured:
echo   - Backend: %BACKEND_PORT%
echo   - Frontend: %FRONTEND_PORT%
echo.

REM Start Backend with MySQL database
echo [6/6] Starting Backend (Spring Boot with MySQL)...
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