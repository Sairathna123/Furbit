// Path: frontend/src/App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PetPassport from "./pages/PetPassport";
import PublicPassport from "./pages/PublicPassport";
import CreatePassport from "./pages/CreatePassport";

function App() {
  const location = useLocation();
  const isPublicPassport = location.pathname.startsWith('/public/passport/');
  
  return (
    <div>
      {!isPublicPassport && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Passport Routes */}
        <Route path="/create-passport" element={<CreatePassport />} />
        <Route path="/edit-passport/:id" element={<CreatePassport />} />
        <Route path="/passport/:id" element={<PetPassport />} />
        
        {/* Public Passport View (no auth required) */}
        <Route path="/public/passport/:passportId" element={<PublicPassport />} />
      </Routes>
    </div>
  );
}

export default App;
