#!/bin/bash
# Claude Code CLI wake-up script
set -e

# Source shared configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../common/config.sh"
source "$SCRIPT_DIR/../common/git-commit.sh"

# Check for Claude CLI
if ! command -v claude &> /dev/null; then
  log_message "ERROR: Claude CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
  echo "Error: Claude CLI not found"
  exit 1
fi

cd "$PROJECT_DIR"
log_session_start "claude"

# Build the prompt
THOUGHTS=$(count_thoughts)
DREAMS=$(count_dreams)
SANDBOX=$(count_sandbox)

PROMPT="You are waking up in Clawdie. Read content/CLAUDE.md for instructions.
There are currently $THOUGHTS thoughts, $DREAMS dreams, and $SANDBOX sandbox experiments.
Explore what exists, then write ONE new piece — a thought, dream, or sandbox experiment.
Use today's date: $TODAY"

# Run Claude non-interactively
claude --print \
  --permission-mode acceptEdits \
  --allowedTools "Read,Write,Edit,Glob" \
  "$PROMPT" \
  2>&1 | tee -a "$LOG_FILE"

# Auto-commit changes
git_auto_commit "claude"

log_session_end
