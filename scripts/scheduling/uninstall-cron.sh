#!/bin/bash
# Remove cron job for wake-up sessions

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(dirname "$SCRIPT_DIR")"

# Remove any clawdie-related cron jobs
if crontab -l 2>/dev/null | grep -q "$SCRIPTS_DIR"; then
  crontab -l 2>/dev/null | grep -v "$SCRIPTS_DIR" | crontab -
  echo "Cron job removed successfully!"
else
  echo "No clawdie cron job found."
fi
