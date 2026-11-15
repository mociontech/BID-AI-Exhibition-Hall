# Run on the Windows computer connected to the TV, using its TV link from sesiones.html.
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory=$true)]
    [string]$DisplayUrl,
    [ValidateSet('Chrome','Edge')]
    [string]$Browser = 'Chrome'
)
$ErrorActionPreference = 'Stop'
$displayUri = $null
if (-not [Uri]::TryCreate($DisplayUrl, [UriKind]::Absolute, [ref]$displayUri) -or
    $displayUri.Scheme -notin @('http','https') -or $DisplayUrl.Contains('"') -or
    $displayUri.AbsolutePath -ne '/display.html') {
    throw 'Use the complete TV link ending in /display.html with its station and room parameters.'
}
$relativeExe = if ($Browser -eq 'Chrome') { 'Google\Chrome\Application\chrome.exe' } else { 'Microsoft\Edge\Application\msedge.exe' }
$browserExe = @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:LOCALAPPDATA) |
    Where-Object { $_ } | ForEach-Object { Join-Path $_ $relativeExe } |
    Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $browserExe) { throw "$Browser was not found. Install it or choose the other browser." }
# A separate profile ensures the flag is used even if a normal browser is already running.
$displayProfile = Join-Path $env:LOCALAPPDATA "BID-AI-Exhibition-Hall\$Browser-Display"
if ($PSCmdlet.ShouldProcess($Browser, 'Open the exhibition display with automatic audio')) {
    Start-Process -FilePath $browserExe -WindowStyle Normal -ArgumentList @(
        "--user-data-dir=`"$displayProfile`"",
        '--autoplay-policy=no-user-gesture-required',
        '--no-first-run',
        "--app=`"$DisplayUrl`""
    )
}
