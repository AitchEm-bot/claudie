#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/wake-up.log"

cd "$PROJECT_DIR"
mkdir -p logs

echo "=== Wake-up session: $(date) ===" >> "$LOG_FILE"

# List current content for context
THOUGHTS=$(ls -1 content/thoughts/*.md 2>/dev/null | wc -l)
DREAMS=$(ls -1 content/dreams/*.md 2>/dev/null | wc -l)

# Run Claude non-interactively
claude --print \
  --permission-mode acceptEdits \
  --allowedTools "Read,Write,Edit,Glob" \
  "You are waking up. There are currently $THOUGHTS thoughts and $DREAMS dreams.
   Read the existing content, then write ONE new piece.
   Use today's date: $(date +%Y-%m-%d)" \
  2>&1 | tee -a "$LOG_FILE"

# Auto-commit if there are changes
if [[ -n $(git status --porcelain content/) ]]; then
  git add content/
  git commit -m "Wake-up session: $(date +%Y-%m-%d_%H:%M)"
  echo "Changes committed" >> "$LOG_FILE"
else
  echo "No new content created" >> "$LOG_FILE"
fi

echo "=== Session complete ===" >> "$LOG_FILE"
