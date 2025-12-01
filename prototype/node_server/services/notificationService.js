const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // Use true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendEmailNotification({ to, subject, body }) {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: to,
            subject: subject,
            text: body
        };

        await transport.sendMail(mailOptions);
        console.log('Email notification sent successfully.');
    } catch (error) {
        console.error('Error sending email notification:', error);
        throw error;
    }
}

module.exports = {
    sendEmailNotification
};