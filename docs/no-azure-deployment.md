# Deploy without Azure — SharePoint Online only

This file outlines a minimal deployment path that uses only Microsoft 365 features (SharePoint Online, Power Automate, Power BI) — no Azure required.

Prerequisites
- Tenant admin access to the SharePoint App Catalog and ability to create site collections and SharePoint groups.
- Member accounts for approvers and requestors.

Steps
1. Provision the SharePoint list (manual or PnP):
   - Use `docs/sharepoint-pnp.json` via PnP.PowerShell: `Connect-PnPOnline -Url https://<tenant>.sharepoint.com/sites/<site>; Apply-PnPProvisioningTemplate -Path docs/sharepoint-pnp.json`.
2. Build the SPFx package (locally or via GitHub Actions):
   - Locally (Node 10 for SPFx 1.11):
     ```powershell
     npm install
     npx gulp bundle --ship
     npx gulp package-solution --ship
     ```
   - Or trigger the GitHub Actions workflow `.github/workflows/spfx-package.yml` and download the artifact.
3. Upload the `.sppkg` to the tenant App Catalog and deploy:
   - Tenant Admin → Apps → App Catalog → Upload `solution/change-control-portal-spfx.sppkg` and Deploy.
4. Add the web part to the site page(s):
   - Edit a modern SharePoint page → click `+` → add the `Change Control Portal` web part.
5. Verify the web part reads items from the `ISV Change Requests` list. If using a different list name, update the web part property `SharePoint List Name` on the property pane.
6. Configure flows and Power BI dashboards (Power Automate / Power BI):
   - Use `docs/powerautomate-flow.md` to implement approvals and notifications.
   - Point Power BI to the SharePoint list for dashboards and embed them on your portal page.

Notes
- This deployment removes the dependency on a Node.js backend. If you still need a server for advanced workflow integrations (like Spice Wax), host it internally or on a private Azure App Service and use secure credentials.
- Review `config/package-solution.json` — `isDomainIsolated` is set to `false` for this deployment path.

If you want, I can also add a PowerShell script to automatically upload & publish the `.sppkg` to the tenant app catalog using `PnP.PowerShell` (requires admin consent).
