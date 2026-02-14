// Path: frontend/src/pages/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        username: form.username,
        email: form.email,
        password: form.password
      });
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Join Furbit</h1>
        <p>Create your digital pet passport account</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              name="username" 
              placeholder="Choose a username" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              name="email" 
              placeholder="your@email.com" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              name="password" 
              placeholder="Enter password" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password"
              name="confirmPassword" 
              placeholder="Confirm password" 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
