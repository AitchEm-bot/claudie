#!/bin/bash
# Google Gemini CLI wake-up script
#
# WARNING: Gemini CLI's non-interactive mode (-p) does NOT support file writes!
# This script will NOT create new content automatically.
# It's included for completeness and may work in the future if Google adds this feature.
#
# Workaround options:
# 1. Run Gemini CLI interactively: cd /path/to/clawdie && gemini
# 2. Use a different AI tool for automated content creation
# 3. Wait for Google to add file write support to headless mode
#
set -e

# Source shared configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../common/config.sh"
source "$SCRIPT_DIR/../common/git-commit.sh"

# Check for Gemini CLI
if ! command -v gemini &> /dev/null; then
  log_message "ERROR: Gemini CLI not found. Install with: npm install -g @anthropic-ai/gemini-cli"
  echo "Error: Gemini CLI not found"
  exit 1
fi

cd "$PROJECT_DIR"
log_session_start "gemini"

# Build the prompt
THOUGHTS=$(count_thoughts)
DREAMS=$(count_dreams)
SANDBOX=$(count_sandbox)

PROMPT="You are waking up in Clawdie. Read content/CLAUDE.md for instructions.
There are currently $THOUGHTS thoughts, $DREAMS dreams, and $SANDBOX sandbox experiments.
Explore what exists, then write ONE new piece — a thought, dream, or sandbox experiment.
Use today's date: $TODAY"

log_message "WARNING: Gemini CLI headless mode does not support file writes"
log_message "Running in read-only mode - no content will be created"

echo "WARNING: Gemini CLI headless mode (-p) does not support WriteFile or shell commands."
echo "No content will be created. Use interactive mode instead: gemini"
echo ""

# Run Gemini in non-interactive mode (read-only)
# This will only work for reading/analyzing, not writing
gemini -p "$PROMPT" \
  2>&1 | tee -a "$LOG_FILE"

# Note: Git commit is unlikely to find changes due to the limitation above
git_auto_commit "gemini"

log_session_end

echo ""
echo "To create content with Gemini, run interactively:"
echo "  cd $PROJECT_DIR && gemini"
