@echo off
REM ==========================================
REM Todo App - Development Startup Script
REM ==========================================

echo.
echo ========================================
echo  Todo App Development Environment
echo ========================================
echo.

REM Check Java
echo [1/7] Checking Java...
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
echo [2/7] Checking Node.js...
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

REM Check Docker
echo [3/7] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not found! Please install Docker Desktop.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
docker --version
echo [OK] Docker is installed
echo.

REM Stop and remove existing container if exists
echo [4/7] Cleaning up old database container...
docker stop todo-db >nul 2>&1
docker rm todo-db >nul 2>&1
echo [OK] Cleanup completed
echo.

REM Start PostgreSQL
echo [5/7] Starting PostgreSQL database...
docker run -d ^
  --name todo-db ^
  -e POSTGRES_DB=tododb ^
  -e POSTGRES_USER=todouser ^
  -e POSTGRES_PASSWORD=todopass ^
  -p 5432:5432 ^
  postgres:15-alpine

if errorlevel 1 (
    echo [ERROR] Failed to start database!
    pause
    exit /b 1
)
echo [OK] PostgreSQL started on port 5432
echo.

REM Wait for database
echo [6/7] Waiting for database to be ready...
timeout /t 10 /nobreak >nul
echo [OK] Database is ready
echo.

REM Start Backend
echo [7/7] Starting Backend (Spring Boot)...
cd /d "%~dp0..\backend"
start "Todo App - Backend" cmd /k "echo Starting Backend... && gradlew bootRun --args='--spring.profiles.active=dev'"
echo [OK] Backend is starting on port 8080
echo     (Check the new window for backend logs)
echo.

REM Wait for backend
echo Waiting for backend to start (this may take 30-60 seconds)...
timeout /t 30 /nobreak >nul
echo.

REM Start Frontend
echo Starting Frontend (React + Vite)...
cd /d "%~dp0..\frontend"
start "Todo App - Frontend" cmd /k "echo Starting Frontend... && npm run dev"
echo [OK] Frontend is starting on port 3000
echo     (Check the new window for frontend logs)
echo.

echo ========================================
echo  Todo App is starting!
echo ========================================
echo.
echo Services:
echo   - Frontend:  http://localhost:3000
echo   - Backend:   http://localhost:8080
echo   - API Docs:  http://localhost:8080/swagger-ui.html
echo   - Database:  localhost:5432 (tododb)
echo.
echo Demo Accounts:
echo   - Admin: admin@todo.local / Admin@123
echo   - User:  user@todo.local  / Pass@123
echo.
echo To stop all services:
echo   1. Close Backend and Frontend windows
echo   2. Run: docker stop todo-db
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo Have a great development session!
echo.

