<#
Provision the SharePoint list for the portal using PnP.PowerShell

Usage:
  ./scripts/provision-list.ps1 -SiteUrl "https://<tenant>.sharepoint.com/sites/<site>"

Requires: Install-Module PnP.PowerShell -Scope CurrentUser
#>
param(
    [Parameter(Mandatory=$true)] [string] $SiteUrl,
    [Parameter(Mandatory=$false)] [string] $Template = "docs/sharepoint-pnp.json"
)

try {
    Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "Applying provisioning template: $Template" -ForegroundColor Cyan
    Apply-PnPProvisioningTemplate -Path $Template -ClearNavigation -Force
    Write-Host "Provisioning complete." -ForegroundColor Green
} catch {
    Write-Error "Error during provisioning: $($_.Exception.Message)"
    exit 1
}
