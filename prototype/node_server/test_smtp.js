
require('dotenv').config({ path: './config.env' });
const { sendEmailNotification } = require('./services/notificationService');

async function testEmail() {
  console.log('Attempting to send a test email...');
  try {
    await sendEmailNotification({
      to: 'thabiso@synthesis.co.za',
      subject: 'Test Email from Change Control Portal',
      body: 'This is a test email to verify SMTP configuration.'
    });
    console.log('Test email sent successfully (check your inbox).');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail();
