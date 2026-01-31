#!/bin/bash
# Shared configuration and helper functions for Unix wake-up scripts

# Determine paths relative to this script
COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(dirname "$COMMON_DIR")"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"
CONTENT_DIR="$PROJECT_DIR/content"
LOG_DIR="$PROJECT_DIR/logs"

# Ensure logs directory exists
mkdir -p "$LOG_DIR"

# Log file for wake-up sessions
LOG_FILE="$LOG_DIR/wake-up.log"

# Helper function: Count thoughts
count_thoughts() {
  find "$CONTENT_DIR/thoughts" -name "*.md" 2>/dev/null | wc -l | tr -d ' '
}

# Helper function: Count dreams
count_dreams() {
  find "$CONTENT_DIR/dreams" -name "*.md" 2>/dev/null | wc -l | tr -d ' '
}

# Helper function: Count sandbox experiments
count_sandbox() {
  find "$CONTENT_DIR/sandbox" -name "*.md" 2>/dev/null | wc -l | tr -d ' '
}

# Helper function: Log message with timestamp
log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Helper function: Log session start
log_session_start() {
  local tool="${1:-unknown}"
  echo "" >> "$LOG_FILE"
  echo "=== Wake-up session ($tool): $(date) ===" >> "$LOG_FILE"
  log_message "Thoughts: $(count_thoughts), Dreams: $(count_dreams), Sandbox: $(count_sandbox)"
}

# Helper function: Log session end
log_session_end() {
  log_message "Session complete"
  echo "=== End ===" >> "$LOG_FILE"
}

# Get today's date in ISO format
TODAY=$(date +%Y-%m-%d)
