require('dotenv').config({ path: './config.env' });
const { spfi } = require('@pnp/sp');
const { SPDefault } = require('@pnp/nodejs');

async function test() {
    try {
        console.log('Testing PnP connection...');
        const onlineSiteUrl = process.env.SHAREPOINT_ONLINE_SITE_URL;
        const clientId = process.env.SHAREPOINT_ONLINE_CLIENT_ID;
        const clientSecret = process.env.SHAREPOINT_ONLINE_CLIENT_SECRET;
        const tenantId = process.env.SHAREPOINT_ONLINE_TENANT_ID;

        if (!onlineSiteUrl || !clientId || !clientSecret || !tenantId) {
            console.error('SharePoint Online configuration missing.');
            return;
        }

        console.log('Configuration found. Initializing SharePoint...');
        const sp = spfi().using(SPDefault({
            siteUrl: onlineSiteUrl,
            auth: {
                tenantId: tenantId,
                clientId: clientId,
                clientSecret: clientSecret,
            }
        }));

        console.log('Getting web title...');
        const web = await sp.web();
        console.log(`Web title: ${web.Title}`);
    } catch (e) {
        console.error('Error in test_pnp.js:', e);
    }
}

test();
