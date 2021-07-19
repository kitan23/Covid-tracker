import React from "react";
import { Map as MapLeaflet, TileLayer, Marker, Popup } from "react-leaflet";
import "../styles/Map.css";
import { showCirclesOnMap } from "../utils/utils";

function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <MapLeaflet center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* LOOP THROUGH ALL THE COUNTRIES AND DRAW CIRCLES ON THE MAP */}
        {showCirclesOnMap(countries, casesType)}
      </MapLeaflet>
    </div>
  );
}

export default Map;
