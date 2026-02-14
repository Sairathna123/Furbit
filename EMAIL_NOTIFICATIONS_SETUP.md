# Email & Notification Setup Guide

## 🚀 Quick Start: Enable Email Notifications

### Step 1: Set Up Gmail App Password
Email notifications use Gmail. Follow these steps:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a **16-character password**
6. Copy this password (it will have spaces, remove them)

### Step 2: Update Backend .env
Open `backend/.env` and update:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx
```

Replace:
- `your-gmail@gmail.com` with your actual Gmail address
- `xxxxxxxxxxxxxxxx` with the 16-character app password (no spaces)

### Step 3: Test Email Setup
Send a test email to verify everything works:

```bash
curl -X POST http://localhost:5000/api/reminders/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

Expected response:
```json
{
  "message": "Test email sent",
  "result": {
    "success": true,
    "messageId": "<xxxxx@gmail.com>"
  }
}
```

---

## 📧 How Notifications Work

### Vaccine Reminders
The system checks vaccinations daily and sends emails at:
- **7 days before due date** - Green reminder
- **3 days before due date** - Yellow warning  
- **Today (due date)** - Orange urgent
- **Overdue** - Red alert

### Manual Trigger (for testing)
```bash
# Trigger reminder service immediately
curl http://localhost:5000/api/reminders/run
```

Response will show reminders created and sent.

---

## 🧪 Testing Scenario

### Step-by-Step Test:

1. **Create a pet** and go to its passport

2. **Add a vaccine with TODAY's date as "Next Due Date"**:
   - Vaccine Name: `Rabies Test`
   - Date Given: `2026-01-05`
   - **Next Due Date: `2026-01-12`** (today's date)
   - Click "Save Vaccination"

3. **Trigger reminder service**:
   ```bash
   curl http://localhost:5000/api/reminders/run
   ```

4. **Check your email** - You should receive:
   - **Subject**: "📌 Vaccination Due Today - [PetName]'s Rabies Test"
   - **From**: your configured Gmail address
   - **Content**: Formatted reminder with pet name, vaccine, and date

5. **On the website** - You'll also see:
   - **Reminders Alert** banner showing active reminders
   - Vaccination card with **orange "Due Today"** badge
   - Browser notification (if you clicked Allow)

---

## 🎯 Different Reminder Types

### Test All Reminder Types:

**For 7-day reminder:**
- Next Due Date: 7 days from now (2026-01-19)
- Trigger: `curl http://localhost:5000/api/reminders/run`
- Email: Green reminder

**For 3-day reminder:**
- Next Due Date: 3 days from now (2026-01-15)
- Email: Yellow warning

**For overdue:**
- Next Due Date: Any past date (2026-01-05)
- Email: Red alert
- Website: Shows in Reminders Alert banner

---

## 📱 Website Notifications (Already Working)

The website shows:

1. **Reminders Alert Banner** - At top of pet passport page
2. **Vaccination Status Badge** - Shows "Overdue", "Due Today", etc.
3. **Browser Notification** - Pop-up when vaccination is due/overdue (if you allowed notifications)

---

## 🔧 Troubleshooting

### No Email Received?

1. **Check console logs** in terminal where backend runs:
   ```
   ✅ Email sent to user@example.com
   ```
   or
   ```
   ❌ Error sending email: ...
   ```

2. **Verify Gmail credentials**:
   - Wrong email? Update `.env` EMAIL_USER
   - Wrong app password? Generate new one at Google Account
   - Make sure 2-Factor Authentication is enabled

3. **Check email spam folder** - Gmail sometimes puts test emails there

4. **Gmail security warning**:
   - If using Gmail for first time from this device, Google may block it
   - Go to [Allow Less Secure Apps](https://myaccount.google.com/u/0/security) or check your Gmail notifications for permission requests

### Database Issue?

Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh
# Should connect successfully
```

### Reminder not showing?

1. The reminder service only runs when you:
   - Click the reminder API link, OR
   - Call it manually with curl, OR
   - Set up a cron job (see below)

2. Reminders are checked against existing reminders - won't duplicate same day

---

## ⏰ Automatic Reminders (Cron Job)

To automatically check and send reminders daily:

### Option 1: Using node-cron (Recommended)

Install:
```bash
cd backend
npm install node-cron
```

Add to `backend/index.js`:
```javascript
const cron = require('node-cron');
const { runReminderService } = require('./services/reminderService');

// Run reminder service daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running scheduled reminder check...');
  await runReminderService();
});
```

### Option 2: External Scheduler
Use service like:
- **AWS Lambda**
- **Heroku Scheduler** (when deployed)
- **easycron.com** (free)
- **webhook.site** with scheduled requests

---

## 📧 Email Template Examples

Users will receive emails like:

**OVERDUE Email:**
```
Subject: ⚠️ Overdue Vaccination Alert - Buddy's Rabies

This is an urgent reminder that Buddy's Rabies vaccination is OVERDUE.
Due Date: January 5, 2026
Please schedule a veterinary appointment as soon as possible.
```

**DUE TODAY Email:**
```
Subject: 📌 Vaccination Due Today - Buddy's Rabies

Buddy's Rabies vaccination is DUE TODAY!
Due Date: January 12, 2026
Please contact your veterinarian.
```

**UPCOMING Email:**
```
Subject: 🔔 Vaccination Due in 3 Days - Buddy's DHPP

Buddy's DHPP vaccination is due in 3 days.
Due Date: January 15, 2026
Please schedule an appointment soon.
```

---

## ✅ Summary

✅ **Website Notifications** - Active (pop-ups, badges, alert banner)
✅ **Email Notifications** - Set up with 4 easy steps above  
✅ **Testing** - Manual API trigger available
✅ **Automation** - Cron job ready (optional)

Happy pet care! 🐾
