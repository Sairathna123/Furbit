import React, { useRef, useState } from 'react';
import './HealthRecords.css';

function HealthRecords() {
  const [pet, setPet] = useState({ name: '', breed: '', type: '', color: '', picture: 'https://thumbs.dreamstime.com/b/default-profile-picture-icon-high-resolution-high-resolution-default-profile-picture-icon-symbolizing-no-display-picture-360167031.jpg' });
  const [editMode, setEditMode] = useState(false);
  const [records, setRecords] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const vaccineRef = useRef();
  const vaccineDateRef = useRef();
  const allergyRef = useRef();
  const medicationNameRef = useRef();
  const medicationDoseRef = useRef();
  const medicationReasonRef = useRef();
  const surgeryRef = useRef();
  const surgeryDateRef = useRef();
  const surgeryDoctorRef = useRef();
  const doctorRef = useRef();
  const clinicRef = useRef();
  const websiteRef = useRef();
  const appointmentVetRef = useRef();
  const appointmentClinicRef = useRef();
  const appointmentDateRef = useRef();
  const appointmentTimeRef = useRef();
  const appointmentReasonRef = useRef();
  const vaccineDueRef = useRef();
  const pictureRef = useRef();

  const calculateDueDate = (givenDate, duration) => {
    const date = new Date(givenDate);
    const [amount, unit] = duration.split(' ');
  
    switch (unit) {
      case 'week':
      case 'weeks':
        date.setDate(date.getDate() + parseInt(amount) * 7);
        break;
      case 'month':
      case 'months':
        date.setMonth(date.getMonth() + parseInt(amount));
        break;
      case 'year':
      case 'years':
        date.setFullYear(date.getFullYear() + parseInt(amount));
        break;
      default:
        break;
    }
  
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };
  

  const handleVaccinationSubmit = (e) => {
    e.preventDefault();
    const vaccine = vaccineRef.current.value;
    const date = vaccineDateRef.current.value;
    const duration = vaccineDueRef.current.value;
  
    if (vaccine && date && duration) {
      const dueDate = calculateDueDate(date, duration);
      setRecords((prev) => [...prev, { vaccine, date, due: dueDate }]);
      vaccineRef.current.value = '';
      vaccineDateRef.current.value = '';
      vaccineDueRef.current.value = '';
    }
  };
  
  

  const handleRemoveVaccination = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleAddAllergy = () => {
    const val = allergyRef.current.value;
    if (val) setAllergies(prev => [...prev, val]);
    allergyRef.current.value = '';
  };

  const handleRemoveAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddMedication = () => {
    const name = medicationNameRef.current.value;
    const dose = medicationDoseRef.current.value;
    const reason = medicationReasonRef.current.value;
    if (name && dose && reason) {
      setMedications((prev) => [...prev, { name, dose, reason }]);
      medicationNameRef.current.value = '';
      medicationDoseRef.current.value = '';
      medicationReasonRef.current.value = '';
    }
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddSurgery = () => {
    const surgery = surgeryRef.current.value;
    const date = surgeryDateRef.current.value;
    const doctor = surgeryDoctorRef.current.value;
    if (surgery && date && doctor) {
      setSurgeries((prev) => [...prev, { surgery, date, doctor }]);
      surgeryRef.current.value = '';
      surgeryDateRef.current.value = '';
      surgeryDoctorRef.current.value = '';
    }
  };

  const handleRemoveSurgery = (index) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const handleVetSubmit = () => {
    const doctor = doctorRef.current.value;
    const clinic = clinicRef.current.value;
    const website = websiteRef.current.value;
    if (doctor && clinic && website) {
      setVets((prev) => [...prev, { doctor, clinic, website }]);
      doctorRef.current.value = '';
      clinicRef.current.value = '';
      websiteRef.current.value = '';
    }
  };

  const handleRemoveVet = (index) => {
    setVets(vets.filter((_, i) => i !== index));
  };

  const handleAddAppointment = () => {
    const vet = appointmentVetRef.current.value;
    const clinic = appointmentClinicRef.current.value;
    const date = appointmentDateRef.current.value;
    const time = appointmentTimeRef.current.value;
    const reason = appointmentReasonRef.current.value;
    if (vet && clinic && date && time && reason) {
      setAppointments((prev) => [...prev, { vet, clinic, date, time, reason }]);
      appointmentVetRef.current.value = '';
      appointmentClinicRef.current.value = '';
      appointmentDateRef.current.value = '';
      appointmentTimeRef.current.value = '';
      appointmentReasonRef.current.value = '';
    }
  };

  const handleRemoveAppointment = (index) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };

  const toggleEdit = () => setEditMode(!editMode);

  const saveProfile = (e) => {
    e.preventDefault();
    const form = e.target;
    const file = pictureRef.current?.files[0]; // safer access
    const reader = new FileReader();
  
    const updatedPet = {
      name: form.name.value,
      breed: form.breed.value,
      type: form.type.value,
      color: form.color.value,
      picture: pet.picture
    };
  
    if (file) {
      reader.onloadend = () => {
        updatedPet.picture = reader.result;
        setPet(updatedPet);
        setEditMode(false);
      };
      reader.readAsDataURL(file);
    } else {
      setPet(updatedPet);
      setEditMode(false);
    }
  };
  

  return (
    <div className="health-container">
      <header className="header" style={{ paddingTop: '60px' }}>
        <h1>FurBit Health Records</h1>
      </header>

      <section className="form-section">
        <h2>Pet Profile</h2>
        <div className="profile-section">
          <div className="profile-left">
            <img src={pet.picture} alt="Profile" />
            {editMode && (
              <input ref={pictureRef} type="file" accept="image/*" style={{ marginTop: '10px' }} />

            )}
          </div>
          <div className="profile-right">
            {editMode ? (
              <form onSubmit={saveProfile} className="form">
                <input name="name" defaultValue={pet.name} placeholder="Name" required />
                <input name="breed" defaultValue={pet.breed} placeholder="Breed" />
                <input name="type" defaultValue={pet.type} placeholder="Type" />
                <input name="color" defaultValue={pet.color} placeholder="Color" />
                <button type="submit">Save</button>
              </form>
            ) : (
              <>
                <h2>{pet.name}</h2>
                <p>Breed: {pet.breed}</p>
                <p>Type: {pet.type}</p>
                <p>Color: {pet.color}</p>
                <button onClick={toggleEdit}>Edit</button>
              </>
            )}
          </div>
        </div>
      </section>
        
      <section className="form-section">
  <h2>Vaccination Details</h2>
  <form onSubmit={handleVaccinationSubmit} className="form">
    <input ref={vaccineRef} placeholder="Vaccine Name" required />
    <input ref={vaccineDateRef} type="date" required />
    <select ref={vaccineDueRef} required>
      <option value="">Due After</option>
      <option value="1 week">1 week</option>
      <option value="2 weeks">2 weeks</option>
      <option value="1 month">1 month</option>
      <option value="2 months">2 months</option>
      <option value="3 months">3 months</option>
      <option value="6 months">6 months</option>
      <option value="1 year">1 year</option>
    </select>
    <button type="submit">+</button>
  </form>

  {records.length > 0 && (
    <div className="record-list">
      {records.map((record, index) => (
        <div key={index} className="display-box">
          <div style={{ flex: 1 }}>
            <p>Vaccine: {record.vaccine}</p>
            <p>Date Given: {record.date}</p>
            <p>Due Date: {record.due}</p>
          </div>
          <button onClick={() => handleRemoveVaccination(index)}>-</button>
        </div>
      ))}
    </div>
  )}
</section>



      <section className="form-section">
        <h2>Allergies</h2>
        <div className="form">
          <input ref={allergyRef} placeholder="New Allergy" />
          <button onClick={handleAddAllergy}>+</button>
        </div>
        {allergies.map((a, i) => (
          <div className="entry-box" key={i}>
            {a}
            <button onClick={() => handleRemoveAllergy(i)}>-</button>
          </div>
        ))}
      </section>

      <section className="form-section">
        <h2>Medications</h2>
        <div className="form">
          <input ref={medicationNameRef} placeholder="Name" />
          <input ref={medicationDoseRef} placeholder="Dosage" />
          <input ref={medicationReasonRef} placeholder="Reason" />
          <button onClick={handleAddMedication}>+</button>
        </div>
        {medications.map((m, i) => (
          <div className="entry-box" key={i}>
            {m.name} - {m.dose} ({m.reason})
            <button onClick={() => handleRemoveMedication(i)}>-</button>
          </div>
        ))}
      </section>

      <section className="form-section">
        <h2>Surgeries</h2>
        <div className="form">
          <input ref={surgeryRef} placeholder="Surgery Name" />
          <input ref={surgeryDateRef} placeholder="Date" type="date" />
          <input ref={surgeryDoctorRef} placeholder="Doctor" />
          <button onClick={handleAddSurgery}>+</button>
        </div>
        {surgeries.map((s, i) => (
          <div className="entry-box" key={i}>
            {s.surgery} on {s.date} by Dr. {s.doctor}
            <button onClick={() => handleRemoveSurgery(i)}>-</button>
          </div>
        ))}
      </section>

      <section className="form-section">
        <h2>Vet Details</h2>
        <div className="form">
          <input ref={doctorRef} placeholder="Doctor Name" />
          <input ref={clinicRef} placeholder="Clinic Name" />
          <input ref={websiteRef} placeholder="Website/Address" />
          <button onClick={handleVetSubmit}>+</button>
        </div>
        {vets.map((v, i) => (
          <div className="entry-box" key={i}>
            Dr. {v.doctor} - {v.clinic} (<a href={v.website} target="_blank" rel="noreferrer">{v.website}</a>)
            <button onClick={() => handleRemoveVet(i)}>-</button>
          </div>
        ))}
      </section>

      <section className="form-section">
        <h2>Appointments</h2>
        <div className="form">
          <input ref={appointmentVetRef} placeholder="Vet Name" />
          <input ref={appointmentClinicRef} placeholder="Clinic" />
          <input ref={appointmentDateRef} placeholder="Date" type="date" />
          <input ref={appointmentTimeRef} placeholder="Time" type="time" />
          <input ref={appointmentReasonRef} placeholder="Reason" />
          <button onClick={handleAddAppointment}>+</button>
        </div>
        {appointments.map((a, i) => (
          <div className="entry-box" key={i}>
            Appointment with Dr. {a.vet} at {a.clinic} on {a.date} at {a.time} ({a.reason})
            <button onClick={() => handleRemoveAppointment(i)}>-</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HealthRecords;
