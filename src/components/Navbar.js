// Path: frontend/src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ 
      background: "#3e0061", 
      color: "#fff",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0.75rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to={isLoggedIn ? "/home" : "/"} style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ffb400", textDecoration: "none" }}>
          Furbit
        </Link>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          {isLoggedIn && (
            <>
              <Link to="/home" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
              <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>Profile</Link>
              <Link to="/create-passport" style={{ color: "#fff", textDecoration: "none" }}>Create</Link>
            </>
          )}
          
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
              <Link to="/signup" style={{ 
                color: "#3e0061", 
                background: "#ffb400", 
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                textDecoration: "none"
              }}>Signup</Link>
            </>
          ) : (
            <button 
              onClick={handleLogout} 
              style={{ 
                background: "#ffb400", 
                color: "#3e0061",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
