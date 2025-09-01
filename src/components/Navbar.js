// src/components/Navbar.js
import React from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left logo">FurBit</div>

      <ul className="navbar-center nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/petshops">PetRadar</Link></li>
        <li><a href="/health">Health Records</a></li>

        <li><a href="/community">Tips</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="navbar-right">
        <button className="nav-btn login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="nav-btn signup" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
