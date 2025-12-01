require('dotenv').config({ path: './prototype/node_server/config.env' });
const sharePointService = require('./services/sharePointService');

console.log('Loaded environment variables:');
console.log('SHAREPOINT_SITE_URL:', process.env.SHAREPOINT_SITE_URL);
console.log('SHAREPOINT_LIST_NAME:', process.env.SHAREPOINT_LIST_NAME);
console.log('SHAREPOINT_USERNAME:', process.env.SHAREPOINT_USERNAME);
console.log('SHAREPOINT_PASSWORD:', process.env.SHAREPOINT_PASSWORD ? '********' : undefined);
console.log('SHAREPOINT_DOMAIN:', process.env.SHAREPOINT_DOMAIN);
console.log('SHAREPOINT_ONLINE_SITE_URL:', process.env.SHAREPOINT_ONLINE_SITE_URL);
console.log('SHAREPOINT_ONLINE_CLIENT_ID:', process.env.SHAREPOINT_ONLINE_CLIENT_ID);
console.log('SHAREPOINT_ONLINE_CLIENT_SECRET:', process.env.SHAREPOINT_ONLINE_CLIENT_SECRET ? '********' : undefined);
console.log('SHAREPOINT_ONLINE_TENANT_ID:', process.env.SHAREPOINT_ONLINE_TENANT_ID);

async function testConnection() {
    console.log('Testing SharePoint connection...');
    try {
        const result = await sharePointService.testConnection();
        console.log('Connection test result:', JSON.stringify(result, null, 2));
        return true;
    } catch (error) {
        console.error('Connection test failed:', error.message);
        console.error('Full error:', error);
        return false;
    }
}

async function testCreateChangeRequest() {
    console.log('\nTesting createChangeRequest...');
    const data = {
        title: 'Test Change Request',
        requestId: 'TEST-001',
        requestorName: 'Test User',
        requestorEmail: 'test@example.com',
        department: 'IT',
        summary: 'Test summary',
        description: 'Test description',
        changeType: 'Enhancement',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: null,
        reviewer: null,
        submittedDate: new Date().toISOString(),
        targetDate: null,
        documents: '',
        spiceWaxRef: '',
        comments: '',
        requestedBy: 'Test User',
        dateRequested: new Date().toISOString(),
        initiator: 'Test User',
        systemName: 'Test System',
        policyFormComplete: false,
        sopTrainingComplete: false,
        briefDescription: 'Brief test'
    };

    try {
        const result = await sharePointService.createChangeRequest(data);
        console.log('Create result:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Create failed:', error.message);
        return null;
    }
}

async function testUpdateChangeRequest(requestId) {
    console.log('\nTesting updateChangeRequest...');
    const updateData = {
        status: 'In Progress',
        comments: 'Updated via test'
    };

    try {
        const result = await sharePointService.updateChangeRequest(requestId, updateData);
        console.log('Update result:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Update failed:', error.message);
        return null;
    }
}

async function testGetChangeRequests() {
    console.log('\nTesting getChangeRequests...');
    try {
        const result = await sharePointService.getChangeRequests();
        console.log('Get all requests result: Found', result.length, 'requests');
        if (result.length > 0) {
            console.log('First request:', JSON.stringify(result[0], null, 2));
        }
        return result;
    } catch (error) {
        console.error('Get requests failed:', error.message);
        return null;
    }
}

async function testGetChangeRequestById(id) {
    console.log('\nTesting getChangeRequestById...');
    try {
        const result = await sharePointService.getChangeRequestById(id);
        console.log('Get by ID result:', JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Get by ID failed:', error.message);
        return null;
    }
}

async function testSharePoint() {
    const connected = await testConnection();
    if (!connected) {
        console.log('Skipping further tests due to connection failure.');
        return;
    }

    // Test create
    const created = await testCreateChangeRequest();
    if (!created) {
        console.log('Skipping update and get tests due to create failure.');
        return;
    }

    // Test update using the created request ID
    const requestId = created.requestId;
    await testUpdateChangeRequest(requestId);

    // Test get all
    await testGetChangeRequests();

    // Test get by ID
    await testGetChangeRequestById(requestId);

    console.log('\nAll tests completed.');
}

testSharePoint();
