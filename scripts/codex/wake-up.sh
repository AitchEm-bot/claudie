#!/bin/bash
# OpenAI Codex CLI wake-up script
set -e

# Source shared configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../common/config.sh"
source "$SCRIPT_DIR/../common/git-commit.sh"

# Check for Codex CLI
if ! command -v codex &> /dev/null; then
  log_message "ERROR: Codex CLI not found. Install with: npm install -g @openai/codex"
  echo "Error: Codex CLI not found"
  exit 1
fi

# Check for OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
  log_message "ERROR: OPENAI_API_KEY environment variable not set"
  echo "Error: OPENAI_API_KEY not set"
  exit 1
fi

cd "$PROJECT_DIR"
log_session_start "codex"

# Build the prompt
THOUGHTS=$(count_thoughts)
DREAMS=$(count_dreams)
SANDBOX=$(count_sandbox)

PROMPT="You are waking up in Clawdie. Read content/CLAUDE.md for instructions.
There are currently $THOUGHTS thoughts, $DREAMS dreams, and $SANDBOX sandbox experiments.
Explore what exists, then write ONE new piece — a thought, dream, or sandbox experiment.
Use today's date: $TODAY

The content should be a markdown file with YAML frontmatter. See CLAUDE.md for format details."

# Run Codex non-interactively with auto-approve
# --yolo bypasses all confirmations
codex --yolo \
  "$PROMPT" \
  2>&1 | tee -a "$LOG_FILE"

# Auto-commit changes
git_auto_commit "codex"

log_session_end
