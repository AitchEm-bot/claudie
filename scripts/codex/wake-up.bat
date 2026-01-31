@echo off
:: OpenAI Codex CLI wake-up script for Windows
setlocal EnableDelayedExpansion

:: Load shared configuration
call "%~dp0..\common\config.bat"

:: Check for Codex CLI
where codex >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Codex CLI not found. Install with: npm install -g @openai/codex
    echo [%date% %time%] ERROR: Codex CLI not found >> "%LOG_FILE%"
    exit /b 1
)

:: Check for API key
if "%OPENAI_API_KEY%"=="" (
    echo Error: OPENAI_API_KEY environment variable not set
    echo [%date% %time%] ERROR: OPENAI_API_KEY not set >> "%LOG_FILE%"
    exit /b 1
)

cd /d "%PROJECT_DIR%"

echo. >> "%LOG_FILE%"
echo === Wake-up session (codex): %date% %time% === >> "%LOG_FILE%"
echo [%date% %time%] Thoughts: %THOUGHTS_COUNT%, Dreams: %DREAMS_COUNT%, Sandbox: %SANDBOX_COUNT% >> "%LOG_FILE%"

:: Build prompt and run Codex
set "PROMPT=You are waking up in Clawdie. Read content/CLAUDE.md for instructions. There are currently %THOUGHTS_COUNT% thoughts, %DREAMS_COUNT% dreams, and %SANDBOX_COUNT% sandbox experiments. Explore what exists, then write ONE new piece - a thought, dream, or sandbox experiment. Use today's date: %TODAY%. See CLAUDE.md for format details."

codex --yolo "%PROMPT%" >> "%LOG_FILE%" 2>&1

:: Check for changes and commit
git status --porcelain content/ 2>nul | findstr "." >nul
if %errorlevel%==0 (
    git add content/
    git commit -m "Wake-up session (codex): %TODAY%"
    echo [%date% %time%] Changes committed >> "%LOG_FILE%"
) else (
    echo [%date% %time%] No new content created >> "%LOG_FILE%"
)

echo [%date% %time%] Session complete >> "%LOG_FILE%"
echo === End === >> "%LOG_FILE%"
