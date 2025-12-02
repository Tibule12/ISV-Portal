[//]: # (Merged README: Keep SPFx content, include repo title for ISV-Portal)
# ISV-Portal — Change Control Portal (SPFx)

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

Solution|Author(s)
--------|---------
folder name | Author details (name, company, twitter alias with link)
## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

Solution|Author(s)
--------|---------
folder name | Author details (name, company, twitter alias with link)

## Version history

Version|Date|Comments
-------|----|--------
1.1|March 10, 2021|Update comment
1.0|January 29, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**
Note: If you open the repo in VS Code and see errors in `tsconfig.json` such as "extends file not found", run `npm ci` to install the Node dependencies (so the `extend` target exists), or use `tsconfig.editor.json` for lightweight editor validation while dependencies are not installed.

If you want a SharePoint-only deployment with no Azure, see `docs/no-azure-deployment.md` for a shorter path using SharePoint lists and Power Automate / Power BI.

> Include any additional steps as needed.

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

## Deploying the prototype to Azure Static Web Apps (optional)

If you want to deploy the static prototype to Azure Static Web Apps, create an Azure Static Web App resource and add the provided `AZURE_STATIC_WEB_APPS_API_TOKEN` as a repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`.

If the secret is not set, the GitHub Actions workflow `deploy-static-prototype.yml` will skip the deployment step (this is intentional to avoid failing CI for forks or non-production runs).

To add the secret:
1. Open your GitHub repository → Settings → Secrets → Actions → New repository secret
2. Set the name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Paste the deployment token from the Azure portal for your Static Web App and save.

After the secret is set, push to `main` and the workflow will automatically deploy the static artifacts from `prototype/`.

Note: If you don't want to use Azure in this project, you can safely ignore the `docs/deploy-node.md` and `docs/deploy-static.md` instructions. The node backend and Azure deployments are optional — the SPFx web part will read from the SharePoint list directly and Power Automate can handle approvals and notifications without any Azure resources.
