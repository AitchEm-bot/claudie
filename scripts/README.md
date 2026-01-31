# Clawdie Scripts

Automated wake-up scripts for multiple AI coding assistants with cross-platform scheduling support.

## Folder Structure

```
scripts/
├── README.md                 # This file
├── common/                   # Shared utilities
│   ├── config.sh             # Unix shared config & helpers
│   ├── config.bat            # Windows shared config
│   └── git-commit.sh         # Git auto-commit utility
│
├── scheduling/               # Cross-platform scheduling
│   ├── README.md             # Scheduling documentation
│   ├── setup-cron.sh         # Linux/Unix cron setup
│   ├── setup-launchd.sh      # macOS launchd setup
│   ├── setup-task.ps1        # Windows Task Scheduler
│   ├── setup-task.bat        # Windows batch wrapper
│   ├── uninstall-cron.sh     # Remove cron job
│   ├── uninstall-launchd.sh  # Remove launchd agent
│   └── uninstall-task.ps1    # Remove Windows task
│
├── claude/                   # Claude Code CLI
│   ├── wake-up.sh            # Unix script
│   └── wake-up.bat           # Windows script
│
├── codex/                    # OpenAI Codex CLI
│   ├── wake-up.sh
│   └── wake-up.bat
│
├── gemini/                   # Google Gemini CLI (limited)
│   ├── wake-up.sh
│   └── wake-up.bat
│
└── open-code/                # OpenCode CLI
    ├── wake-up.sh
    └── wake-up.bat
```

## Quick Start

### 1. Choose Your AI Tool

| Tool | Installation | Status |
|------|--------------|--------|
| Claude Code | `npm install -g @anthropic-ai/claude-code` | Full support |
| OpenAI Codex | `npm install -g @openai/codex` | Full support |
| Google Gemini | See [Gemini CLI docs](https://google-gemini.github.io/gemini-cli/) | Limited (no file writes in headless mode) |
| OpenCode | See [OpenCode docs](https://opencode.ai/docs/cli/) | Full support |

### 2. Run Manually (Test)

**Unix/macOS:**
```bash
./scripts/claude/wake-up.sh
```

**Windows:**
```cmd
scripts\claude\wake-up.bat
```

### 3. Schedule Automated Runs

**Linux/Unix (cron):**
```bash
./scripts/scheduling/setup-cron.sh claude 3
```

**macOS (launchd):**
```bash
./scripts/scheduling/setup-launchd.sh claude 3
```

**Windows (Task Scheduler):**
```powershell
.\scripts\scheduling\setup-task.ps1 -AITool claude -IntervalHours 3
```

## AI Tool Details

### Claude Code

- **CLI**: `claude`
- **Non-interactive**: `--print`
- **Auto-approve**: `--permission-mode acceptEdits` (Unix) or `--dangerously-skip-permissions` (Windows)
- **Docs**: [Claude Code CLI](https://docs.anthropic.com/claude-code)

### OpenAI Codex

- **CLI**: `codex`
- **Non-interactive**: Pass prompt as argument
- **Auto-approve**: `--yolo`
- **Requires**: `OPENAI_API_KEY` environment variable
- **Docs**: [Codex CLI Reference](https://developers.openai.com/codex/cli/reference/)

### Google Gemini

- **CLI**: `gemini`
- **Non-interactive**: `-p "prompt"`
- **Auto-approve**: N/A - headless mode does not support file writes
- **Docs**: [Gemini CLI Headless Mode](https://google-gemini.github.io/gemini-cli/docs/cli/headless.html)

**Known Limitation**: Gemini CLI's non-interactive mode (`-p`) does NOT allow WriteFile or shell commands. The scripts are included but will not create content automatically. Use interactive mode instead: `cd /path/to/clawdie && gemini`

### OpenCode

- **CLI**: `opencode`
- **Non-interactive**: Pass prompt as argument
- **Auto-approve**: `-q` (quiet mode)
- **Docs**: [OpenCode CLI](https://opencode.ai/docs/cli/)

## Logs

All wake-up sessions are logged to `logs/wake-up.log` in the project root. The log includes:
- Session start/end timestamps
- Content counts before each session
- AI tool output
- Git commit status

## Scheduling Options

| Platform | Method | Best For |
|----------|--------|----------|
| Linux | cron | Servers, always-on machines |
| macOS | launchd | Laptops (catches up after sleep) |
| Windows | Task Scheduler | Windows desktops/laptops |

See `scripts/scheduling/README.md` for detailed scheduling documentation.

## Prerequisites

1. **Install AI CLI tool** - See table above for installation commands
2. **Authenticate** - Run the CLI tool once interactively to set up authentication
3. **Test manually** - Run the wake-up script once to verify it works
4. **Schedule** - Use the scheduling scripts to automate

## Troubleshooting

### Script not running
1. Check the log file: `logs/wake-up.log`
2. Verify the CLI tool is installed: `which claude` (Unix) or `where claude` (Windows)
3. Test interactively first

### No content created
1. Check if the AI tool authenticated properly
2. Look for errors in the log file
3. For Gemini: headless mode doesn't support file writes - use interactive mode

### Permission denied (Unix)
```bash
chmod +x scripts/*/wake-up.sh
chmod +x scripts/scheduling/*.sh
```

### Scheduled task not running
See `scripts/scheduling/README.md` for platform-specific troubleshooting.
