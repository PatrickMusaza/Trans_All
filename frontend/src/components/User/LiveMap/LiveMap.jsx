// LiveMap.jsx
import React from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LiveMap.css";

const LiveMap = ({ route }) => {
  const startCoords = [route.from_lat, route.from_lng];
  const endCoords = [route.to_lat, route.to_lng];

  return (
    <div className="live-map">
      <h2>Live Map</h2>
      <MapContainer center={startCoords} zoom={13} style={{ height: "400px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={startCoords} />
        <Marker position={endCoords} />
        <Polyline positions={[startCoords, endCoords]} color="blue" />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
