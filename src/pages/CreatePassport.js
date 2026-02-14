import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CreatePassport.css";

const CreatePassport = () => {
  const { id } = useParams(); // For edit mode
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    dateOfBirth: "",
    gender: "male",
    color: "",
    microchipId: "",
    photo: "",
    weight: "",
    allergies: [],
    medications: [],
    medicalConditions: [],
    surgeries: [],
    vaccinations: [],
    primaryVet: {
      name: "",
      clinic: "",
      phone: "",
      email: ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch pet data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchPet = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const pet = res.data;
          
          setFormData({
            name: pet.name || "",
            species: pet.species || "",
            breed: pet.breed || "",
            dateOfBirth: pet.dateOfBirth ? pet.dateOfBirth.split('T')[0] : "",
            gender: pet.gender || "male",
            color: pet.color || "",
            microchipId: pet.microchipId || "",
            photo: pet.photo || "",
            weight: pet.weight || "",
            allergies: pet.allergies || [],
            medications: pet.medications || [],
            medicalConditions: pet.medicalConditions || [],
            surgeries: pet.surgeries || [],
            vaccinations: pet.vaccinations || [],
            primaryVet: pet.primaryVet || {
              name: "",
              clinic: "",
              phone: "",
              email: ""
            }
          });
        } catch (err) {
          alert("Failed to load pet data");
          navigate('/dashboard');
        }
      };
      fetchPet();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vet_')) {
      const vetField = name.replace('vet_', '');
      setFormData({
        ...formData,
        primaryVet: { ...formData.primaryVet, [vetField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Exclude medical arrays when editing - they're managed separately on PetPassport page
      const { allergies, medications, medicalConditions, surgeries, vaccinations, ...basicData } = formData;
      
      const petData = isEditMode 
        ? basicData  // Only send basic info when editing
        : { ...formData };  // Send everything when creating

      if (isEditMode) {
        // Update existing pet
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/pets/${id}`,
          petData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Pet passport updated successfully!");
        navigate(`/passport/${id}`);
      } else {
        // Create new pet
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/pets`,
          petData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Pet passport created successfully!");
        navigate(`/passport/${res.data._id}`);
      }
    } catch (err) {
      alert(`Failed to ${isEditMode ? 'update' : 'create'} passport: ` + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="create-passport">
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate(isEditMode ? `/passport/${id}` : '/dashboard')}>
          {isEditMode ? 'Back to Passport' : 'Back to Dashboard'}
        </button>
        <h1>{isEditMode ? 'Edit Pet Passport' : 'Create New Pet Passport'}</h1>
        <p>{isEditMode ? 'Update your pet\'s information' : 'Fill in your pet\'s information to generate a digital passport'}</p>
      </div>

      <form className="passport-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Pet Identity</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Pet Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Max"
              />
            </div>

            <div className="form-group">
              <label>Species *</label>
              <select name="species" value={formData.species} onChange={handleChange} required>
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Golden Retriever"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Brown, White"
              />
            </div>

            <div className="form-group">
              <label>Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 25 kg, 15 lbs"
              />
            </div>

            <div className="form-group full-width">
              <label>Microchip ID</label>
              <input
                type="text"
                name="microchipId"
                value={formData.microchipId}
                onChange={handleChange}
                placeholder="15-digit microchip number (if available)"
              />
            </div>

            <div className="form-group full-width">
              <label>Photo URL</label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/pet-photo.jpg"
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Primary Veterinarian (Optional)</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Vet Name</label>
              <input
                type="text"
                name="vet_name"
                value={formData.primaryVet.name}
                onChange={handleChange}
                placeholder="Dr. Smith"
              />
            </div>

            <div className="form-group">
              <label>Clinic Name</label>
              <input
                type="text"
                name="vet_clinic"
                value={formData.primaryVet.clinic}
                onChange={handleChange}
                placeholder="Happy Paws Veterinary Clinic"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="vet_phone"
                value={formData.primaryVet.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="vet_email"
                value={formData.primaryVet.email}
                onChange={handleChange}
                placeholder="info@veterinary.com"
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(isEditMode ? `/passport/${id}` : '/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Passport' : 'Create Passport')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePassport;
