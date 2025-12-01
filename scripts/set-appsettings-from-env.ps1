<#
Helper script to apply key=value pairs from config.env to Azure Web App settings.
WARNING: This will upload sensitive values to App Service app settings. Use Key Vault where possible.

Usage:
  ./scripts/set-appsettings-from-env.ps1 -EnvFile "prototype/node_server/config.env" -ResourceGroup myResourceGroup -WebAppName <YOUR_APP_NAME>

Requires: Azure CLI logged in (az login)
#>
param(
    [Parameter(Mandatory=$true)] [string] $EnvFile,
    [Parameter(Mandatory=$true)] [string] $ResourceGroup,
    [Parameter(Mandatory=$true)] [string] $WebAppName
)

if (-not (Test-Path $EnvFile)) { Write-Error "Env file not found: $EnvFile"; exit 1 }

$kv = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -and -not ($_ -match '^\s*#')) {
        $line = $_.Trim()
        if ($line -match '^(.*?)=(.*)$') {
            $k = $matches[1].Trim('"')
            $v = $matches[2].Trim('"')
            $kv[$k] = $v
        }
    }
}

$settingsArray = @()
foreach ($key in $kv.Keys) {
    $settingsArray += "$key=$($kv[$key])"
}

Write-Host "Setting $(($settingsArray).Count) app settings to web app $WebAppName in resource group $ResourceGroup" -ForegroundColor Cyan
az webapp config appsettings set --resource-group $ResourceGroup --name $WebAppName --settings $settingsArray
