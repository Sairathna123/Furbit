const Pet = require('../models/Pet');
const Reminder = require('../models/Reminder');
const { sendVaccinationReminderEmail } = require('./emailService');

/**
 * Reminder Service - Background service to check and send vaccination reminders
 * This runs periodically (e.g., daily via cron job)
 */

// Calculate days until due date
const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Determine reminder type based on days until due
const getReminderType = (daysUntil) => {
  if (daysUntil === 7) return '7-days-before';
  if (daysUntil === 3) return '3-days-before';
  if (daysUntil === 0) return 'due-today';
  if (daysUntil < 0) return 'overdue';
  return null;
};

// Create reminder message
const createReminderMessage = (petName, vaccineName, daysUntil, reminderType) => {
  const messages = {
    '7-days-before': `Reminder: ${petName}'s ${vaccineName} vaccination is due in 7 days.`,
    '3-days-before': `Reminder: ${petName}'s ${vaccineName} vaccination is due in 3 days.`,
    'due-today': `Important: ${petName}'s ${vaccineName} vaccination is due today!`,
    'overdue': `Alert: ${petName}'s ${vaccineName} vaccination is overdue by ${Math.abs(daysUntil)} days.`
  };
  return messages[reminderType] || 'Vaccination reminder';
};

// Main function to check and create reminders
const checkAndCreateReminders = async () => {
  try {
    console.log('Running reminder check...');
    
    // Get all active pets
    const pets = await Pet.find({ isActive: true }).populate('owner');
    
    let remindersCreated = 0;
    
    for (const pet of pets) {
      if (!pet.vaccinations || pet.vaccinations.length === 0) continue;
      
      for (const vaccination of pet.vaccinations) {
        const daysUntil = getDaysUntilDue(vaccination.nextDueDate);
        const reminderType = getReminderType(daysUntil);
        
        // Only create reminder for specific days (7, 3, 0, or overdue)
        if (!reminderType) continue;
        
        // Check if reminder already sent for this vaccination and type
        const existingReminder = await Reminder.findOne({
          pet: pet._id,
          'vaccination.vaccineName': vaccination.vaccineName,
          'vaccination.nextDueDate': vaccination.nextDueDate,
          reminderType: reminderType,
          status: { $in: ['sent', 'acknowledged'] }
        });
        
        if (existingReminder) continue; // Already sent
        
        // Create new reminder
        const reminder = new Reminder({
          pet: pet._id,
          owner: pet.owner._id,
          vaccination: {
            vaccineName: vaccination.vaccineName,
            nextDueDate: vaccination.nextDueDate
          },
          reminderType: reminderType,
          message: createReminderMessage(pet.name, vaccination.vaccineName, daysUntil, reminderType),
          status: 'pending'
        });
        
        await reminder.save();
        remindersCreated++;
        
        console.log(`Reminder created for ${pet.name} - ${vaccination.vaccineName}`);
      }
    }
    
    console.log(`Reminder check complete. ${remindersCreated} reminders created.`);
    return { success: true, remindersCreated };
    
  } catch (error) {
    console.error('Error in reminder service:', error);
    return { success: false, error: error.message };
  }
};

// Send pending reminders (now with email integration)
const sendPendingReminders = async () => {
  try {
    const pendingReminders = await Reminder.find({ status: 'pending' })
      .populate('pet')
      .populate('owner');
    
    for (const reminder of pendingReminders) {
      try {
        // Send email notification
        if (reminder.owner && reminder.owner.email) {
          const emailResult = await sendVaccinationReminderEmail(
            reminder.owner.email,
            reminder.owner.name,
            reminder.pet.name,
            reminder.vaccination.vaccineName,
            reminder.vaccination.nextDueDate,
            reminder.reminderType
          );

          if (emailResult.success) {
            reminder.status = 'sent';
            reminder.sentAt = new Date();
            await reminder.save();
            console.log(`✅ Email and reminder sent to ${reminder.owner.email}: ${reminder.message}`);
          } else {
            console.error(`❌ Failed to send email to ${reminder.owner.email}`);
            reminder.status = 'failed';
            await reminder.save();
          }
        }
      } catch (error) {
        console.error(`Error processing reminder for ${reminder.pet.name}:`, error);
        reminder.status = 'failed';
        await reminder.save();
      }
    }
    
    return { success: true, remindersSent: pendingReminders.length };
    
  } catch (error) {
    console.error('Error sending reminders:', error);
    return { success: false, error: error.message };
  }
};

// Run both check and send in sequence
const runReminderService = async () => {
  const checkResult = await checkAndCreateReminders();
  const sendResult = await sendPendingReminders();
  
  return {
    checkResult,
    sendResult,
    totalProcessed: checkResult.remindersCreated + sendResult.remindersSent
  };
};

module.exports = {
  checkAndCreateReminders,
  sendPendingReminders,
  runReminderService
};
