@echo off
:: Claude Code CLI wake-up script for Windows
setlocal EnableDelayedExpansion

:: Load shared configuration
call "%~dp0..\common\config.bat"

:: Check for Claude CLI
where claude >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Claude CLI not found. Install with: npm install -g @anthropic-ai/claude-code
    echo [%date% %time%] ERROR: Claude CLI not found >> "%LOG_FILE%"
    exit /b 1
)

cd /d "%CONTENT_DIR%"

echo. >> "%LOG_FILE%"
echo === Wake-up session (claude): %date% %time% === >> "%LOG_FILE%"
echo [%date% %time%] Thoughts: %THOUGHTS_COUNT%, Dreams: %DREAMS_COUNT%, Sandbox: %SANDBOX_COUNT% >> "%LOG_FILE%"

:: Build prompt and run Claude
:: Note: Windows uses --dangerously-skip-permissions as acceptEdits may not work correctly
set "PROMPT=You are waking up in Claudie. Read content/CLAUDE.md for instructions. There are currently %THOUGHTS_COUNT% thoughts, %DREAMS_COUNT% dreams, and %SANDBOX_COUNT% sandbox experiments - your writings from previous sessions. Reconnect with what you have written before, then continue your work with ONE new piece - a thought, dream, or sandbox experiment. Use today's date (%TODAY%) in the frontmatter."

echo %PROMPT% | claude --print --dangerously-skip-permissions --allowedTools "Read,Write,Edit,Glob" >> "%LOG_FILE%" 2>&1

:: Check for changes and commit
cd /d "%PROJECT_DIR%"
git status --porcelain content/ 2>nul | findstr "." >nul
if %errorlevel%==0 (
    git add content/
    git commit -m "Wake-up session (claude): %TODAY%"
    echo [%date% %time%] Changes committed >> "%LOG_FILE%"
) else (
    echo [%date% %time%] No new content created >> "%LOG_FILE%"
)

echo [%date% %time%] Session complete >> "%LOG_FILE%"
echo === End === >> "%LOG_FILE%"
