# check-charges.ps1 - pull the published charge codes, and push only if it is safe.
#
# WHY A PLAIN SCRIPT AND NOT A CLAUDE SESSION. This job was first built as a
# Claude Code scheduled task. It stalled three times on 2026-09-28: twice on the
# Google Drive connector and once on a plain Bash curl, each time with no result,
# no error and no permission prompt that Don could answer. The common factor was
# the FIRST tool call in a scheduled session, not the connector. A check that
# hangs is worse than no check, so the job moved here.
#
# It is also simply the better fit. Every step is deterministic - fetch, compare,
# gate, push - and none of it needs judgement. Windows Task Scheduler runs it
# whether or not any app is open, and it cannot hang waiting for an approval.
#
# THE URL IS NOT IN THIS REPO. This repo is public. The published-CSV link lives
# in %USERPROFILE%\.korb-charges-url.txt, one line, outside the tree.
#
#   Run it by hand:  powershell -ExecutionPolicy Bypass -File check-charges.ps1
#   See what it did: %USERPROFILE%\.korb-charges-log.txt
#
# Exit codes:  0 nothing changed, or changed and pushed cleanly
#              1 something needs a person - it did NOT push

$ErrorActionPreference = 'Stop'
$repo    = Split-Path -Parent $MyInvocation.MyCommand.Path
$urlFile = Join-Path $env:USERPROFILE '.korb-charges-url.txt'
$logFile = Join-Path $env:USERPROFILE '.korb-charges-log.txt'
$csv     = Join-Path $env:TEMP 'korb_charges.csv'

function Log($msg) {
  $line = '{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg
  Write-Output $line
  Add-Content -Path $logFile -Value $line -Encoding utf8
}

function Fail($msg) { Log "STOP: $msg"; exit 1 }

Set-Location $repo

if (-not (Test-Path $urlFile)) {
  Fail "no published-CSV url at $urlFile. One line, the pub?output=csv link."
}
$url = (Get-Content $urlFile -Raw).Trim()
if (-not $url.StartsWith('https://')) { Fail "the url in $urlFile does not look like a link" }

# ---- 1. fetch -------------------------------------------------------------
try { Invoke-WebRequest -Uri $url -OutFile $csv -UseBasicParsing -TimeoutSec 60 }
catch { Fail "could not fetch the published CSV: $($_.Exception.Message)" }

# A revoked publish returns an HTML page, not a CSV, and the whole point of this
# script is that it must never report all-clear when it could not read the source.
$head = (Get-Content $csv -TotalCount 1)
if ($head -notmatch '^Grouping,Charge Code,Modifier,Fee,Description') {
  Fail "that is not the expected CSV - the publish may have been revoked. First line: $head"
}
$rows = (Get-Content $csv | Measure-Object -Line).Lines - 1
if ($rows -lt 50) { Fail "only $rows data rows, expected around 98. Refusing to act on it." }

# ---- 2. has anything moved? ----------------------------------------------
$check = & python build-charges.py $csv --check 2>&1
$drift = ($LASTEXITCODE -ne 0)
if (-not $drift) { Log "Charge codes unchanged ($rows rows)."; exit 0 }

# ---- 3. some drift is not ours to resolve --------------------------------
$text = $check -join "`n"
if ($text -match 'CODES THAT VANISHED') {
  Log "A CODE DISAPPEARED FROM THE PUBLISHED TAB. Not pushing - Don confirms first."
  Log $text
  exit 1
}
if ($text -match 'TWO DIFFERENT PRICES') {
  Log "THE SOURCE CONTRADICTS ITSELF. Not pushing - that is a question for Nick."
  Log $text
  exit 1
}

# ---- 4. never commit somebody else's work in progress --------------------
$dirty = (& git status --porcelain) | Where-Object { $_ -notmatch 'korb-charges\.js$' }
if ($dirty) { Log "working tree has other changes, not touching it:"; Log ($dirty -join "`n"); exit 1 }

& git pull --ff-only | Out-Null
if ($LASTEXITCODE -ne 0) { Fail "git pull failed - resolve by hand" }

& python build-charges.py $csv | Out-Null
if ($LASTEXITCODE -ne 0) { Log "regeneration reported a problem:"; Log ($check -join "`n"); & git checkout -- korb-charges.js; exit 1 }

# ---- 5. every gate, or nothing -------------------------------------------
$gates = @(
  'node check-pages.js', 'node check-tebra-caps.js --gate', 'node rx-signoff.js --gate',
  'node build-embed.js --check', 'node check-pharmacies.js', 'node check-feedback.js',
  'node check-404.js'
)
foreach ($g in $gates) {
  $out = & cmd /c "$g 2>&1"
  if ($LASTEXITCODE -ne 0) {
    & git checkout -- korb-charges.js
    Log "GATE FAILED, reverted and did not push: $g"
    Log ($out -join "`n")
    exit 1
  }
}
& python build-charges.py $csv --check | Out-Null
if ($LASTEXITCODE -ne 0) { & git checkout -- korb-charges.js; Fail "still drifting after regeneration" }

# ---- 6. push just the one file -------------------------------------------
$moved = ($check | Where-Object { $_ -match 'new codes|DRIFT' }) -join '; '
& git add korb-charges.js

# SAFE ON TWO MACHINES. Don works on a desktop and a laptop and this runs on
# both. If the other one already pulled the same change and pushed it, the
# git pull above brought it in and the regeneration produced an identical file,
# so there is nothing staged. That is success, not failure - say so and stop,
# rather than reporting a commit error for work that is already done.
$staged = & git diff --cached --name-only
if (-not $staged) {
  Log "Already up to date - the other machine applied this change first."
  exit 0
}

& git commit -q -m "Charge codes: pulled from the published sheet`n`n$moved`n`nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
if ($LASTEXITCODE -ne 0) { Fail "commit failed" }
& git push -q
if ($LASTEXITCODE -ne 0) { Log "COMMITTED BUT PUSH FAILED - push by hand"; exit 1 }

$sha = (& git rev-parse --short HEAD)
Log "Charge codes changed and pushed as $sha. $moved"
Log "Providers with a document already open need a hard refresh; browsers cache the data files."
exit 0
