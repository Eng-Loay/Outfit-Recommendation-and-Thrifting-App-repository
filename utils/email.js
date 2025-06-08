// utils/email.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: process.env.EMAIL_FROM,
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${options.email}`);
  } catch (error) {
  console.error('Error sending email:', error);
  if (error.response && error.response.body && error.response.body.errors) {
    console.error('SendGrid Error Details:', error.response.body.errors);
  }
  throw new Error('Email sending failed');
}
};

module.exports = sendEmail;
