const mongoose = require("mongoose");

// Vaccination record schema - core of the reminder system
const vaccinationSchema = new mongoose.Schema({
  vaccineName: { type: String, required: true },
  dateGiven: { type: Date, required: true },
  nextDueDate: { type: Date, required: true },
  notes: String,
  reminderSent: { type: Boolean, default: false },
  lastReminderDate: Date
}, { timestamps: true });

// Medical record schema - other health records
const medicalRecordSchema = new mongoose.Schema({
  recordType: { type: String, enum: ['medication', 'surgery', 'checkup', 'other'], default: 'other' },
  title: String,
  date: Date,
  notes: String,
  vetName: String
}, { timestamps: true });

// Vet information schema
const vetSchema = new mongoose.Schema({
  name: String,
  clinic: String,
  phone: String,
  email: String,
  address: String
});

// Main Pet Schema - Digital Passport
const petSchema = new mongoose.Schema({
  // Owner reference
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Pet Identity (Passport Core)
  passportId: { type: String, unique: true, required: true }, // Unique QR-scannable ID
  name: { type: String, required: true },
  species: { type: String, required: true }, // Dog, Cat, etc.
  breed: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'unknown'] },
  color: String,
  microchipId: String,
  photo: String, // URL to pet photo
  
  // Medical Records
  vaccinations: [vaccinationSchema],
  medicalRecords: [medicalRecordSchema],
  allergies: [String],
  surgeries: [{
    name: String,
    date: Date,
    description: String,
    vetName: String
  }],
  medicalConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' },
    notes: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedFor: String,
    startDate: Date,
    endDate: Date,
    vetName: String
  }],
  
  // Vet Information
  primaryVet: vetSchema,
  
  // Passport Metadata
  qrCode: String, // Generated QR code data URL
  publicPassportUrl: String, // Public read-only link
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
  
}, { timestamps: true });

// Generate unique passport ID before saving
// Ensure passportId exists before validation runs (so required passes)
petSchema.pre('validate', function(next) {
  if (!this.passportId) {
    this.passportId = 'FUR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

petSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Pet", petSchema);
