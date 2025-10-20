@echo off
echo ========================================
echo    TODO APP - STOP ALL SERVICES
echo ========================================
echo.

echo [1/3] Stopping Frontend...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo Frontend stopped successfully.
) else (
    echo Frontend was not running.
)

echo.
echo [2/3] Stopping Backend...
taskkill /f /im java.exe 2>nul
if %errorlevel% equ 0 (
    echo Backend stopped successfully.
) else (
    echo Backend was not running.
)

echo.
echo [3/3] Stopping XAMPP (optional)...
echo Do you want to stop XAMPP services? (y/n)
set /p choice=
if /i "%choice%"=="y" (
    taskkill /f /im mysqld.exe 2>nul
    taskkill /f /im httpd.exe 2>nul
    taskkill /f /im xampp-control.exe 2>nul
    echo XAMPP services stopped.
) else (
    echo XAMPP services kept running.
)

echo.
echo ========================================
echo    ALL SERVICES STOPPED!
echo ========================================
echo.
pause
