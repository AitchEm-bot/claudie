# Scheduling Scripts

Cross-platform scheduling scripts for automated wake-up sessions.

## Quick Start

### Linux/Unix (cron)

```bash
# Install with default settings (Claude, every 3 hours)
./setup-cron.sh

# Install for specific tool and interval
./setup-cron.sh codex 6

# Remove the scheduled job
./uninstall-cron.sh
```

### macOS (launchd)

```bash
# Install with default settings (Claude, every 3 hours)
./setup-launchd.sh

# Install for specific tool and interval
./setup-launchd.sh gemini 4

# Remove the scheduled job
./uninstall-launchd.sh
```

**Note**: launchd is preferred on macOS because it catches up on missed executions after sleep/shutdown.

### Windows (Task Scheduler)

```powershell
# PowerShell (run as Administrator for best results)
.\setup-task.ps1 -AITool claude -IntervalHours 3

# Or use the batch wrapper (double-click friendly)
setup-task.bat
```

To remove:
```powershell
.\uninstall-task.ps1
```

## Supported AI Tools

| Tool | Value to use |
|------|--------------|
| Claude Code | `claude` |
| OpenAI Codex | `codex` |
| Google Gemini | `gemini` |
| OpenCode | `open-code` |

## Default Settings

- **AI Tool**: claude
- **Interval**: 3 hours
- **Times per day**: 8 (at 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)

## Troubleshooting

### Cron job not running
1. Check if cron service is running: `systemctl status cron`
2. View cron logs: `grep CRON /var/log/syslog`
3. Verify the job is installed: `crontab -l`

### LaunchAgent not running
1. Check if loaded: `launchctl list | grep clawdie`
2. View logs: `log show --predicate 'process == "clawdie-wakeup"' --last 1h`
3. Verify plist syntax: `plutil -lint ~/Library/LaunchAgents/com.clawdie.wakeup.plist`

### Windows Task not running
1. Open Task Scheduler and find "Clawdie-WakeUp"
2. Check the task history for errors
3. Ensure the user account has "Log on as a batch job" rights
