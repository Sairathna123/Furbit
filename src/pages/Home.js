import React from "react";
import "./Home.css";

const features = [
  {
    id: "petshops",
    title: "Pet Shops & Adoption",
    description: "Find nearby pet shops and adoption centers for your furry friend.",
    link: "/petshops",
  },
  {
    id: "health",
    title: "Health Records",
    description: "Track vaccinations and medical history of your pet easily.",
    link: "/health",
  },
  {
    id: "petshops",
    title: "Pet-Friendly Spots",
    description: "Explore pet-inclusive parks, cafes, and hotels around you.",
    link: "/petshops",
  },
  {
    id: "foodcare",
    title: "Food & Care",
    description: "Get personalized care tips and diet advice for your pet.",
    link: "/community",
  },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section id="intro" className="hero">
        <div className="hero-text">
          <h1>FurBit - Petcare Reimagined.</h1>
          <p>The Smart Companion Platform for Pet Owners</p>
          <a href="#features" className="cta-btn">Explore Features</a>
        </div>
        <img
          src="https://img1.picmix.com/output/stamp/normal/3/3/5/8/1628533_2b6fe.gif"
          alt="Cartoon running dog"
          className="hero-img"
        />
      </section>

      {/* Features Cards Section */}
      <section id="features" className="features-cards-section">
        <h2>Our Features</h2>
        <div className="feature-cards-container">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="card-inner">
                <div className="card-front">
                  <h3>{feature.title}</h3>
                </div>
                <div className="card-back">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href={feature.link} className="cta-btn small">Explore</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-row">
          <div className="contact-left">
            <h2 className="contact-title">Say Hello!</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="4" placeholder="What's up?" required></textarea>
              </div>
              <button type="submit" className="btn-send">Send</button>
            </form>
          </div>
          <div className="contact-right">
            <img
              src="https://img.freepik.com/premium-photo/cheerful-cartoon-dog-yellow-background-playful-character-concept_666746-42291.jpg"
              alt="Say Hello"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
