# Setup Windows Task Scheduler for automated wake-up sessions
# Usage: .\setup-task.ps1 [-AITool claude|codex|gemini|open-code] [-IntervalHours 3]

param(
    [ValidateSet("claude", "codex", "gemini", "open-code")]
    [string]$AITool = "claude",

    [ValidateRange(1, 24)]
    [int]$IntervalHours = 3
)

$ErrorActionPreference = "Stop"

# Get paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptsDir = Split-Path -Parent $ScriptDir
$ProjectDir = Split-Path -Parent $ScriptsDir
$WakeUpScript = Join-Path $ScriptsDir "$AITool\wake-up.bat"

# Verify wake-up script exists
if (-not (Test-Path $WakeUpScript)) {
    Write-Error "Wake-up script not found at: $WakeUpScript"
    exit 1
}

# Task name
$TaskName = "Clawdie-WakeUp"

# Remove existing task if present
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Removed existing task."
}

# Create the action
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$WakeUpScript`""

# Create trigger - repeating every N hours indefinitely
# Start from midnight today
$StartTime = (Get-Date).Date

$Trigger = New-ScheduledTaskTrigger -Once -At $StartTime -RepetitionInterval (New-TimeSpan -Hours $IntervalHours)

# Create settings
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -MultipleInstances IgnoreNew

# Create principal (run as current user)
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Limited

# Register the task
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Principal $Principal `
    -Description "Clawdie wake-up session using $AITool (every $IntervalHours hours)"

Write-Host ""
Write-Host "Task Scheduler job installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "  Tool:     $AITool"
Write-Host "  Interval: Every $IntervalHours hours"
Write-Host "  Script:   $WakeUpScript"
Write-Host "  Task:     $TaskName"
Write-Host ""
Write-Host "View in Task Scheduler or run: Get-ScheduledTask -TaskName '$TaskName'"
Write-Host "Remove with: .\uninstall-task.ps1"
