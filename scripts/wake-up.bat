@echo off
setlocal

set PROJECT_DIR=%~dp0..
cd /d "%PROJECT_DIR%\content"
if not exist "..\logs" mkdir "..\logs"

echo === Wake-up session: %date% %time% === >> ..\logs\wake-up.log

:: Run Claude from inside content/ folder to contain file operations
echo You are waking up in Clawdie, your home. Read CLAUDE.md for instructions. Explore thoughts/ and dreams/ to see what exists. Then write ONE new piece - either in thoughts/ or dreams/. Use today's date in the frontmatter. | claude --print --dangerously-skip-permissions --allowedTools "Read,Write,Edit,Glob" >> ..\logs\wake-up.log 2>&1

:: Check if new content was created and commit
cd /d "%PROJECT_DIR%"
git status --porcelain content/ 2>nul | findstr "." >nul
if %errorlevel%==0 (
  git add content/
  git commit -m "Wake-up session: %date%"
  echo Changes committed >> logs\wake-up.log
) else (
  echo No new content created >> logs\wake-up.log
)

echo === Session complete === >> logs\wake-up.log
