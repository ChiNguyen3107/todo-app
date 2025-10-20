@echo off
REM ==========================================
REM Todo App - Stop Development Environment
REM ==========================================

echo.
echo ========================================
echo  Stopping Todo App Development
echo ========================================
echo.

REM Stop Backend (Java processes)
echo [1/3] Stopping Backend...
taskkill /F /FI "WINDOWTITLE eq Todo App - Backend*" >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Backend stopped
echo.

REM Stop Frontend (Node processes)
echo [2/3] Stopping Frontend...
taskkill /F /FI "WINDOWTITLE eq Todo App - Frontend*" >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Frontend stopped
echo.

REM Stop Database
echo [3/3] Stopping Database...
docker stop todo-db >nul 2>&1
docker rm todo-db >nul 2>&1
echo [OK] Database stopped and removed
echo.

echo ========================================
echo  All services stopped successfully!
echo ========================================
echo.
echo To start again, run: scripts\DEV_START.bat
echo.
pause

