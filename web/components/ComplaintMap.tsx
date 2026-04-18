'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const markerIcon2x = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ComplaintMapProps {
  complaints: any[];
}

export default function ComplaintMap({ complaints }: ComplaintMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-swiss-muted animate-pulse" />;

  // Default to a central location if no complaints have GPS data
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // e.g., NYC

  return (
    <div className="h-full w-full z-0 relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles" // Add a class for potential styling (e.g., grayscale for Swiss UI)
        />
        
        {complaints.map((complaint) => {
          // Look for lat/lng properties, assuming they could be stored correctly.
          // Adjust based on your actual data structure (e.g., location.lat, or latitude)
          const lat = complaint.latitude || complaint.location?.lat;
          const lng = complaint.longitude || complaint.location?.lng;
          
          if (!lat || !lng) return null;
          
          return (
            <Marker key={complaint.id} position={[lat, lng]}>
              <Popup>
                <div className="font-bold uppercase tracking-widest text-xs">
                  <strong>Status:</strong> {complaint.status} <br/>
                  <strong>Category:</strong> {complaint.category} <br/>
                  <strong>Severity:</strong> {complaint.severity}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Swiss Design Overlay style block for the Map to remain brutalist */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #f1f2f0;
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border: 4px solid #111111;
          border-radius: 0;
          box-shadow: none;
        }
        .leaflet-popup-tip {
          border-right: 4px solid #111111;
          border-bottom: 4px solid #111111;
          border-radius: 0;
          box-shadow: none;
        }
        .map-tiles {
          filter: grayscale(100%) contrast(120%);
        }
      `}</style>
    </div>
  );
}