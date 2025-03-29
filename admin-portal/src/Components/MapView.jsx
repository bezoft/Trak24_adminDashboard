import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import leaflet for custom icon
import 'leaflet/dist/leaflet.css';

function MapView({ latitude, longitude }) {

  // Create a custom icon for the marker
  const customIcon = new L.Icon({
    iconUrl: '/assets/pin.png', 
    iconSize: [40, 40], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

  // Custom component to handle map zoom and focus on marker
  const MapZoomToMarker = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, latitude||longitude?18:10, { animate: true }); 
    }, [center, map]);

    return null; 
  };

  return (
      <MapContainer center={[latitude || 9.988407, longitude || 76.306417]} zoom={13} className="w-full h-full">
                <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; Trak24.com'
        />
        {/* Add MapZoomToMarker to update the map's zoom and focus */}
        <MapZoomToMarker center={[latitude || 9.988407, longitude || 76.306417]} />
        {latitude||longitude?(
           <Marker position={[latitude, longitude]} icon={customIcon}>
           <Popup>
             A sample marker. <br /> Easily customizable.
           </Popup>
         </Marker>
        ):null}
       
      </MapContainer>
  );
}

export default MapView;
