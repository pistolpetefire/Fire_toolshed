$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $python) {
  Write-Host "Python was not found. Opening index.html directly instead."
  Start-Process (Join-Path $appRoot "index.html")
  exit 0
}

$port = 8767
while ($port -le 8777) {
  $busy = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  if (-not $busy) { break }
  $port += 1
}

if ($port -gt 8777) {
  throw "No open port found between 8767 and 8777."
}

Set-Location $appRoot
$url = "http://127.0.0.1:$port/index.html"
Write-Host "Smoke Exhaust Scenario Lab is serving from:"
Write-Host $url
Write-Host "Press Ctrl+C in this window to stop the local server."
Start-Process $url
python -m http.server $port
