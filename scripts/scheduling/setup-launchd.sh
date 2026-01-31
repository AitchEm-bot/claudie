#!/bin/bash
# Setup launchd agent for automated wake-up sessions (macOS)
# Usage: ./setup-launchd.sh [claude|codex|gemini|open-code] [hours]

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

# Calculate interval in seconds
INTERVAL_SECONDS=$((INTERVAL_HOURS * 3600))

# Get paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"
WAKE_UP_SCRIPT="$SCRIPTS_DIR/$AI_TOOL/wake-up.sh"
PLIST_PATH="$HOME/Library/LaunchAgents/com.clawdie.wakeup.plist"
LOG_DIR="$PROJECT_DIR/logs"

# Check if wake-up script exists
if [ ! -f "$WAKE_UP_SCRIPT" ]; then
  echo "Error: Wake-up script not found at $WAKE_UP_SCRIPT"
  exit 1
fi

# Make script executable
chmod +x "$WAKE_UP_SCRIPT"

# Ensure LaunchAgents directory exists
mkdir -p "$HOME/Library/LaunchAgents"

# Unload existing agent if present
if launchctl list | grep -q "com.clawdie.wakeup"; then
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Create the plist file
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawdie.wakeup</string>

    <key>ProgramArguments</key>
    <array>
        <string>$WAKE_UP_SCRIPT</string>
    </array>

    <key>StartInterval</key>
    <integer>$INTERVAL_SECONDS</integer>

    <key>RunAtLoad</key>
    <true/>

    <key>StandardOutPath</key>
    <string>$LOG_DIR/launchd-stdout.log</string>

    <key>StandardErrorPath</key>
    <string>$LOG_DIR/launchd-stderr.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
EOF

# Load the agent
launchctl load "$PLIST_PATH"

echo "LaunchAgent installed successfully!"
echo ""
echo "  Tool:     $AI_TOOL"
echo "  Interval: Every $INTERVAL_HOURS hours"
echo "  Script:   $WAKE_UP_SCRIPT"
echo "  Plist:    $PLIST_PATH"
echo ""
echo "View status: launchctl list | grep clawdie"
echo "Remove with: ./uninstall-launchd.sh"
