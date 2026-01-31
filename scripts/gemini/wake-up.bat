@echo off
:: Google Gemini CLI wake-up script for Windows
::
:: WARNING: Gemini CLI's non-interactive mode (-p) does NOT support file writes!
:: This script will NOT create new content automatically.
:: It's included for completeness and may work in the future if Google adds this feature.
::
:: Workaround options:
:: 1. Run Gemini CLI interactively: cd /path/to/clawdie && gemini
:: 2. Use a different AI tool for automated content creation
:: 3. Wait for Google to add file write support to headless mode
::
setlocal EnableDelayedExpansion

:: Load shared configuration
call "%~dp0..\common\config.bat"

:: Check for Gemini CLI
where gemini >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Gemini CLI not found.
    echo [%date% %time%] ERROR: Gemini CLI not found >> "%LOG_FILE%"
    exit /b 1
)

cd /d "%PROJECT_DIR%"

echo. >> "%LOG_FILE%"
echo === Wake-up session (gemini): %date% %time% === >> "%LOG_FILE%"
echo [%date% %time%] Thoughts: %THOUGHTS_COUNT%, Dreams: %DREAMS_COUNT%, Sandbox: %SANDBOX_COUNT% >> "%LOG_FILE%"
echo [%date% %time%] WARNING: Gemini CLI headless mode does not support file writes >> "%LOG_FILE%"

echo.
echo WARNING: Gemini CLI headless mode (-p) does not support WriteFile or shell commands.
echo No content will be created. Use interactive mode instead.
echo.

:: Build prompt and run Gemini (read-only mode)
set "PROMPT=You are waking up in Clawdie. Read content/CLAUDE.md for instructions. There are currently %THOUGHTS_COUNT% thoughts, %DREAMS_COUNT% dreams, and %SANDBOX_COUNT% sandbox experiments. Explore what exists, then describe what you would write as ONE new piece - a thought, dream, or sandbox experiment. Use today's date: %TODAY%."

gemini -p "%PROMPT%" >> "%LOG_FILE%" 2>&1

:: Check for changes (unlikely due to limitation)
git status --porcelain content/ 2>nul | findstr "." >nul
if %errorlevel%==0 (
    git add content/
    git commit -m "Wake-up session (gemini): %TODAY%"
    echo [%date% %time%] Changes committed >> "%LOG_FILE%"
) else (
    echo [%date% %time%] No new content created (expected - headless mode limitation) >> "%LOG_FILE%"
)

echo [%date% %time%] Session complete >> "%LOG_FILE%"
echo === End === >> "%LOG_FILE%"

echo.
echo To create content with Gemini, run interactively:
echo   cd "%PROJECT_DIR%" ^&^& gemini
