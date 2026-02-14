# Furbit - Digital Pet Passport System

**Furbit** is a digital pet passport that securely stores pet identity and medical history, proactively reminds owners about upcoming vaccinations, and allows instant read-only access via QR code anywhere.

##  Core Features

- **Digital Pet Passport**: Store all pet information in one secure, digital place
- **Vaccination Tracking**: Never miss a vaccine with automated reminders
- **Smart Reminders**: Get notified 7 days before, 3 days before, due date, and when overdue
- **QR Code Sharing**: Share read-only passport instantly with vets and pet services
- **Medical History**: Track vaccinations, medications, and vet visits

## System Workflows

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

## Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT, QRCode  
**Frontend**: React, React Router, Axios, CSS3  
**Colors**: Purple (#3e0061) and Yellow (#ffb400)


