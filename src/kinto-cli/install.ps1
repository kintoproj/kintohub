#Requires -Version 5

# remote install commands:
#   Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/kintoproj/kinto-cli/master/install.ps1')
#   iex (new-object net.webclient).downloadstring('https://raw.githubusercontent.com/kintoproj/kinto-cli/master/install.ps1')
#   iwr https://raw.githubusercontent.com/kintoproj/kinto-cli/master/install.ps1 | iex


$old_erroractionpreference = $erroractionpreference
$erroractionpreference = 'stop' # quit if anything goes wrong

if (($PSVersionTable.PSVersion.Major) -lt 5) {
    Write-Output "PowerShell 5 or later is required to download Kinto CLI."
    Write-Output "Upgrade PowerShell: https://docs.microsoft.com/en-us/powershell/scripting/setup/installing-windows-powershell"
    break
}

# show notification to change execution policy:
$allowedExecutionPolicy = @('Unrestricted', 'RemoteSigned', 'ByPass')
if ((Get-ExecutionPolicy).ToString() -notin $allowedExecutionPolicy) {
    Write-Output "PowerShell requires an execution policy in [$($allowedExecutionPolicy -join ", ")] to download Kinto CLI"
    Write-Output "For example, to set the execution policy to 'RemoteSigned' please run :"
    Write-Output "'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'"
    break
}


Write-Output 'Initializing...'

#Variables
$repoName = "kintoproj/kinto-cli"
$releaseName = "cli-kinto-win-amd64.zip"
$installationPath = $ENV:UserProfile+"\kinto"

$latestRelease = Invoke-WebRequest https://github.com/$repoName/releases/latest -Headers @{"Accept"="application/json"}
$json = $latestRelease.Content | ConvertFrom-Json
$latestVersion = $json.tag_name

Write-Output "Latest version found $latestVersion"

$downloadLink = "https://github.com/$repoName/releases/download/$latestVersion/$releaseName"
$downloadPath = Join-Path -Path $([System.IO.Path]::GetTempPath()) -ChildPath $(Split-Path -Path $downloadLink -Leaf)

echo "Downloading $releaseName ..."
Invoke-WebRequest $downloadLink -Out $downloadPath

Write-Output "Extracting..."
Remove-Item -Path $installationPath -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path $downloadPath -DestinationPath $installationPath -Force

Write-Output 'Removing temp files...'
Remove-Item $downloadPath -Force

$path = ([Environment]::GetEnvironmentVariable("Path", "User"))

if ($path.Indexof($installationPath) -eq -1) { 
    Write-Output "Adding Kinto to PATH..."
    [Environment]::SetEnvironmentVariable("Path", $path +";"+ $installationPath, "User")
    break
} else {
    Write-Output "Kinto is already present in PATH. Skipping..."
}

Write-Output "Successfully installed."


