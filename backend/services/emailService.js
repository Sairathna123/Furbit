const axios = require('axios');

const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send';
const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;

/**
 * Send email via Mailtrap API
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!MAILTRAP_API_TOKEN) {
      throw new Error('MAILTRAP_API_TOKEN not configured in .env');
    }

    const response = await axios.post(
      MAILTRAP_API_URL,
      {
        from: {
          email: process.env.EMAIL_FROM || 'hello@furbit.co',
          name: 'Furbit Pet Passport'
        },
        to: [
          {
            email: to
          }
        ],
        subject: subject,
        html: htmlContent,
        category: 'Furbit Notification'
      },
      {
        headers: {
          'Authorization': `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Email sent to ${to}:`, response.data.success);
    return { success: true, messageId: response.data.id };

  } catch (error) {
    console.error('❌ Error sending email:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send vaccination reminder email
 */
const sendVaccinationReminderEmail = async (userEmail, userName, petName, vaccineName, dueDate, reminderType) => {
  try {
    // Create subject based on reminder type
    let subject = '';
    let htmlContent = '';

    if (reminderType === 'overdue') {
      subject = `⚠️ Overdue Vaccination Alert - ${petName}'s ${vaccineName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Vaccination Overdue!</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
            <p>Hi ${userName},</p>
            <p>This is an urgent reminder that <strong>${petName}'s ${vaccineName}</strong> vaccination is <strong>overdue</strong>.</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p style="color: #dc3545; font-weight: bold;">Please schedule a veterinary appointment as soon as possible to keep your pet protected.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated reminder from Furbit Digital Pet Passport System.</p>
          </div>
        </div>
      `;
    } else if (reminderType === 'due-today') {
      subject = `📌 Vaccination Due Today - ${petName}'s ${vaccineName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff9800; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Vaccination Due Today!</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
            <p>Hi ${userName},</p>
            <p><strong>${petName}'s ${vaccineName}</strong> vaccination is <strong>due today</strong>!</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p>Please contact your veterinarian to schedule the vaccination appointment.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated reminder from Furbit Digital Pet Passport System.</p>
          </div>
        </div>
      `;
    } else if (reminderType === '3-days-before') {
      subject = `🔔 Vaccination Due in 3 Days - ${petName}'s ${vaccineName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ffc107; color: #333; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Reminder: Vaccination Due in 3 Days</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
            <p>Hi ${userName},</p>
            <p>This is a friendly reminder that <strong>${petName}'s ${vaccineName}</strong> vaccination is due in <strong>3 days</strong>.</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p>Please schedule an appointment with your veterinarian soon to ensure your pet stays healthy.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated reminder from Furbit Digital Pet Passport System.</p>
          </div>
        </div>
      `;
    } else if (reminderType === '7-days-before') {
      subject = `📅 Vaccination Reminder - ${petName}'s ${vaccineName} Due in 7 Days`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4caf50; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Vaccination Reminder</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
            <p>Hi ${userName},</p>
            <p>This is a reminder that <strong>${petName}'s ${vaccineName}</strong> vaccination is due in <strong>7 days</strong>.</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p>Plan ahead and schedule an appointment with your veterinarian.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated reminder from Furbit Digital Pet Passport System.</p>
          </div>
        </div>
      `;
    }

    return await sendEmail(userEmail, subject, htmlContent);

  } catch (error) {
    console.error('Error in sendVaccinationReminderEmail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test email function
 */
const sendTestEmail = async (email) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4a1a72; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0;">Test Email - Furbit 🐾</h2>
        </div>
        <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
          <p>Hi there,</p>
          <p>This is a test email from <strong>Furbit Digital Pet Passport System</strong>.</p>
          <p>If you received this, email notifications are working correctly! ✅</p>
          <p>You can now start receiving vaccination reminders for your pets.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Furbit - Digital Pet Passport System</p>
        </div>
      </div>
    `;

    return await sendEmail(email, 'Test Email from Furbit 🐾', htmlContent);

  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVaccinationReminderEmail,
  sendTestEmail
};
