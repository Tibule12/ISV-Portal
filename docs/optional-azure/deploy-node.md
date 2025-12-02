# Deploy the Node.js backend to Azure App Service

This guide covers creating an Azure App Service for the Node/Express backend and deploying it using the GitHub Actions workflow included in `.github/workflows/deploy-node-to-azure.yml`.

## 1) Create an Azure App Service (quick manual steps)

1) Create resource group (if you don't already have one):

```powershell
az group create -n myResourceGroup -l "eastus"
```

2) Create the App Service plan:

```powershell
az appservice plan create -n myPlan -g myResourceGroup --sku B1 --is-linux
```

3) Create a Web App (Linux) — use Node 18 as runtime:

```powershell
az webapp create -g myResourceGroup -p myPlan -n <YOUR_APP_NAME> --runtime "NODE:18-lts"
```

If you prefer Windows or other plans adjust as needed.

## 2) Configure App Settings / Environment variables

Your prototype `prototype/node_server/config.env` contains environment variables required by the server (client IDs, secrets, SMTP settings, etc.). Convert required values to App Settings in the portal or via CLI, for example:

```powershell
az webapp config appsettings set -g myResourceGroup -n <YOUR_APP_NAME> --settings "PORT=8080" "NODE_ENV=production"
```

To use secure secrets, store them as App Settings or use Key Vault references.

## 3) Get the publish profile (for GitHub Action)

Azure portal → your Web App → Deployment Center → Get publish profile (download) — then copy the XML contents.

Store the publish profile value in your GitHub repository secrets under the name `AZURE_WEBAPP_PUBLISH_PROFILE`. Also store `AZURE_WEBAPP_NAME` containing the target app name.

## 4) Trigger the GitHub Action

- Push the config: the workflow `.github/workflows/deploy-node-to-azure.yml` will run automatically on manual dispatch, or you can run it manually from the Actions tab.
- The action installs dependencies and then deploys the folder `prototype/node_server` to the App Service.

### Local quick deploy (zip deploy)

You can also deploy directly with Azure CLI zip-deploy:

```powershell
cd prototype/node_server
zip -r deploy.zip *
az webapp deployment source config-zip --resource-group myResourceGroup --name <YOUR_APP_NAME> --src deploy.zip
```

## Notes
- If the app must access Microsoft Graph or other Azure resources, register an App in Azure AD and grant permissions. See `docs/optional-azure/azure-ad-setup.md` for guidance.
- Confirm the App Service's Node runtime version matches dependencies; Node 18 is recommended for modern packages.

