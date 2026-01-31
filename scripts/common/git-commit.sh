#!/bin/bash
# Git auto-commit utility for wake-up scripts
# Source this file after running the AI CLI

# This script expects:
# - PROJECT_DIR to be set (from config.sh)
# - LOG_FILE to be set (from config.sh)
# - log_message function to be available (from config.sh)

git_auto_commit() {
  local tool="${1:-AI}"

  cd "$PROJECT_DIR" || return 1

  # Check if there are changes in content/
  if [[ -n $(git status --porcelain content/ 2>/dev/null) ]]; then
    git add content/
    local commit_msg="Wake-up session ($tool): $(date +%Y-%m-%d_%H:%M)"

    if git commit -m "$commit_msg" >/dev/null 2>&1; then
      log_message "Changes committed: $commit_msg"
      echo "Changes committed"
      return 0
    else
      log_message "Git commit failed"
      echo "Failed to commit changes"
      return 1
    fi
  else
    log_message "No new content created"
    echo "No new content to commit"
    return 0
  fi
}
