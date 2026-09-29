# install-charge-check.ps1 - register the daily charge-code check on this machine.
#
# Don works on a desktop and a laptop. check-charges.ps1 is in the repo so it
# arrives with a pull, but two things do NOT travel with it: the Windows Task
# Scheduler entry, and the published-CSV url. This sets both up.
#
#   powershell -ExecutionPolicy Bypass -File install-charge-check.ps1 -Url "<the pub?output=csv link>"
#
# Leave -Url off if %USERPROFILE%\.korb-charges-url.txt is already there.
#
# SAFE TO RUN ON BOTH MACHINES. check-charges.ps1 pulls before it regenerates,
# so whichever runs first wins and the second finds nothing to commit and says
# so. Running it in both places means the check happens wherever you are, which
# is the point - a check that only runs on the machine that is switched off is
# not a check.
#
# THE URL IS NOT IN THE REPO, deliberately: this repo is public and the
# published tab should not be discoverable from it.

param(
  [string]$Url,
  [string]$At = '7:30am',
  [string]$TaskName = 'KORB charge codes'
)

$ErrorActionPreference = 'Stop'
$repo    = Split-Path -Parent $MyInvocation.MyCommand.Path
$script  = Join-Path $repo 'check-charges.ps1'
$urlFile = Join-Path $env:USERPROFILE '.korb-charges-url.txt'

if (-not (Test-Path $script)) { throw "check-charges.ps1 is not beside this file - run it from the repo" }

if ($Url) {
  if (-not $Url.StartsWith('https://docs.google.com/')) { throw "that does not look like the published-CSV link" }
  Set-Content -Path $urlFile -Value $Url.Trim() -NoNewline -Encoding utf8
  Write-Output "url written to $urlFile"
} elseif (-not (Test-Path $urlFile)) {
  throw "no url yet. Pass -Url with the published pub?output=csv link, or copy $urlFile over from the other machine."
} else {
  Write-Output "using the url already at $urlFile"
}

$action  = New-ScheduledTaskAction -Execute 'powershell.exe' `
             -Argument "-ExecutionPolicy Bypass -NoProfile -File `"$script`"" -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Daily -At $At
# StartWhenAvailable is the one that matters on a laptop: if it was asleep or
# shut at the trigger time, the task runs at the next opportunity instead of
# being skipped until tomorrow.
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries `
              -AllowStartIfOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings `
  -Description "Pull KORB charge codes from the published sheet, regenerate korb-charges.js, push only if every gate passes. Log: %USERPROFILE%\.korb-charges-log.txt" `
  -Force | Out-Null

Write-Output "registered `"$TaskName`", daily at $At"
Write-Output ''
Write-Output 'running it once to prove it works...'
& powershell -ExecutionPolicy Bypass -NoProfile -File $script
Write-Output "exit code: $LASTEXITCODE"
Write-Output ''
Write-Output "log: $(Join-Path $env:USERPROFILE '.korb-charges-log.txt')"
