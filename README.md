# Furbit - Digital Pet Passport System

**Furbit** is a digital pet passport that securely stores pet identity and medical history, proactively reminds owners about upcoming vaccinations, and allows instant read-only access via QR code anywhere.

## 🎯 Core Features

- **Digital Pet Passport**: Store all pet information in one secure, digital place
- **Vaccination Tracking**: Never miss a vaccine with automated reminders
- **Smart Reminders**: Get notified 7 days before, 3 days before, due date, and when overdue
- **QR Code Sharing**: Share read-only passport instantly with vets and pet services
- **Medical History**: Track vaccinations, medications, and vet visits

## 🔁 System Workflows

### 1. Owner Workflow
1. Register/Login
2. Create digital pet passport
3. Add pet details (name, species, breed, photo, vet info)
4. Add vaccination records with due dates
5. View and manage passport
6. Share via QR code

### 2. Reminder System (Automated)
- System scans vaccination records daily
- Checks next due dates
- Sends reminders at: 7 days before, 3 days before, due today, overdue
- Owner updates vaccination after vet visit
- System recalculates next due date

### 3. Public Access Workflow
- Vet/Pet Service scans QR code
- Opens read-only public passport
- Views pet identity and vaccination status
- Cannot edit any information

## 🛠 Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT, QRCode  
**Frontend**: React, React Router, Axios, CSS3  
**Colors**: Purple (#3e0061) and Yellow (#ffb400)

## 🚀 Setup Instructions

### Backend
```bash
cd backend
npm install
# Create .env: MONGO_URI, JWT_SECRET, CLIENT_URL
npm run dev
```

### Frontend
```bash
npm install
# Create .env: REACT_APP_API_URL=http://localhost:5000
npm start
```

## 📝 Key API Endpoints

- `GET /api/pets` - Get all user's pets
- `GET /api/pets/passport/:passportId` - Public read-only passport
- `POST /api/pets` - Create passport (auto-generates QR)
- `POST /api/pets/:id/vaccinations` - Add vaccination
- `GET /api/pets/:id/reminders` - Get active reminders

## 🔔 Reminder System

Run reminder service manually:
```javascript
const { runReminderService } = require('./services/reminderService');
await runReminderService();
```

Recommended: Set up daily cron job

## 📄 License

MIT License

---

**Built with ❤️ for pet owners worldwide**

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
