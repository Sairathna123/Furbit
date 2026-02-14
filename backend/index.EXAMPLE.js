// backend/index.js - Add this to enable reminder service

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Optional: Reminder Service Endpoint (for testing)
const { runReminderService } = require('./services/reminderService');

app.get('/api/reminders/run', async (req, res) => {
  try {
    const result = await runReminderService();
    res.json({ message: 'Reminder service executed', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: Schedule daily reminder checks (uncomment to enable)
/*
const cron = require('node-cron');

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running daily vaccination reminder check...');
  await runReminderService();
});

// Install first: npm install node-cron
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
