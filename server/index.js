const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // ✅ Make sure this path is correct

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/furbit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Route setup - DO NOT use parentheses here!
app.use('/api/auth', authRoutes);

// ✅ Server start
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
