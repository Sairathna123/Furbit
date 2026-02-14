# 🔔 Notification System - What's Included

## Website Notifications ✅ Already Working

These work automatically on the website:

1. **Reminders Alert Banner** - Shows at the top of pet passport
2. **Vaccination Status Badges** - Shows "Overdue", "Due Today", "Due Soon" 
3. **Browser Pop-up** - Native browser notification when you access the passport with due/overdue vaccines
4. **Color coding** - Red for overdue, Orange for today, Yellow for soon, Green for upcoming

## Email Notifications 📧 Ready to Setup (3 Steps)

### Step 1: Enable Gmail
- Go to Google Account → Security → App Passwords
- Generate 16-character password

### Step 2: Update .env
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=16-char-password
```

### Step 3: Test
```bash
curl -X POST http://localhost:5000/api/reminders/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Testing Reminders

Add a vaccine with TODAY as "Next Due Date":
- Vaccine Name: Rabies
- Date Given: 2026-01-05
- **Next Due Date: 2026-01-12** (today)

Then trigger reminders:
```bash
curl http://localhost:5000/api/reminders/run
```

You'll get:
1. ✅ Email notification (if setup)
2. ✅ Website notification
3. ✅ Reminders alert banner
4. ✅ Orange "Due Today" badge

## Email Templates

Users receive formatted emails like:

**OVERDUE:**
- Red header
- Urgent message
- Call to action: "Schedule ASAP"

**DUE TODAY:**
- Orange header  
- Important message
- Call to action: "Contact vet"

**3 DAYS BEFORE:**
- Yellow header
- Friendly reminder
- Call to action: "Schedule soon"

**7 DAYS BEFORE:**
- Green header
- Planning reminder
- Call to action: "Book appointment"

---

## 📄 Full Setup Guide

See `EMAIL_NOTIFICATIONS_SETUP.md` for:
- Detailed Gmail setup
- Multiple testing scenarios
- Automated scheduling options
- Troubleshooting guide
