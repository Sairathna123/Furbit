import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PetPassport.css";
import NotificationModal from "../components/NotificationModal";

const PetPassport = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDueModal, setShowDueModal] = useState(false);
  const [dueMessages, setDueMessages] = useState([]);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddSurgery, setShowAddSurgery] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  
  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: "",
    dateGiven: "",
    nextDueDate: "",
    notes: ""
  });
  
  const [allergyForm, setAllergyForm] = useState("");
  
  const [conditionForm, setConditionForm] = useState({
    condition: "",
    status: "ongoing",
    diagnosedDate: "",
    notes: ""
  });
  
  const [surgeryForm, setSurgeryForm] = useState({
    name: "",
    date: "",
    vetName: "",
    description: ""
  });
  
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    prescribedFor: "",
    vetName: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetPassport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPet(res.data);
        setLoading(false);

        // Check for vaccinations due today or overdue and show notification
        const today = new Date();
        const overduOrDueToday = res.data.vaccinations?.filter(v => {
          const dueDate = new Date(v.nextDueDate);
          const diffTime = dueDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 0;
        }) || [];

        if (overduOrDueToday.length > 0) {
          // Respect snooze for today
          const todayStr = new Date().toISOString().slice(0, 10);
          const snoozedOn = localStorage.getItem('furbit_snooze_date');
          if (snoozedOn === todayStr) return;

          const messages = overduOrDueToday.map(v => {
            const dueDate = new Date(v.nextDueDate);
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) {
              return `${v.vaccineName} is due today`;
            }
            return `${v.vaccineName} is overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
          });
          setDueMessages(messages);
          setShowDueModal(true);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}/reminders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReminders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    
    if (id) {
      fetchPetPassport();
      fetchReminders();
      
      // Request notification permission if not already granted
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [id]);

  const handleVaccineChange = (e) => {
    setVaccineForm({ ...vaccineForm, [e.target.name]: e.target.value });
  };

  const handleAddVaccine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}/vaccinations`,
        vaccineForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowAddVaccine(false);
      setVaccineForm({ vaccineName: "", dateGiven: "", nextDueDate: "", notes: "" });
      
      // Refresh pet data
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      
      alert("Vaccination added successfully!");
    } catch (err) {
      alert("Failed to add vaccination");
      console.error(err);
    }
  };

  const handleAddAllergy = async (e) => {
    e.preventDefault();
    if (!allergyForm.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      const updatedAllergies = [...(pet.allergies || []), allergyForm.trim()];
      console.log('Adding allergy. Current:', pet.allergies, 'Updated:', updatedAllergies);
      console.log('Sending to:', `${process.env.REACT_APP_API_URL}/api/pets/${id}`);
      console.log('PassportId:', pet.passportId);
      
      const updateRes = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}`,
        { allergies: updatedAllergies },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Update response:', updateRes.data);
      console.log('Allergies after update:', updateRes.data.allergies);
      
      setShowAddAllergy(false);
      setAllergyForm("");
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      console.log('Pet refetched. Allergies:', res.data.allergies);
      
      alert("Allergy added successfully!");
    } catch (err) {
      alert("Failed to add allergy");
      console.error('Error adding allergy:', err);
    }
  };

  const handleDeleteAllergy = async (allergyToDelete) => {
    if (!window.confirm("Delete this allergy?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const updatedAllergies = pet.allergies.filter(a => a !== allergyToDelete);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}`,
        { allergies: updatedAllergies },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      alert("Allergy deleted!");
    } catch (err) {
      alert("Failed to delete allergy");
    }
  };

  const handleAddCondition = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}/conditions`,
        conditionForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowAddCondition(false);
      setConditionForm({ condition: "", status: "ongoing", diagnosedDate: "", notes: "" });
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      
      alert("Medical condition added successfully!");
    } catch (err) {
      alert("Failed to add condition");
      console.error(err);
    }
  };

  const handleAddSurgery = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}/surgeries`,
        surgeryForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowAddSurgery(false);
      setSurgeryForm({ name: "", date: "", vetName: "", description: "" });
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      
      alert("Surgery added successfully!");
    } catch (err) {
      alert("Failed to add surgery");
      console.error(err);
    }
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pets/${id}/medications`,
        medicationForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowAddMedication(false);
      setMedicationForm({ name: "", dosage: "", frequency: "", prescribedFor: "", vetName: "" });
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPet(res.data);
      
      alert("Medication added successfully!");
    } catch (err) {
      alert("Failed to add medication");
      console.error(err);
    }
  };

  const getUpcomingVaccines = () => {
    if (!pet || !pet.vaccinations) return [];
    
    // Show all vaccinations, sorted by next due date (soonest first)
    return pet.vaccinations
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : ''}`;
    } else {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  const regenerateQRWithCurrentOrigin = () => {
    if (pet && pet.passportId) {
      const publicUrl = `${window.location.origin}/public/passport/${pet.passportId}`;
      return publicUrl;
    }
    return null;
  };

  if (loading) return <div className="loading">Loading passport...</div>;
  if (!pet) return <div className="error">Passport not found</div>;

  const upcomingVaccines = getUpcomingVaccines();

  return (
    <div className="pet-passport">
      {showDueModal && (
        <NotificationModal
          title={`Vaccination Reminder for ${pet?.name}`}
          messages={dueMessages}
          onClose={() => setShowDueModal(false)}
          onSnooze={() => {
            const todayStr = new Date().toISOString().slice(0, 10);
            localStorage.setItem('furbit_snooze_date', todayStr);
            setShowDueModal(false);
          }}
        />
      )}
      {/* Header with Pet Info */}
      <div className="passport-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="edit-btn" onClick={() => navigate(`/edit-passport/${id}`)}>
            Edit Passport
          </button>
        </div>
        
        <div className="passport-identity">
          <div className="pet-photo-large">
            {pet.photo ? (
              <img src={pet.photo} alt={pet.name} />
            ) : (
              <div className="photo-placeholder-large">No Photo</div>
            )}
          </div>
          
          <div className="pet-basic-info">
            <h1>{pet.name}</h1>
            <p className="species">{pet.species} • {pet.breed}</p>
            {pet.dateOfBirth && (
              <div className="age-badge">
                {calculateAge(pet.dateOfBirth)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pet Details Cards */}
      <div className="details-grid">
        <div className="info-card">
          <h3>Identification</h3>
          <div className="info-item">
            <span className="label">Passport ID</span>
            <span className="value">{pet.passportId}</span>
          </div>
          {pet.microchipId && (
            <div className="info-item">
              <span className="label">Microchip</span>
              <span className="value">{pet.microchipId}</span>
            </div>
          )}
          {pet.dateOfBirth && (
            <div className="info-item">
              <span className="label">Date of Birth</span>
              <span className="value">{formatDate(pet.dateOfBirth)}</span>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>Physical Details</h3>
          {pet.gender && (
            <div className="info-item">
              <span className="label">Gender</span>
              <span className="value">{pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</span>
            </div>
          )}
          {pet.color && (
            <div className="info-item">
              <span className="label">Color</span>
              <span className="value">{pet.color}</span>
            </div>
          )}
          {pet.weight && (
            <div className="info-item">
              <span className="label">Weight</span>
              <span className="value">{pet.weight}</span>
            </div>
          )}
          {!pet.gender && !pet.color && !pet.weight && (
            <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>No physical details recorded</p>
          )}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="qr-section">
        <h3>Share Passport via QR Code</h3>
        {pet.passportId ? (
          <div className="qr-display">
            {pet.qrCode && <img src={pet.qrCode} alt="QR Code" />}
            <p>Scan to view read-only passport</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Accessible at: <br />
              <code style={{ backgroundColor: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', display: 'block', marginTop: '0.5rem' }}>
                {regenerateQRWithCurrentOrigin()}
              </code>
            </p>
          </div>
        ) : (
          <p>QR code will be generated automatically</p>
        )}
      </div>

      {/* Reminders Alert */}
      {reminders.length > 0 && (
        <div className="reminders-alert">
          <h3>Active Reminders</h3>
          {reminders.map((reminder, idx) => (
            <div key={idx} className={`reminder-item ${reminder.reminderType}`}>
              <strong>{reminder.vaccination.vaccineName}</strong>
              <span>{reminder.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Vaccination Records */}
      <div className="medical-section">
        <div className="section-header">
          <h2>Vaccination Records</h2>
          <button className="add-btn" onClick={() => setShowAddVaccine(!showAddVaccine)}>
            {showAddVaccine ? 'Cancel' : 'Add Vaccination'}
          </button>
        </div>

        {showAddVaccine && (
          <form className="add-form" onSubmit={handleAddVaccine}>
            <label>Vaccine Name</label>
            <input
              type="text"
              name="vaccineName"
              placeholder="e.g., Rabies"
              value={vaccineForm.vaccineName}
              onChange={handleVaccineChange}
              required
            />
            <label>Date Given</label>
            <input
              type="date"
              name="dateGiven"
              value={vaccineForm.dateGiven}
              onChange={handleVaccineChange}
              required
            />
            <label>Next Due Date</label>
            <input
              type="date"
              name="nextDueDate"
              value={vaccineForm.nextDueDate}
              onChange={handleVaccineChange}
              required
            />
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={vaccineForm.notes}
              onChange={handleVaccineChange}
              rows="3"
            />
            <button type="submit" className="submit-btn">Save Vaccination</button>
          </form>
        )}

        {upcomingVaccines.length > 0 ? (
          <div className="conditions-list">
            {upcomingVaccines.map((vaccine, idx) => {
              const daysUntil = getDaysUntilDue(vaccine.nextDueDate);
              let statusClass = 'upcoming';
              if (daysUntil <= 0) statusClass = 'overdue';
              else if (daysUntil <= 3) statusClass = 'urgent';
              else if (daysUntil <= 7) statusClass = 'soon';

              return (
                <div key={idx} className="condition-item">
                  <div className="condition-header">
                    <h4>{vaccine.vaccineName}</h4>
                    <button 
                    className="delete-btn small"
                    onClick={async () => {
                      if (window.confirm("Delete this vaccination?")) {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/api/pets/${id}/vaccinations/${vaccine._id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setPet(res.data);
                          alert("Vaccination deleted!");
                        } catch (err) {
                          alert("Failed to delete vaccination");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                  </div>
                  <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>
                      {daysUntil < 0 ? 'Overdue' : daysUntil === 0 ? 'Due Today' : `${daysUntil} days`}
                    </span></p>
                  <p><strong>Last Given:</strong> {formatDate(vaccine.dateGiven)}</p>
                  <p><strong>Next Due:</strong> {formatDate(vaccine.nextDueDate)}</p>
                  {vaccine.notes && <p><strong>Notes:</strong> {vaccine.notes}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No vaccination records yet. Add your first one above!</p>
        )}
      </div>

      {/* Allergies Section */}
      <div className="medical-section">
        <div className="section-header">
          <h2>Allergies</h2>
          <button className="add-btn" onClick={() => setShowAddAllergy(!showAddAllergy)}>
            {showAddAllergy ? 'Cancel' : 'Add Allergy'}
          </button>
        </div>

        {showAddAllergy && (
          <form className="add-form" onSubmit={handleAddAllergy}>
            <label>Allergy Name</label>
            <input
              type="text"
              placeholder="e.g., Chicken, Pollen, Beef"
              value={allergyForm}
              onChange={(e) => setAllergyForm(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Save Allergy</button>
          </form>
        )}

        {pet.allergies && pet.allergies.length > 0 ? (
          <div className="allergy-list">
            {pet.allergies.map((allergy, idx) => (
              <div key={idx} className="allergy-item">
                <span className="allergy-badge">{allergy}</span>
                <button 
                  className="delete-btn-inline"
                  onClick={() => handleDeleteAllergy(allergy)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No allergies recorded. Add your first one above!</p>
        )}
      </div>

      {/* Medical Conditions Section */}
      <div className="medical-section">
        <div className="section-header">
          <h2>Medical Conditions</h2>
          <button className="add-btn" onClick={() => setShowAddCondition(!showAddCondition)}>
            {showAddCondition ? 'Cancel' : 'Add Condition'}
          </button>
        </div>

        {showAddCondition && (
          <form className="add-form" onSubmit={handleAddCondition}>
            <label>Condition Name</label>
            <input
              type="text"
              name="condition"
              placeholder="e.g., Diabetes, Arthritis"
              value={conditionForm.condition}
              onChange={(e) => setConditionForm({ ...conditionForm, condition: e.target.value })}
              required
            />
            <label>Status</label>
            <select
              name="status"
              value={conditionForm.status}
              onChange={(e) => setConditionForm({ ...conditionForm, status: e.target.value })}
            >
              <option value="ongoing">Ongoing</option>
              <option value="resolved">Resolved</option>
              <option value="monitoring">Monitoring</option>
            </select>
            <label>Diagnosed Date</label>
            <input
              type="date"
              name="diagnosedDate"
              value={conditionForm.diagnosedDate}
              onChange={(e) => setConditionForm({ ...conditionForm, diagnosedDate: e.target.value })}
            />
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Additional notes (optional)"
              value={conditionForm.notes}
              onChange={(e) => setConditionForm({ ...conditionForm, notes: e.target.value })}
              rows="3"
            />
            <button type="submit" className="submit-btn">Save Condition</button>
          </form>
        )}

        {pet.medicalConditions && pet.medicalConditions.length > 0 ? (
          <div className="conditions-list">
            {pet.medicalConditions.map((cond, idx) => (
              <div key={idx} className="condition-item">
                <div className="condition-header">
                  <h4>{cond.condition}</h4>
                  <button 
                    className="delete-btn small"
                    onClick={async () => {
                      if (window.confirm("Delete this condition?")) {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/api/pets/${id}/conditions/${cond._id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setPet(res.data);
                        } catch (err) {
                          alert("Failed to delete condition");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                <p><strong>Status:</strong> {cond.status}</p>
                {cond.diagnosedDate && <p><strong>Diagnosed:</strong> {formatDate(cond.diagnosedDate)}</p>}
                {cond.notes && <p><strong>Notes:</strong> {cond.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No medical conditions recorded. Add your first one above!</p>
        )}
      </div>

      {/* Surgeries Section */}
      <div className="medical-section">
        <div className="section-header">
          <h2>Surgeries & Procedures</h2>
          <button className="add-btn" onClick={() => setShowAddSurgery(!showAddSurgery)}>
            {showAddSurgery ? 'Cancel' : 'Add Surgery'}
          </button>
        </div>

        {showAddSurgery && (
          <form className="add-form" onSubmit={handleAddSurgery}>
            <label>Surgery/Procedure Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Spay/Neuter, Dental Cleaning"
              value={surgeryForm.name}
              onChange={(e) => setSurgeryForm({ ...surgeryForm, name: e.target.value })}
              required
            />
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={surgeryForm.date}
              onChange={(e) => setSurgeryForm({ ...surgeryForm, date: e.target.value })}
            />
            <label>Veterinarian</label>
            <input
              type="text"
              name="vetName"
              placeholder="Dr. Name"
              value={surgeryForm.vetName}
              onChange={(e) => setSurgeryForm({ ...surgeryForm, vetName: e.target.value })}
            />
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Procedure details (optional)"
              value={surgeryForm.description}
              onChange={(e) => setSurgeryForm({ ...surgeryForm, description: e.target.value })}
              rows="3"
            />
            <button type="submit" className="submit-btn">Save Surgery</button>
          </form>
        )}

        {pet.surgeries && pet.surgeries.length > 0 ? (
          <div className="surgeries-list">
            {pet.surgeries.map((surgery, idx) => (
              <div key={idx} className="surgery-item">
                <div className="surgery-header">
                  <h4>{surgery.name}</h4>
                  <button 
                    className="delete-btn small"
                    onClick={async () => {
                      if (window.confirm("Delete this surgery?")) {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/api/pets/${id}/surgeries/${surgery._id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setPet(res.data);
                        } catch (err) {
                          alert("Failed to delete surgery");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                {surgery.date && <p><strong>Date:</strong> {formatDate(surgery.date)}</p>}
                {surgery.vetName && <p><strong>Vet:</strong> {surgery.vetName}</p>}
                {surgery.description && <p><strong>Description:</strong> {surgery.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No surgeries or procedures recorded. Add your first one above!</p>
        )}
      </div>

      {/* Medications Section */}
      <div className="medical-section">
        <div className="section-header">
          <h2>Current Medications</h2>
          <button className="add-btn" onClick={() => setShowAddMedication(!showAddMedication)}>
            {showAddMedication ? 'Cancel' : 'Add Medication'}
          </button>
        </div>

        {showAddMedication && (
          <form className="add-form" onSubmit={handleAddMedication}>
            <label>Medication Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Heartgard, Apoquel"
              value={medicationForm.name}
              onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
              required
            />
            <label>Dosage</label>
            <input
              type="text"
              name="dosage"
              placeholder="e.g., 25mg"
              value={medicationForm.dosage}
              onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
            />
            <label>Frequency</label>
            <input
              type="text"
              name="frequency"
              placeholder="e.g., Twice daily, Once a month"
              value={medicationForm.frequency}
              onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
            />
            <label>Prescribed For</label>
            <input
              type="text"
              name="prescribedFor"
              placeholder="e.g., Heartworm prevention, Allergies"
              value={medicationForm.prescribedFor}
              onChange={(e) => setMedicationForm({ ...medicationForm, prescribedFor: e.target.value })}
            />
            <label>Prescribed By</label>
            <input
              type="text"
              name="vetName"
              placeholder="Dr. Name"
              value={medicationForm.vetName}
              onChange={(e) => setMedicationForm({ ...medicationForm, vetName: e.target.value })}
            />
            <button type="submit" className="submit-btn">Save Medication</button>
          </form>
        )}

        {pet.medications && pet.medications.length > 0 ? (
          <div className="medications-list">
            {pet.medications.map((med, idx) => (
              <div key={idx} className="medication-item">
                <div className="med-header">
                  <h4>{med.name}</h4>
                  <button 
                    className="delete-btn small"
                    onClick={async () => {
                      if (window.confirm("Delete this medication?")) {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/api/pets/${id}/medications/${med._id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setPet(res.data);
                        } catch (err) {
                          alert("Failed to delete medication");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                {med.dosage && <p><strong>Dosage:</strong> {med.dosage}</p>}
                {med.frequency && <p><strong>Frequency:</strong> {med.frequency}</p>}
                {med.prescribedFor && <p><strong>For:</strong> {med.prescribedFor}</p>}
                {med.vetName && <p><strong>Prescribed by:</strong> {med.vetName}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No current medications. Add your first one above!</p>
        )}
      </div>

      {/* Vet Information */}
      <div className="vet-section">
        <h2>Primary Veterinarian</h2>
        {pet.primaryVet ? (
          <div className="vet-card">
            <p><strong>{pet.primaryVet.name}</strong></p>
            {pet.primaryVet.clinic && <p>Clinic: {pet.primaryVet.clinic}</p>}
            {pet.primaryVet.phone && <p>Phone: {pet.primaryVet.phone}</p>}
            {pet.primaryVet.email && <p>Email: {pet.primaryVet.email}</p>}
          </div>
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No primary vet assigned. Add vet details in edit mode.</p>
        )}
      </div>
    </div>
  );
};

export default PetPassport;
