// src/pages/PetShops.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "./PetShops.css";
import "leaflet/dist/leaflet.css"; // Ensure this is added

const markerIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const PetShops = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("pet_shop");
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai default
  const [loading, setLoading] = useState(false);

  const getOverpassQuery = (lat, lon, selectedCategory) => {
    let overpassTag = "";

    if (selectedCategory === "pet_shop") {
      overpassTag = `node["shop"="pet"](around:3000,${lat},${lon});`;
    } else if (selectedCategory === "adoption") {
      overpassTag = `node["animal_shelter"](around:3000,${lat},${lon});`;
    } else if (selectedCategory === "pet_friendly") {
      overpassTag = `
        node["amenity"="cafe"]["pets"~"yes"](around:3000,${lat},${lon});
        node["amenity"="restaurant"]["pets"~"yes"](around:3000,${lat},${lon});
        node["tourism"="hotel"]["pets"~"yes"](around:3000,${lat},${lon});
      `;
    }

    return `[out:json];(${overpassTag});out body;`;
  };

  const getCoordinates = async (locationName) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: locationName,
          format: "json",
        },
      });
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        return null;
      }
    } catch {
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setPlaces([]);

    const coords = await getCoordinates(searchQuery);
    if (!coords) {
      alert("No results found for this location.");
      setLoading(false);
      return;
    }

    const query = getOverpassQuery(coords.lat, coords.lon, category);

    try {
      const res = await axios.post(
        "https://overpass-api.de/api/interpreter",
        new URLSearchParams({ data: query })
      );

      const results = res.data.elements.map((el) => ({
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: el.tags.name || "Unnamed",
        type: category === "pet_shop"
          ? "Pet Shop"
          : category === "adoption"
          ? "Adoption Center"
          : el.tags.amenity || el.tags.tourism || "Pet-Friendly Place",
        address: el.tags["addr:full"] ||
          [el.tags["addr:housename"], el.tags["addr:street"], el.tags["addr:city"], el.tags["addr:state"], el.tags["addr:postcode"]]
            .filter(Boolean).join(", "),
        phone: el.tags["contact:phone"] || el.tags["phone"] || "N/A",
        rating: el.tags["rating"] || "N/A",
      }));

      setPlaces(results);
      setMapCenter({ lat: coords.lat, lng: coords.lon });
    } catch (error) {
      console.error("Overpass fetch error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="petshops-page">
      <div className="top-section">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="pet_shop">Pet Shops</option>
          <option value="adoption">Adoption Centers</option>
          <option value="pet_friendly">Pet-Friendly Places</option>
        </select>
        <input
          type="text"
          placeholder="Enter location (e.g., Chennai)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="content-section">
        <div className="map-container">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", minHeight: "600px" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((place) => (
              <Marker key={place.id} position={[place.lat, place.lon]} icon={markerIcon}>
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="details-panel">
          <h2>Nearby Results</h2>
          {loading && <p>Searching...</p>}
          {!loading && places.length === 0 && <p>No results found.</p>}
          <div className="results-list">
            {places.map((place) => (
              <div className="result-card" key={place.id}>
                <h3>{place.name}</h3>
                <p><span>Type:</span> {place.type}</p>
                <p><span>Address:</span> {place.address || "N/A"}</p>
                <p><span>Phone:</span> {place.phone}</p>
                <p><span>Rating:</span> {place.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetShops;
