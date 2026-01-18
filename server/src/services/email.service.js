const logger = require("../utils/logger");

// Email service abstraction layer
// In production, integrate with SendGrid, AWS SES, or similar
// For now, this is a mock implementation that logs emails

const sendEmail = async (to, subject, html, text = null) => {
  try {
    // Mock email sending - in production, replace with actual email service
    logger.info("Email would be sent:", {
      to,
      subject,
      html: html.substring(0, 100) + "...",
    });

    // Example integration with SendGrid (commented out):
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to,
    //   from: process.env.FROM_EMAIL,
    //   subject,
    //   html,
    //   text,
    // });

    return { success: true, message: "Email sent successfully (mock)" };
  } catch (error) {
    logger.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

const sendEventReminder = async (userEmail, userName, eventTitle, eventDate) => {
  const subject = `Reminder: ${eventTitle} is tomorrow`;
  const html = `
    <h2>Event Reminder</h2>
    <p>Hi ${userName},</p>
    <p>This is a reminder that <strong>${eventTitle}</strong> is happening tomorrow at ${new Date(eventDate).toLocaleString()}.</p>
    <p>We hope to see you there!</p>
  `;

  return await sendEmail(userEmail, subject, html);
};

const sendRSVPConfirmation = async (userEmail, userName, eventTitle, eventDate) => {
  const subject = `RSVP Confirmed: ${eventTitle}`;
  const html = `
    <h2>RSVP Confirmed</h2>
    <p>Hi ${userName},</p>
    <p>Your RSVP for <strong>${eventTitle}</strong> on ${new Date(eventDate).toLocaleString()} has been confirmed.</p>
    <p>See you there!</p>
  `;

  return await sendEmail(userEmail, subject, html);
};

const sendEventUpdate = async (userEmail, userName, eventTitle, changes) => {
  const subject = `Event Updated: ${eventTitle}`;
  const html = `
    <h2>Event Updated</h2>
    <p>Hi ${userName},</p>
    <p>The event <strong>${eventTitle}</strong> has been updated:</p>
    <ul>
      ${Object.entries(changes)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join("")}
    </ul>
  `;

  return await sendEmail(userEmail, subject, html);
};

const sendEventCancellation = async (userEmail, userName, eventTitle) => {
  const subject = `Event Cancelled: ${eventTitle}`;
  const html = `
    <h2>Event Cancelled</h2>
    <p>Hi ${userName},</p>
    <p>We're sorry to inform you that <strong>${eventTitle}</strong> has been cancelled.</p>
    <p>We hope to see you at future events!</p>
  `;

  return await sendEmail(userEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendEventReminder,
  sendRSVPConfirmation,
  sendEventUpdate,
  sendEventCancellation,
};
