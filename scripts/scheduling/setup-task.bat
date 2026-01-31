@echo off
:: Windows Task Scheduler setup wrapper
:: Double-click friendly - runs the PowerShell script

echo Clawdie Wake-Up Task Scheduler Setup
echo =====================================
echo.

set "SCRIPT_DIR=%~dp0"

:: Run PowerShell script with execution policy bypass
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%setup-task.ps1" %*

if %errorlevel% neq 0 (
    echo.
    echo Setup failed. You may need to run as Administrator.
    pause
    exit /b 1
)

echo.
pause
