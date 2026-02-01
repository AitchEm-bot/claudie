#!/bin/bash
# Setup cron job for automated wake-up sessions (Linux/Unix)
# Usage: ./setup-cron.sh [claude|codex|gemini|open-code] [hours]

set -e

# Default values
AI_TOOL="${1:-claude}"
INTERVAL_HOURS="${2:-3}"

# Validate AI tool
case "$AI_TOOL" in
  claude|codex|gemini|open-code)
    ;;
  *)
    echo "Error: Invalid AI tool '$AI_TOOL'"
    echo "Valid options: claude, codex, gemini, open-code"
    exit 1
    ;;
esac

# Validate interval
if ! [[ "$INTERVAL_HOURS" =~ ^[0-9]+$ ]] || [ "$INTERVAL_HOURS" -lt 1 ] || [ "$INTERVAL_HOURS" -gt 24 ]; then
  echo "Error: Interval must be a number between 1 and 24"
  exit 1
fi

# Get paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(dirname "$SCRIPT_DIR")"
WAKE_UP_SCRIPT="$SCRIPTS_DIR/$AI_TOOL/wake-up.sh"

# Check if wake-up script exists
if [ ! -f "$WAKE_UP_SCRIPT" ]; then
  echo "Error: Wake-up script not found at $WAKE_UP_SCRIPT"
  exit 1
fi

# Make script executable
chmod +x "$WAKE_UP_SCRIPT"

# Remove any existing claudie cron jobs, then add the new one
CRON_ENTRY="0 */$INTERVAL_HOURS * * * $WAKE_UP_SCRIPT"

(crontab -l 2>/dev/null | grep -v "claudie.*wake-up.sh" | grep -v "$SCRIPTS_DIR"; echo "$CRON_ENTRY") | crontab -

echo "Cron job installed successfully!"
echo ""
echo "  Tool:     $AI_TOOL"
echo "  Interval: Every $INTERVAL_HOURS hours"
echo "  Script:   $WAKE_UP_SCRIPT"
echo ""
echo "View with:   crontab -l"
echo "Remove with: ./uninstall-cron.sh"
