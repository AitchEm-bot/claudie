#!/bin/bash
# Remove launchd agent for wake-up sessions (macOS)

set -e

PLIST_PATH="$HOME/Library/LaunchAgents/com.claudie.wakeup.plist"

if [ -f "$PLIST_PATH" ]; then
  # Unload the agent
  launchctl unload "$PLIST_PATH" 2>/dev/null || true

  # Remove the plist file
  rm "$PLIST_PATH"

  echo "LaunchAgent removed successfully!"
else
  echo "No claudie LaunchAgent found at $PLIST_PATH"
fi
