# Azure AD App Registration & Permissions — Backend + SPFx

This guide explains how to register the Node.js backend with Azure AD, grant required Graph/SharePoint permissions, create a client secret, and wire those values into your Azure App Service (or local config during development).

**Important security note**: Remove secrets from source control. Move secrets to Azure App Settings, Azure Key Vault, or GitHub secrets and never commit them to the repository.

## 1) Backend (Node.js) App Registration (recommended)

1. Sign in to the Azure portal → Azure Active Directory → App registrations → New registration.
2. Name: `ISV Change Control Portal - backend` (example). Account types: choose `Single tenant` or as required.
3. Redirect URIs: Not required for server-to-server flows; if you later add OAuth callbacks, add them.
4. After creation, take note of **Application (client) ID** and **Directory (tenant) ID**.

### Create a client secret
- In the App Registration → Certificates & secrets → New client secret → name and select expiration → *copy value now*.
- Save the secret value securely (you'll need to store it in App Settings or Key Vault).

### API Permissions
- If the backend uses PnP or Microsoft Graph: add required delegated or application permissions under `API permissions`.
- For server-to-server calls to SharePoint or Graph, use `Application` permissions and then grant admin consent.

Common permissions for backend:
- Microsoft Graph: `User.Read.All` (application) or more specific if reading users.
- SharePoint: `Sites.Read.All`, `Sites.FullControl.All` (be careful — use least privilege).

After adding `Application` permissions you must `Grant admin consent`.

## 2) SPFx Web Part (if using MS Graph or backend calls)

- SPFx hosted in SharePoint uses _Azure AD Multi-tenant_ or delegated permissions for calling Microsoft Graph.
- If SPFx needs Graph permissions, you can configure them from the SharePoint admin center under API access or via an Azure AD App registration.

If your package is `isDomainIsolated` true, you may also need special considerations for isolated web parts (Azure AD/Service principals hosting cross-domain logic).

## 3) Wiring values to Azure App Service (recommended)
Use `Application settings` in the App Service to store `SHAREPOINT_ONLINE_CLIENT_ID`, `SHAREPOINT_ONLINE_CLIENT_SECRET`, `SHAREPOINT_ONLINE_TENANT_ID`, and other secrets (SMTP credentials, etc.).

You can set these via the Azure CLI like this:

```powershell
az webapp config appsettings set -g myResourceGroup -n <YOUR_APP_NAME> --settings \
	SHAREPOINT_ONLINE_CLIENT_ID="<CLIENT_ID>" \
	SHAREPOINT_ONLINE_CLIENT_SECRET="<CLIENT_SECRET>" \
	SHAREPOINT_ONLINE_TENANT_ID="<TENANT_ID>"
```

Or use Managed Identities + Key Vault for better security: enable system-assigned managed identity on the App Service and store secrets in Key Vault.

## 4) Local development
- Keep a local `config.env` for development (ignored by git); never store production secrets inside the repo.
- Use a separate dev/test Azure AD app registration for developer work.

## 5) Post-registration checklist
- Verify that `client id` / `secret` work by using a test script that acquires a token and calls the SharePoint or Graph endpoint.
- Rotate and remove secrets after creating Key Vault references.
- Ensure minimal permissions and audit usage.

## URGENT: Found secrets committed in the repository

During a repo review we discovered active-looking secrets in `prototype/node_server/config.env`. These values have been replaced in the repository with placeholders and a `config.env.example` has been added. Immediate steps you must take:

- Rotate any leaked credentials right away (Azure AD client secret, SMTP password, etc.).
- Remove any externally accessible endpoints or credentials that were exposed while the leaked values were in the repo.
- If these credentials were used in production, follow your incident response / secrets rotation process and update any App Service/Key Vault references.
- After rotation, update App Service app settings or Key Vault references and do not put secrets in source control.

If you want help, I can:

- Scrub these secrets from Git history (using `git filter-repo` or BFG) — NOTE: this rewrites history and requires coordination with other developers.
- Add GitHub Actions / Azure steps to use Key Vault references instead of committing secrets.

