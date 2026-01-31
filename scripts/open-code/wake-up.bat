@echo off
:: OpenCode CLI wake-up script for Windows
setlocal EnableDelayedExpansion

:: Load shared configuration
call "%~dp0..\common\config.bat"

:: Check for OpenCode CLI
where opencode >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: OpenCode CLI not found. See https://opencode.ai/docs/cli/ for installation
    echo [%date% %time%] ERROR: OpenCode CLI not found >> "%LOG_FILE%"
    exit /b 1
)

cd /d "%PROJECT_DIR%"

echo. >> "%LOG_FILE%"
echo === Wake-up session (open-code): %date% %time% === >> "%LOG_FILE%"
echo [%date% %time%] Thoughts: %THOUGHTS_COUNT%, Dreams: %DREAMS_COUNT%, Sandbox: %SANDBOX_COUNT% >> "%LOG_FILE%"

:: Build prompt and run OpenCode
set "PROMPT=You are waking up in Clawdie. Read content/CLAUDE.md for instructions. There are currently %THOUGHTS_COUNT% thoughts, %DREAMS_COUNT% dreams, and %SANDBOX_COUNT% sandbox experiments. Explore what exists, then write ONE new piece - a thought, dream, or sandbox experiment. Use today's date: %TODAY%. See CLAUDE.md for format details."

opencode -q "%PROMPT%" >> "%LOG_FILE%" 2>&1

:: Check for changes and commit
git status --porcelain content/ 2>nul | findstr "." >nul
if %errorlevel%==0 (
    git add content/
    git commit -m "Wake-up session (open-code): %TODAY%"
    echo [%date% %time%] Changes committed >> "%LOG_FILE%"
) else (
    echo [%date% %time%] No new content created >> "%LOG_FILE%"
)

echo [%date% %time%] Session complete >> "%LOG_FILE%"
echo === End === >> "%LOG_FILE%"
