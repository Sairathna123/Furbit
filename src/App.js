import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import BlobCursor from "./components/BlobCursor";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PetShops from "./pages/PetShops";
import HealthRecords from "./pages/HealthRecords";
import Community from "./pages/Community";
import Profile from "./pages/Profile"; // ✅ Import Profile

// Layout component to wrap routes with optional navbar and blob cursor
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <>
      <BlobCursor />
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

// All app routes go here
const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/petshops" element={<PetShops />} />
      <Route path="/health" element={<HealthRecords />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<Profile />} /> {/* ✅ Profile route */}
    </Routes>
  </Layout>
);

// App component with router
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
