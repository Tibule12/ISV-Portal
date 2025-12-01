require('dotenv').config({ path: './config.env' });
require('isomorphic-fetch');

const { spfi, SPDefault } = require('@pnp/sp');
const { SPFetchClient } = require('@pnp/nodejs-commonjs');
const { ClientSecretCredential } = require('@azure/identity');

const onlineSiteUrl = process.env.SHAREPOINT_ONLINE_SITE_URL;
const clientId = process.env.SHAREPOINT_ONLINE_CLIENT_ID;
const clientSecret = process.env.SHAREPOINT_ONLINE_CLIENT_SECRET;
const tenantId = process.env.SHAREPOINT_ONLINE_TENANT_ID;
const listName = process.env.SHAREPOINT_ONLINE_LIST_NAME || 'ISV Change Requests';

if (!onlineSiteUrl || !clientId || !clientSecret || !tenantId) {
    throw new Error('SharePoint Online configuration missing. Please check environment variables for SHAREPOINT_ONLINE_*');
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const sp = spfi(onlineSiteUrl).using(SPFetchClient(onlineSiteUrl, clientId, clientSecret));

// Example function to test connection to SharePoint Online
async function testConnection() {
    try {
        const web = await sp.web();
        return { success: true, message: 'Connected to SharePoint Online', webTitle: web.Title };
    } catch (error) {
        console.error('SharePoint Online connection error:', error.message);
        return { success: false, message: error.message };
    }
}

// Create change request in SharePoint Online list
async function createChangeRequest(data) {
    try {
        const itemData = {
            Title: data.title,
            RequestID: data.requestId,
            RequestorName: data.requestorName,
            RequestorEmail: data.requestorEmail,
            Department: data.department,
            Summary: data.summary,
            Description: data.description,
            ChangeType: data.changeType,
            Priority: data.priority,
            Status: data.status || 'Pending',
            SubmittedDate: data.submittedDate || new Date().toISOString(),
            TargetDate: data.targetDate,
            Documents: data.documents,
            SpiceWaxRef: data.spiceWaxRef,
            Comments: data.comments,
            RequestedBy: data.requestedBy,
            DateRequested: data.dateRequested,
            Initiator: data.initiator,
            SystemName: data.systemName,
            PolicyFormComplete: data.policyFormComplete ? true : false,
            SOPTrainingComplete: data.sopTrainingComplete ? true : false,
            BriefDescription: data.briefDescription
        };

        const result = await sp.web.lists.getByTitle(listName).items.add(itemData);
        console.log('SharePoint Online: Created change request:', result.data.Id);
        return { success: true, itemId: result.data.Id, requestId: data.requestId };
    } catch (error) {
        console.error('SharePoint Online createChangeRequest error:', error.message);
        throw error;
    }
}

// Update change request in SharePoint Online list by RequestID
async function updateChangeRequest(requestId, data) {
    try {
        const items = await sp.web.lists.getByTitle(listName).items.filter(`RequestID eq '${requestId}'`).get();

        if (items.length === 0) {
            return { success: false, changes: 0, message: 'Request not found' };
        }

        const itemId = items[0].Id;

        const updateData = {};
        if (data.status !== undefined) updateData.Status = data.status;
        if (data.assignedTo !== undefined) updateData.AssignedTo = data.assignedTo ? { results: [data.assignedTo] } : null;
        if (data.comments !== undefined) updateData.Comments = data.comments;
        if (data.reviewer !== undefined) updateData.Reviewer = data.reviewer ? { results: [data.reviewer] } : null;
        if (data.initiator !== undefined) updateData.Initiator = data.initiator;
        if (data.requestedBy !== undefined) updateData.RequestedBy = data.requestedBy;
        if (data.dateRequested !== undefined) updateData.DateRequested = data.dateRequested;
        if (data.systemName !== undefined) updateData.SystemName = data.systemName;
        if (data.policyFormComplete !== undefined) updateData.PolicyFormComplete = data.policyFormComplete ? true : false;
        if (data.sopTrainingComplete !== undefined) updateData.SOPTrainingComplete = data.sopTrainingComplete ? true : false;

        await sp.web.lists.getByTitle(listName).items.getById(itemId).update(updateData);
        console.log('SharePoint Online: Updated change request:', requestId);
        return { success: true, changes: 1 };
    } catch (error) {
        console.error('SharePoint Online updateChangeRequest error:', error.message);
        throw error;
    }
}

// Get all change requests from SharePoint Online
async function getChangeRequests() {
    try {
        const items = await sp.web.lists.getByTitle(listName).items.get();
        return items;
    } catch (error) {
        console.error('SharePoint Online getChangeRequests error:', error.message);
        throw error;
    }
}

// Get change request by ID from SharePoint Online
async function getChangeRequestById(id) {
    try {
        const item = await sp.web.lists.getByTitle(listName).items.getById(id).get();
        return item;
    } catch (error) {
        console.error('SharePoint Online getChangeRequestById error:', error.message);
        throw error;
    }
}

module.exports = {
    testConnection,
    createChangeRequest,
    updateChangeRequest,
    getChangeRequests,
    getChangeRequestById
};
