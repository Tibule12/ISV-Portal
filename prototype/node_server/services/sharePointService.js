const axios = require('axios');
const https = require('https');
const httpntlm = require('httpntlm');

// SharePoint REST API configuration for on-premises
const SHAREPOINT_CONFIG = {
    siteUrl: process.env.SHAREPOINT_SITE_URL || 'https://your-sharepoint-server/sites/changecontrol',
    listName: process.env.SHAREPOINT_LIST_NAME || 'ISV Change Requests',
    username: process.env.SHAREPOINT_USERNAME,
    password: process.env.SHAREPOINT_PASSWORD,
    domain: process.env.SHAREPOINT_DOMAIN
};

// Note: spClient is kept for potential future use but not currently used
// since all functions now use httpntlm directly for NTLM authentication

// Authenticate with SharePoint using NTLM
async function authenticate() {
    // NTLM authentication is handled per request using httpntlm library
    // No pre-configuration needed here
}

async function createChangeRequest(data) {
    try {
        const url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${SHAREPOINT_CONFIG.listName}')/items`;

        const requestData = {
            __metadata: { type: 'SP.Data.ISVChangeRequestsListItem' },
            Title: data.title,
            RequestID: data.requestId,
            RequestorName: data.requestorName,
            RequestorEmail: data.requestorEmail,
            Department: data.department,
            Summary: data.summary,
            Description: data.description,
            ChangeType: data.changeType,
            Priority: data.priority,
            Status: "Pending",
            SubmittedDate: new Date().toISOString()
        };

        const response = await new Promise((resolve, reject) => {
            httpntlm.post({
                url: url,
                username: SHAREPOINT_CONFIG.username,
                password: SHAREPOINT_CONFIG.password,
                domain: SHAREPOINT_CONFIG.domain,
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                },
                body: JSON.stringify(requestData),
                rejectUnauthorized: false
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        if (!response || !response.body) {
            throw new Error('No response body received from SharePoint');
        }

        const responseBody = JSON.parse(response.body);
        return {
            id: responseBody.d.Id,
            ...responseBody.d
        };
    } catch (error) {
        console.error('Error creating SharePoint item:', error);
        throw error;
    }
}

async function updateChangeRequest(id, data) {
    try {
        const url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${SHAREPOINT_CONFIG.listName}')/items(${id})`;

        const updateData = {
            __metadata: { type: 'SP.Data.ISVChangeRequestsListItem' },
            ...data
        };

        const response = await new Promise((resolve, reject) => {
            httpntlm.post({
                url: url,
                username: SHAREPOINT_CONFIG.username,
                password: SHAREPOINT_CONFIG.password,
                domain: SHAREPOINT_CONFIG.domain,
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose',
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': '*'
                },
                body: JSON.stringify(updateData),
                rejectUnauthorized: false
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        if (!response || !response.body) {
            throw new Error('No response body received from SharePoint');
        }

        const responseBody = JSON.parse(response.body);
        return responseBody;
    } catch (error) {
        console.error('Error updating SharePoint item:', error);
        throw error;
    }
}

async function getChangeRequests(filter = '') {
    try {
        let url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${SHAREPOINT_CONFIG.listName}')/items?$select=Id,Title,RequestID,RequestorName,RequestorEmail,Department,Summary,Description,ChangeType,Priority,Status,SubmittedDate,ApprovedDate,RejectedDate,Comments&$orderby=Id desc`;

        if (filter) {
            url += `&$filter=${encodeURIComponent(filter)}`;
        }

        const response = await new Promise((resolve, reject) => {
            httpntlm.get({
                url: url,
                username: SHAREPOINT_CONFIG.username,
                password: SHAREPOINT_CONFIG.password,
                domain: SHAREPOINT_CONFIG.domain,
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                rejectUnauthorized: false
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        if (!response || !response.body) {
            throw new Error('No response body received from SharePoint');
        }

        const responseBody = JSON.parse(response.body);

        // Transform SharePoint response to consistent format
        return responseBody.d.results.map(item => ({
            id: item.Id,
            title: item.Title,
            requestId: item.RequestID,
            requestorName: item.RequestorName,
            requestorEmail: item.RequestorEmail,
            department: item.Department,
            summary: item.Summary,
            description: item.Description,
            changeType: item.ChangeType,
            priority: item.Priority,
            status: item.Status,
            submittedDate: item.SubmittedDate,
            approvedDate: item.ApprovedDate,
            rejectedDate: item.RejectedDate,
            comments: item.Comments
        }));
    } catch (error) {
        console.error('Error fetching SharePoint items:', error);
        throw error;
    }
}

async function getChangeRequestById(id) {
    try {
        const url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/lists/getbytitle('${SHAREPOINT_CONFIG.listName}')/items(${id})`;

        const response = await new Promise((resolve, reject) => {
            httpntlm.get({
                url: url,
                username: SHAREPOINT_CONFIG.username,
                password: SHAREPOINT_CONFIG.password,
                domain: SHAREPOINT_CONFIG.domain,
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                rejectUnauthorized: false
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        if (!response || !response.body) {
            throw new Error('No response body received from SharePoint');
        }

        const responseBody = JSON.parse(response.body);
        const item = responseBody.d;
        return {
            id: item.Id,
            title: item.Title,
            requestId: item.RequestID,
            requestorName: item.RequestorName,
            requestorEmail: item.RequestorEmail,
            department: item.Department,
            summary: item.Summary,
            description: item.Description,
            changeType: item.ChangeType,
            priority: item.Priority,
            status: item.Status,
            submittedDate: item.SubmittedDate,
            approvedDate: item.ApprovedDate,
            rejectedDate: item.RejectedDate,
            comments: item.Comments
        };
    } catch (error) {
        console.error('Error fetching SharePoint item:', error);
        throw error;
    }
}

async function testConnection() {
    try {
        // Use httpntlm for NTLM authentication (callback-based, so wrap in promise)
        const url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/title`;

        const response = await new Promise((resolve, reject) => {
            httpntlm.get({
                url: url,
                username: SHAREPOINT_CONFIG.username,
                password: SHAREPOINT_CONFIG.password,
                domain: SHAREPOINT_CONFIG.domain,
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                rejectUnauthorized: false
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        console.log('NTLM Response:', response); // Debug logging

        // Check if response exists and has body
        if (!response || !response.body) {
            throw new Error('No response body received from SharePoint');
        }

        // Parse the JSON response body
        const responseBody = JSON.parse(response.body);
        return {
            success: true,
            siteTitle: responseBody.d.Title,
            message: 'Successfully connected to SharePoint site using NTLM'
        };
    } catch (error) {
        console.error('SharePoint connection test failed:', error);
        return {
            success: false,
            error: error.message || 'NTLM authentication failed',
            details: error
        };
    }
}

module.exports = {
    createChangeRequest,
    updateChangeRequest,
    getChangeRequests,
    getChangeRequestById,
    testConnection
};
