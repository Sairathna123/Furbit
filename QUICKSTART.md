# 🚀 Quick Start Checklist

Follow these steps to get Furbit running on your machine:

## ✅ Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected packages**: express, mongoose, cors, bcrypt, jsonwebtoken, dotenv, qrcode

---

## ✅ Step 2: Configure Backend Environment

1. Create `backend/.env` file
2. Copy from `backend/.env.example`
3. Fill in your MongoDB URI and JWT secret

**Minimum required**:
```
MONGO_URI=mongodb://127.0.0.1:27017/furbit
JWT_SECRET=change_this_to_a_random_string
CLIENT_URL=http://localhost:3000
PORT=5000
```

---

## ✅ Step 3: Install Frontend Dependencies

```bash
cd ..
npm install
```

**Expected packages**: react, react-router-dom, axios

---

## ✅ Step 4: Configure Frontend Environment

1. Create `.env` file in root directory
2. Copy from `.env.example`
3. Add:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## ✅ Step 5: Start MongoDB

Make sure MongoDB is running:

**Local MongoDB**:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud) - just use the connection string in `.env`

---

## ✅ Step 6: Start Backend Server

```bash
cd backend
npm run dev
# or
npm start
```

✅ **Expected output**: 
```
🚀 Server running on port 5000
✅ MongoDB connected
```

---

## ✅ Step 7: Start Frontend (New Terminal)

```bash
# From project root
npm start
```

✅ **Expected output**: Opens browser at `http://localhost:3000`

---

## 🎯 Test the Application

### 1. Create Account
- Navigate to `/signup`
- Create a new user account
- Login with credentials

### 2. Create Pet Passport
- Click "Create New Passport"
- Fill in pet details (name and species are required)
- Submit form
- You'll be redirected to the passport view

### 3. Add Vaccination
- On passport page, click "+ Add Vaccination"
- Enter vaccine name, date given, next due date
- Save
- See the vaccination appear with status indicator

### 4. View QR Code
- Scroll to "Share Passport via QR Code" section
- QR code should be displayed
- Copy the public URL

### 5. Test Public View
- Open public URL in new browser/incognito window
- Should see read-only passport view
- No edit capabilities should be available

### 6. Test Reminders (Optional)
- Visit `http://localhost:5000/api/reminders/run`
- This manually triggers the reminder service
- Check console logs for reminder creation

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists in `backend/`
- Run `npm install` in backend folder

### Frontend won't start
- Verify `.env` file exists in project root
- Run `npm install` in project root
- Clear cache: `npm start --reset-cache`

### QR Code not generating
- Check `qrcode` package is installed
- Verify `CLIENT_URL` in backend `.env`
- Check browser console for errors

### Routes not working
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check browser Network tab for failed requests

---

## 📝 Optional Enhancements

### Set Up Automatic Daily Reminders

1. Install node-cron:
```bash
cd backend
npm install node-cron
```

2. Uncomment the cron section in `backend/index.js`:
```javascript
const cron = require('node-cron');

cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running daily vaccination reminder check...');
  await runReminderService();
});
```

3. Restart backend server

---

## 🎉 You're Done!

Your Furbit Digital Pet Passport system is now running!

**Key URLs**:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API Docs: See `README.md`

**Next Steps**:
- Add email service for reminders (SendGrid, Nodemailer)
- Add photo upload (Cloudinary, AWS S3)
- Deploy to production (Vercel + Render/Railway)

---

_Need help? Check REFRAMING_SUMMARY.md for detailed documentation_
