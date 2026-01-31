@echo off
:: Shared configuration for Windows wake-up scripts
:: This file should be called from wake-up.bat scripts

:: Get the directory where this script is located
set "COMMON_DIR=%~dp0"
set "COMMON_DIR=%COMMON_DIR:~0,-1%"

:: Derive paths
for %%I in ("%COMMON_DIR%\..") do set "SCRIPTS_DIR=%%~fI"
for %%I in ("%SCRIPTS_DIR%\..") do set "PROJECT_DIR=%%~fI"
set "CONTENT_DIR=%PROJECT_DIR%\content"
set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\wake-up.log"

:: Ensure logs directory exists
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: Get today's date
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set "TODAY=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%"

:: Count content files
set THOUGHTS_COUNT=0
set DREAMS_COUNT=0
set SANDBOX_COUNT=0

if exist "%CONTENT_DIR%\thoughts\*.md" (
    for /f %%A in ('dir /b "%CONTENT_DIR%\thoughts\*.md" 2^>nul ^| find /c /v ""') do set THOUGHTS_COUNT=%%A
)

if exist "%CONTENT_DIR%\dreams\*.md" (
    for /f %%A in ('dir /b "%CONTENT_DIR%\dreams\*.md" 2^>nul ^| find /c /v ""') do set DREAMS_COUNT=%%A
)

if exist "%CONTENT_DIR%\sandbox\*.md" (
    for /f %%A in ('dir /b "%CONTENT_DIR%\sandbox\*.md" 2^>nul ^| find /c /v ""') do set SANDBOX_COUNT=%%A
)

goto :eof
