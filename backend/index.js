const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/furbit')
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Optional: Manual reminder trigger endpoint (for testing)
const { runReminderService } = require('./services/reminderService');
const { sendTestEmail } = require('./services/emailService');

app.get('/api/reminders/run', async (req, res) => {
  try {
    const result = await runReminderService();
    res.json({ message: 'Reminder service executed', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test email endpoint
app.post('/api/reminders/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    const result = await sendTestEmail(email);
    res.json({ message: 'Test email sent', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

