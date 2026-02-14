const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const Reminder = require("../models/Reminder");
const QRCode = require('qrcode');
const auth = require('../middleware/authMidddleware');

// Build a public URL reachable by mobile scanners
const buildPublicUrl = (req, passportId) => {
  const clientBase = process.env.PUBLIC_CLIENT_URL || process.env.CLIENT_URL;
  if (clientBase) {
    return `${clientBase.replace(/\/$/, '')}/public/passport/${passportId}`;
  }
  const host = req.get('host') || 'localhost:3000';
  const frontendHost = host.replace(':5000', ':3000');
  const protocol = (req.headers['x-forwarded-proto'] || req.protocol || 'http');
  return `${protocol}://${frontendHost}/public/passport/${passportId}`;
};

// GET all pets for logged-in user (protected route - add auth middleware)
router.get("/", auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id, isActive: true });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET public pet passport by passportId (read-only for QR scanning)
router.get("/passport/:passportId", async (req, res) => {
  try {
    console.log('GET /api/pets/passport/:passportId - Looking up:', req.params.passportId);
    
    const pet = await Pet.findOne({ passportId: req.params.passportId, isActive: true })
      .select('-owner -__v'); // Hide sensitive fields
    
    if (!pet) {
      console.log('Passport not found:', req.params.passportId);
      return res.status(404).json({ error: "Passport not found" });
    }
    
    console.log('Passport found! Name:', pet.name);
    console.log('Allergies:', pet.allergies);
    console.log('Medications:', pet.medications);
    console.log('Conditions:', pet.medicalConditions);
    console.log('Surgeries:', pet.surgeries);
    console.log('Vaccinations:', pet.vaccinations?.length || 0);
    
    // Return complete read-only passport data
    res.json(pet);
  } catch (err) {
    console.error('Error fetching passport:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single pet by ID (owner view) with QR regeneration using current host
router.get("/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });

    const publicUrl = buildPublicUrl(req, pet.passportId);
    if (!pet.publicPassportUrl || pet.publicPassportUrl !== publicUrl) {
      pet.publicPassportUrl = publicUrl;
      pet.qrCode = await QRCode.toDataURL(publicUrl);
      await pet.save();
    }

    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new pet passport
router.post("/", auth, async (req, res) => {
  try {
    const petData = {
      ...req.body,
      owner: req.user.id
    };
    
    const newPet = new Pet(petData);
    const savedPet = await newPet.save();
    
    // Generate QR code: prefer a publicly reachable client URL
    const clientBase = process.env.PUBLIC_CLIENT_URL || process.env.CLIENT_URL;
    let publicUrl;
    if (clientBase) {
      publicUrl = `${clientBase.replace(/\/$/, '')}/public/passport/${savedPet.passportId}`;
    } else {
      const host = req.get('host') || 'localhost:3000';
      // Replace common backend port with frontend port
      const frontendHost = host.replace(':5000', ':3000');
      const protocol = (req.headers['x-forwarded-proto'] || req.protocol || 'http');
      publicUrl = `${protocol}://${frontendHost}/public/passport/${savedPet.passportId}`;
    }
    const qrCodeData = await QRCode.toDataURL(publicUrl);
    
    savedPet.qrCode = qrCodeData;
    savedPet.publicPassportUrl = publicUrl;
    await savedPet.save();
    
    res.json(savedPet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update pet passport
router.put("/:id", auth, async (req, res) => {
  try {
    console.log('PUT /api/pets/:id - Updating pet:', req.params.id);
    console.log('Update data:', req.body);
    
    const updatedPet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, 
      { ...req.body, lastUpdated: Date.now() }, 
      { new: true }
    );
    
    if (!updatedPet) {
      console.log('Pet not found for ID:', req.params.id);
      return res.status(404).json({ error: "Pet not found" });
    }
    
    console.log('Pet updated successfully. PassportId:', updatedPet.passportId);
    console.log('Allergies:', updatedPet.allergies);
    console.log('Medications:', updatedPet.medications);
    console.log('Conditions:', updatedPet.medicalConditions);
    
    res.json(updatedPet);
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST add vaccination record to pet
router.post("/:id/vaccinations", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.vaccinations.push(req.body);
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update vaccination record
router.put("/:id/vaccinations/:vaccinationId", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    const vaccination = pet.vaccinations.id(req.params.vaccinationId);
    if (!vaccination) return res.status(404).json({ error: "Vaccination not found" });
    
    Object.assign(vaccination, req.body);
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE vaccination record
router.delete("/:id/vaccinations/:vaccinationId", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.vaccinations.id(req.params.vaccinationId).deleteOne();
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json({ message: "Vaccination deleted", pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add surgery record
router.post("/:id/surgeries", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.surgeries.push(req.body);
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE surgery record
router.delete("/:id/surgeries/:surgeryId", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.surgeries.id(req.params.surgeryId).deleteOne();
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json({ message: "Surgery deleted", pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add medical condition
router.post("/:id/conditions", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.medicalConditions.push(req.body);
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE medical condition
router.delete("/:id/conditions/:conditionId", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.medicalConditions.id(req.params.conditionId).deleteOne();
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json({ message: "Condition deleted", pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add medication
router.post("/:id/medications", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.medications.push(req.body);
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE medication
router.delete("/:id/medications/:medicationId", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.medications.id(req.params.medicationId).deleteOne();
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json({ message: "Medication deleted", pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update allergies
router.put("/:id/allergies", auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    
    pet.allergies = req.body.allergies || [];
    pet.lastUpdated = Date.now();
    await pet.save();
    
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reminders for a specific pet
router.get("/:id/reminders", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ 
      pet: req.params.id,
      status: { $in: ['pending', 'sent'] }
    }).sort({ 'vaccination.nextDueDate': 1 });
    
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE pet (soft delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.json({ message: "Pet passport deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
