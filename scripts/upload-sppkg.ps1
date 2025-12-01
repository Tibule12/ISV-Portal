<#
PowerShell helper to upload and deploy a SharePoint Framework package (.sppkg) to the tenant App Catalog.
Requires PnP.PowerShell module (Install-Module PnP.PowerShell -Scope CurrentUser)

Usage:
  ./scripts/upload-sppkg.ps1 -SppkgPath "solution/change-control-portal-spfx.sppkg" -AppCatalogUrl "https://<tenant>-apps.sharepoint.com" -Deploy

Parameters:
  -SppkgPath: Path to the .sppkg file
  -AppCatalogUrl: SharePoint app catalog url (tenant-scoped gallery), e.g. https://contoso-apps.sharepoint.com
  -Deploy: If present, will publish (deploy) the app after adding
#>
param(
    [Parameter(Mandatory=$true)] [string] $SppkgPath,
    [Parameter(Mandatory=$true)] [string] $AppCatalogUrl,
    [switch] $Deploy,
    [switch] $AutoInstall
)

try {
    Write-Host "Checking for PnP.PowerShell module..." -ForegroundColor Cyan
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        Write-Host "PnP.PowerShell not found." -ForegroundColor Yellow
        if ($AutoInstall.IsPresent) {
            Write-Host "Attempting non-interactive install of PnP.PowerShell (CurrentUser) ..." -ForegroundColor Yellow
            # Try to make PSGallery trusted for the current user if necessary
            try {
                $repo = Get-PSRepository -Name PSGallery -ErrorAction SilentlyContinue
                if ($repo -and $repo.InstallationPolicy -ne 'Trusted') {
                    Write-Host "Setting PSGallery repository to Trusted (CurrentUser)" -ForegroundColor Cyan
                    Set-PSRepository -Name PSGallery -InstallationPolicy Trusted -ErrorAction Stop
                }
            } catch {
                Write-Host "Could not set PSGallery as Trusted, proceeding with Install-Module which may prompt for acceptance." -ForegroundColor Yellow
            }

            Install-Module PnP.PowerShell -Scope CurrentUser -Force -AllowClobber -ErrorAction Stop
        } else {
            Write-Host "Module not installed. Re-run script with -AutoInstall to let this script attempt an unattended install, or run:\n  Install-Module PnP.PowerShell -Scope CurrentUser" -ForegroundColor Yellow
            exit 2
        }
    }

    Write-Host "Connecting to App Catalog: $AppCatalogUrl" -ForegroundColor Cyan
    Connect-PnPOnline -Url $AppCatalogUrl -Interactive

    $fullPath = Resolve-Path -Path $SppkgPath -ErrorAction Stop
    Write-Host "Uploading package: $fullPath" -ForegroundColor Cyan

    $app = Add-PnPApp -Path $fullPath -PublishOnAdd:$false -ErrorAction Stop
    Write-Host "App uploaded with Id: $($app.Id) and Title: $($app.Title)" -ForegroundColor Green

    if ($Deploy.IsPresent) {
        Write-Host "Publishing / deploying the app to tenant..." -ForegroundColor Cyan
        Publish-PnPApp -Identity $app.Id -ErrorAction Stop
        Write-Host "App published successfully." -ForegroundColor Green
    } else {
        Write-Host "Upload complete. Run Publish-PnPApp -Identity <id> to deploy, or re-run with -Deploy flag." -ForegroundColor Yellow
    }

} catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
