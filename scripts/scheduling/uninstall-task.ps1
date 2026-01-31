# Remove Windows Task Scheduler job for wake-up sessions
# Usage: .\uninstall-task.ps1

$ErrorActionPreference = "Stop"

$TaskName = "Clawdie-WakeUp"

$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Task '$TaskName' removed successfully!" -ForegroundColor Green
} else {
    Write-Host "No task named '$TaskName' found."
}
