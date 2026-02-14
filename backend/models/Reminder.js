const mongoose = require("mongoose");

// Reminder Model - tracks vaccination reminder notifications
const reminderSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vaccination: {
    vaccineName: String,
    nextDueDate: Date
  },
  reminderType: { 
    type: String, 
    enum: ['7-days-before', '3-days-before', 'due-today', 'overdue'],
    required: true 
  },
  sentAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'acknowledged', 'expired'],
    default: 'pending'
  },
  deliveryMethod: {
    type: String,
    enum: ['email', 'in-app', 'whatsapp'],
    default: 'in-app'
  },
  message: String
}, { timestamps: true });

// Index for efficient reminder queries
reminderSchema.index({ pet: 1, status: 1 });
reminderSchema.index({ owner: 1, status: 1 });
reminderSchema.index({ 'vaccination.nextDueDate': 1 });

module.exports = mongoose.model("Reminder", reminderSchema);
