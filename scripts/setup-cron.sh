#!/bin/bash
# Installs cron job for 8x daily wake-up (every 3 hours)

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd)/wake-up.sh"

# Make script executable
chmod +x "$SCRIPT_PATH"

# Add cron job (every 3 hours)
(crontab -l 2>/dev/null | grep -v "wake-up.sh"; echo "0 */3 * * * $SCRIPT_PATH") | crontab -

echo "Cron job installed: runs every 3 hours"
echo "View with: crontab -l"
echo "Remove with: crontab -e"
