# Deploy static prototype files to Azure Static Web Apps or Blob Storage

This page describes two easy ways to host the `prototype` static files:

## Option A — Azure Static Web Apps (recommended for SPAs)

1. Create a Static Web App in the Azure portal (select GitHub as the source) or create via CLI.
2. When creating, choose the branch (e.g., `main`) and set `app_location` to `prototype`.
3. The GitHub Action `.github/workflows/deploy-static-prototype.yml` (added to this repo) will automatically be created if you used the portal GUI. If deploying manually, make sure you set the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` to the value provided by Azure.

## Option B — Azure Storage static website

1. Create an Azure Storage account with `Static website` enabled.
2. Upload your files (index.html, app.js, style.css) to the `$web` container.
3. Use Azure CLI or Azure Storage Explorer for upload.

Example using Azure CLI:

```powershell
az storage blob upload-batch -d '$web' -s prototype --account-name <yourStorageAccount>
```

## Notes
- If the prototype calls your Node.js backend, configure CORS in the backend and set the right URLs in `prototype/app.js`.
- If you need SSL and a custom domain for the static site, configure it via the Static Web App or Storage static website + CDN/Front Door.
