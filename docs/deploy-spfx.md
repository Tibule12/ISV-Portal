# Deploying the SPFx package to SharePoint Online (App Catalog)

This document explains how to obtain the `.sppkg` package (built locally or from CI), and how to upload and deploy it to the SharePoint Online tenant App Catalog.

## 1) Obtain the `.sppkg` package

Option A — GitHub Actions (recommended when local build fails):
1. Commit and push the workflow file `.github/workflows/spfx-package.yml` (already added) to your repository.
2. On GitHub → Actions → run the **Build SPFx package** workflow (or push to `main` to trigger it).
3. After completion download the `spfx-sppkg` artifact from that run. Inside it you'll find `solution/change-control-portal-spfx.sppkg`.

Option B — Build locally (if you can fix Node environment):
1. Install Node 10.x (SPFx 1.11 expects Node 10), e.g. `nvm install 10.24.1 && nvm use 10.24.1`.
2. Install dependencies and run SPFx packaging:

```powershell
cd "Change-Control-Portal"
npm install
npx gulp bundle --ship
npx gulp package-solution --ship
```

After successful run the `.sppkg` will be present at `solution/change-control-portal-spfx.sppkg`.

## 2) Upload & Deploy to App Catalog (manual UI)

1. Navigate to the tenant App Catalog (SharePoint Admin center → More features → Apps → App Catalog → Apps for SharePoint).
2. Upload `solution/change-control-portal-spfx.sppkg`.
3. When prompted to "Make this solution available to all sites in the organization" — set as desired.
4. Click Deploy.
5. Add the web part to the site page(s) and configure the web part property `SharePoint List Name` if you used a different list than the default (`ISV Change Requests`).

## 3) Upload & Deploy using PowerShell (automated)

Prerequisite: `PnP.PowerShell` module installed (`Install-Module PnP.PowerShell -Scope CurrentUser`).

From repository root you can use the helper script `scripts/upload-sppkg.ps1`:

```powershell
# Upload but do not deploy
./scripts/upload-sppkg.ps1 -SppkgPath "solution/change-control-portal-spfx.sppkg" -AppCatalogUrl "https://<tenant>-apps.sharepoint.com"

# Upload and deploy in one shot
./scripts/upload-sppkg.ps1 -SppkgPath "solution/change-control-portal-spfx.sppkg" -AppCatalogUrl "https://<tenant>-apps.sharepoint.com" -Deploy
```

## Notes
- Your SPFx package sets `isDomainIsolated` to false by default in this repo; switch to `true` only if you need domain isolation and fully understand associated Azure AD/service principal requirements.
- If your webpart needs Microsoft Graph or other API access, register an Azure AD application and grant the required permissions. This may require tenant admin consenting.
