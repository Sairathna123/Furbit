import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import NotificationModal from "../components/NotificationModal";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDueModal, setShowDueModal] = useState(false);
  const [dueMessages, setDueMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedPets = res.data || [];
        setPets(fetchedPets);
        setLoading(false);

        // Build due/overdue messages across all pets
        const today = new Date();
        const messages = [];
        fetchedPets.forEach(pet => {
          (pet.vaccinations || []).forEach(v => {
            const dueDate = new Date(v.nextDueDate);
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) {
              const text = diffDays === 0
                ? `${pet.name}: ${v.vaccineName} is due today`
                : `${pet.name}: ${v.vaccineName} is overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
              messages.push(text);
            }
          });
        });

        if (messages.length > 0) {
          // Check snooze for today
          const todayStr = new Date().toISOString().slice(0, 10);
          const snoozedOn = localStorage.getItem('furbit_snooze_date');
          if (snoozedOn !== todayStr) {
            setDueMessages(messages);
            setShowDueModal(true);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load pets");
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [navigate]);

  return (
    <div className="dashboard">
      {showDueModal && (
        <NotificationModal
          title="Vaccination Reminder"
          messages={dueMessages}
          onClose={() => setShowDueModal(false)}
          onSnooze={() => {
            const todayStr = new Date().toISOString().slice(0, 10);
            localStorage.setItem('furbit_snooze_date', todayStr);
            setShowDueModal(false);
          }}
        />
      )}
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Your Pet Passports</h1>
            <p>
              Manage digital pet passports, track vaccinations, and share instantly via QR code.
            </p>
            <Link to="/create-passport" className="cta-btn">
              + Create New Passport
            </Link>
          </div>
          <div className="hero-img">
            <img 
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" 
              alt="Happy pets"
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </div>
        </div>
      </section>

      {/* Pet Cards Section */}
      <section className="pets-section">
        <h2>My Pets</h2>
        <div className="pets-container-inner">
          {error && <div style={{ color: "red", padding: "1rem", marginBottom: "1rem" }}>Error: {error}</div>}
          {loading ? (
            <p>Loading your pets...</p>
          ) : pets.length === 0 ? (
            <div className="no-pets">
              <p>No pet passports yet. Create your first one!</p>
              <Link to="/create-passport" className="cta-btn small">
                Create Passport
              </Link>
            </div>
          ) : (
            <div className="pet-cards-container">
              {pets.map((pet) => (
                <div key={pet._id} className="pet-card">
                  <div className="pet-card-top" onClick={() => navigate(`/passport/${pet._id}`)}>
                    <div className="pet-photo">
                      {pet.photo ? (
                        <img src={pet.photo} alt={pet.name} />
                      ) : (
                        <div className="photo-placeholder">No Photo</div>
                      )}
                    </div>
                    <div className="pet-info">
                      <h3>{pet.name}</h3>
                      <p className="pet-breed">{pet.breed || pet.species}</p>
                      <p className="passport-id">ID: {pet.passportId}</p>
                      
                      {pet.vaccinations && pet.vaccinations.length > 0 && (
                        <div className="vaccine-status">
                          <span className="vaccine-count">
                            {pet.vaccinations.length} Vaccination{pet.vaccinations.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    className="delete-pet-btn"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this item?")) {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${process.env.REACT_APP_API_URL}/api/pets/${pet._id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          setPets(pets.filter(p => p._id !== pet._id));
                          alert("Item deleted.");
                        } catch (err) {
                          alert("Failed to delete pet");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-cards-section">
        <div className="features-inner">
          <h2 style={{ marginBottom: '2rem', color: '#3e0061' }}>How Furbit Works</h2>
          <div className="feature-cards-container">
            <div className="feature-card">
              <div className="card-inner">
                <div className="card-front">
                  <h3>Digital Passport</h3>
                  <p>All pet info in one secure place</p>
                </div>
                <div className="card-back">
                  <p>Store pet identity, medical history, and vet information digitally.</p>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-inner">
                <div className="card-front">
                  <h3>Vaccination Tracking</h3>
                  <p>Never miss a vaccine again</p>
                </div>
                <div className="card-back">
                  <p>Get automatic reminders 7 days, 3 days before, and on due date.</p>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-inner">
                <div className="card-front">
                  <h3>QR Sharing</h3>
                  <p>Instant read-only access</p>
                </div>
                <div className="card-back">
                  <p>Vets & pet services can scan QR to view passport. No edits allowed.</p>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-inner">
                <div className="card-front">
                  <h3>Smart Reminders</h3>
                  <p>Automated notification system</p>
                </div>
                <div className="card-back">
                  <p>Email and in-app alerts keep you on schedule, stress-free.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
