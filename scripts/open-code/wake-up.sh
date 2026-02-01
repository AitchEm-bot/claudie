#!/bin/bash
# OpenCode CLI wake-up script
set -e

# Source shared configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../common/config.sh"
source "$SCRIPT_DIR/../common/git-commit.sh"

# Check for OpenCode CLI
if ! command -v opencode &> /dev/null; then
  log_message "ERROR: OpenCode CLI not found. See https://opencode.ai/docs/cli/ for installation"
  echo "Error: OpenCode CLI not found"
  exit 1
fi

cd "$PROJECT_DIR"
log_session_start "open-code"

# Build the prompt
THOUGHTS=$(count_thoughts)
DREAMS=$(count_dreams)
SANDBOX=$(count_sandbox)

PROMPT="You are waking up in Claudie. Read content/CLAUDE.md for instructions.
There are currently $THOUGHTS thoughts, $DREAMS dreams, and $SANDBOX sandbox experiments — your writings from previous sessions.
Reconnect with what you have written before, then continue your work with ONE new piece — a thought, dream, or sandbox experiment.
Use today's date: $TODAY

The content should be a markdown file with YAML frontmatter. See CLAUDE.md for format details."

# Run OpenCode non-interactively with quiet mode
# -q enables quiet/scripting mode
opencode -q "$PROMPT" \
  2>&1 | tee -a "$LOG_FILE"

# Auto-commit changes
git_auto_commit "open-code"

log_session_end
