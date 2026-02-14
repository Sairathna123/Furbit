import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicPassport.css";

const PublicPassport = () => {
  const { passportId } = useParams();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPassport = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/passport/${passportId}`);
        console.log('Passport data received:', res.data);
        setPassport(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching passport:', err);
        setError("Passport not found");
        setLoading(false);
      }
    };
    
    if (passportId) {
      fetchPublicPassport();
    }
  }, [passportId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getVaccinationStatus = (nextDueDate) => {
    const today = new Date();
    const due = new Date(nextDueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', text: 'Overdue' };
    if (diffDays === 0) return { status: 'due-today', text: 'Due Today' };
    if (diffDays <= 7) return { status: 'soon', text: 'Due Soon' };
    return { status: 'current', text: 'Current' };
  };

  if (loading) {
    return (
      <div className="public-passport loading-state">
        <div className="loader"></div>
        <p>Loading passport...</p>
      </div>
    );
  }

  if (error || !passport) {
    return (
      <div className="public-passport error-state">
        <h2>Passport Not Found</h2>
        <p>This pet passport could not be found or has been deactivated.</p>
      </div>
    );
  }

  return (
    <div className="public-passport">
      <div className="passport-content">
        <div className="passport-badge">
          <span>Furbit Digital Pet Passport</span>
          <span className="read-only-badge">Read-Only</span>
        </div>

      {/* Pet Identity Card */}
      <div className="identity-card">
        <div className="pet-photo-section">
          {passport.photo ? (
            <img src={passport.photo} alt={passport.name} className="pet-photo" />
          ) : (
            <div className="photo-placeholder">No Photo</div>
          )}
        </div>
        
        <div className="pet-info-section">
          <h1 className="pet-name">{passport.name}</h1>
          <p className="pet-species">{passport.species}{passport.breed && ` • ${passport.breed}`}</p>
          <div className="passport-meta">
            <span className="passport-id-display">ID: {passport.passportId}</span>
            <span className="last-updated">Updated: {formatDate(passport.lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Vaccination Records */}
      <div className="vaccinations-display">
        <h2>Vaccination Records</h2>
        
        {passport.vaccinations && passport.vaccinations.length > 0 ? (
          <div className="vaccination-list">
            {passport.vaccinations
              .sort((a, b) => new Date(b.dateGiven) - new Date(a.dateGiven))
              .map((vaccine, idx) => {
                const status = getVaccinationStatus(vaccine.nextDueDate);
                
                return (
                  <div key={idx} className={`vaccination-item ${status.status}`}>
                    <div className="vaccine-main">
                      <h3>{vaccine.vaccineName}</h3>
                      <span className={`status-indicator ${status.status}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="vaccine-dates">
                      <p>
                        <strong>Last Given:</strong> {formatDate(vaccine.dateGiven)}
                      </p>
                      <p>
                        <strong>Next Due:</strong> {formatDate(vaccine.nextDueDate)}
                      </p>
                    </div>
                    {vaccine.notes && (
                      <p className="vaccine-notes">{vaccine.notes}</p>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="no-data">No vaccination records available</p>
        )}
      </div>

      {/* Basic Info Section */}
      <div className="public-medical-section">
        <h2>Basic Information</h2>
        <div className="public-info-grid">
          {passport.gender && <p><strong>Gender:</strong> {passport.gender.charAt(0).toUpperCase() + passport.gender.slice(1)}</p>}
          {passport.color && <p><strong>Color:</strong> {passport.color}</p>}
          {passport.weight && <p><strong>Weight:</strong> {passport.weight}</p>}
          {passport.dateOfBirth && <p><strong>Date of Birth:</strong> {formatDate(passport.dateOfBirth)}</p>}
          {passport.microchipId && <p><strong>Microchip ID:</strong> {passport.microchipId}</p>}
        </div>
      </div>

      {/* Allergies */}
      <div className="public-medical-section">
        <h2>Allergies</h2>
        {passport.allergies && passport.allergies.length > 0 ? (
          <div className="allergy-list-public">
            {passport.allergies.map((allergy, idx) => (
              <span key={idx} className="allergy-badge-public">{allergy}</span>
            ))}
          </div>
        ) : (
          <p className="no-data">No allergies recorded</p>
        )}
      </div>

      {/* Medical Conditions */}
      <div className="public-medical-section">
        <h2>Medical Conditions</h2>
        {passport.medicalConditions && passport.medicalConditions.length > 0 ? (
          <div>
            {passport.medicalConditions.map((cond, idx) => (
              <div key={idx} className="public-condition-item">
                <h4>{cond.condition}</h4>
                <p><strong>Status:</strong> {cond.status}</p>
                {cond.diagnosedDate && <p><strong>Diagnosed:</strong> {formatDate(cond.diagnosedDate)}</p>}
                {cond.notes && <p><strong>Notes:</strong> {cond.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No medical conditions recorded</p>
        )}
      </div>

      {/* Surgeries */}
      <div className="public-medical-section">
        <h2>Surgical History</h2>
        {passport.surgeries && passport.surgeries.length > 0 ? (
          <div>
            {passport.surgeries.map((surgery, idx) => (
              <div key={idx} className="public-surgery-item">
                <h4>{surgery.name}</h4>
                {surgery.date && <p><strong>Date:</strong> {formatDate(surgery.date)}</p>}
                {surgery.vetName && <p><strong>Veterinarian:</strong> {surgery.vetName}</p>}
                {surgery.description && <p><strong>Description:</strong> {surgery.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No surgical history recorded</p>
        )}
      </div>

      {/* Medications */}
      <div className="public-medical-section">
        <h2>Current Medications</h2>
        {passport.medications && passport.medications.length > 0 ? (
          <div>
            {passport.medications.map((med, idx) => (
              <div key={idx} className="public-condition-item">
                <h4>{med.name}</h4>
                {med.dosage && <p><strong>Dosage:</strong> {med.dosage}</p>}
                {med.frequency && <p><strong>Frequency:</strong> {med.frequency}</p>}
                {med.prescribedFor && <p><strong>Prescribed For:</strong> {med.prescribedFor}</p>}
                {med.vetName && <p><strong>Prescribed By:</strong> {med.vetName}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No current medications</p>
        )}
      </div>

      {/* Veterinarian Info */}
      {passport.primaryVet && (
        <div className="public-medical-section">
          <h2>Primary Veterinarian</h2>
          <div className="public-info-grid">
            {passport.primaryVet.name && <p><strong>Name:</strong> {passport.primaryVet.name}</p>}
            {passport.primaryVet.clinic && <p><strong>Clinic:</strong> {passport.primaryVet.clinic}</p>}
            {passport.primaryVet.phone && <p><strong>Phone:</strong> {passport.primaryVet.phone}</p>}
            {passport.primaryVet.email && <p><strong>Email:</strong> {passport.primaryVet.email}</p>}
          </div>
        </div>
      )}

      {/* Trust Notice */}
      <div className="trust-notice">
        <p>
          This is a verified digital pet passport from Furbit.
        </p>
        <p className="disclaimer">
          This passport is read-only. Only the pet owner can update vaccination records.
          Last updated: {formatDate(passport.lastUpdated)}
        </p>
      </div>

      {/* Furbit Branding Footer */}
      <div className="furbit-footer">
        <p>Powered by <strong>Furbit</strong> - Digital Pet Passport System</p>
      </div>
      </div>
    </div>
  );
};

export default PublicPassport;
