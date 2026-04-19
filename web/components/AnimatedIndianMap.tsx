'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AnimatedIndianMap({ onLoaded }: { onLoaded?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [activeStateIndex, setActiveStateIndex] = useState<number | null>(null);
  const [calloutData, setCalloutData] = useState<{lat: number, lng: number, name: string, filed: number, solved: number} | null>(null);
  const geoJsonRef = useRef<any>(null);

  useEffect(() => {
    fetch('/india-states.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        setMounted(true);
        if (onLoaded) {
          // Add a tiny delay to ensure Leaflet has initialized the DOM
          setTimeout(() => onLoaded(), 500); 
        }
      })
      .catch(err => {
        console.error("Error loading GeoJSON", err);
        if (onLoaded) onLoaded(); // Fallback so we don't get stuck
      });
  }, [onLoaded]);

  useEffect(() => {
    if (!mounted || !geoData) return;

    const intervalId = setInterval(() => {
      const numOfStates = geoData.features.length;
      const nextIndex = Math.floor(Math.random() * numOfStates);
      
      setActiveStateIndex(nextIndex);
      
      const feature = geoData.features[nextIndex];
      const layer = L.geoJSON(feature);
      const center = layer.getBounds().getCenter();
      
      const generatedFiled = Math.floor(Math.random() * 400) + 50;
      const generatedSolved = Math.floor(Math.random() * (generatedFiled + 1));
      
      setCalloutData({
        lat: center.lat,
        lng: center.lng,
        name: feature.properties.NAME_1,
        filed: generatedFiled,
        solved: generatedSolved
      });
      
    }, 4500);

    return () => clearInterval(intervalId);
  }, [mounted, geoData]);

  useEffect(() => {
    if (geoJsonRef.current && geoData && activeStateIndex !== null) {
      geoJsonRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        const index = geoData.features.indexOf(feature);
        const isTarget = index === activeStateIndex;
        
        layer.setStyle({
          fillColor: isTarget ? '#e63946' : '#9ca3af',
          weight: isTarget ? 2 : 1,
          opacity: 1,
          color: isTarget ? '#000000' : '#ffffff',
          fillOpacity: isTarget ? 0.8 : 0.2
        });
        
        if (isTarget) {
          layer.bringToFront();
        } else {
          layer.bringToBack();
        }
      });
    }
  }, [activeStateIndex, geoData]);

  if (!geoData) {
    return <div className="h-full w-full bg-transparent animate-pulse absolute inset-0 z-0" />;
  }

  const baseStyle = (feature: any) => {
    return {
      fillColor: '#9ca3af',
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.2
    };
  };

  const createCustomIcon = (data: any) => {
    // Dynamic stretch direction based on screen edges
    // Avoid top cut off (Northern States -> stretch down)
    const dirY = data.lat > 27 ? 'b' : (data.lat < 16 ? 't' : 'b'); 
    // Avoid right edge cut off (Eastern States -> stretch left)
    const dirX = data.lng > 83 ? 'l' : 'r';
    const dirClass = `dir-${dirY}${dirX}`;

    const htmlString = `<div class="callout-wrapper-diag ${dirClass}">` +
      '<div class="callout-line-diag-container shadow-[0_0_10px_rgba(230,57,70,0.8)]">' +
        '<div class="callout-line-diag"></div>' +
      '</div>' +
      '<div class="callout-box-diag shadow-[6px_6px_0px_rgba(0,0,0,1)] border-4 border-swiss-black">' +
        '<div class="bg-swiss-black text-swiss-white px-3 py-1 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">' +
          '<span class="w-2 h-2 bg-[#e63946] rounded-full animate-pulse-fast"></span>' +
          data.name +
        '</div>' +
        '<div class="bg-swiss-white p-3 text-swiss-black font-bold uppercase text-[10px] space-y-1">' +
          '<div class="flex justify-between gap-6">' +
            '<span class="opacity-50">Filed:</span>' +
            '<span class="text-[#e63946] text-xs font-black">' + data.filed + '</span>' +
          '</div>' +
          '<div class="flex justify-between gap-6">' +
            '<span class="opacity-50">Solved:</span>' +
            '<span class="text-[#22c55e] text-xs font-black">' + data.solved + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="w-3 h-3 rounded-full bg-swiss-black border-2 border-[#e63946] absolute z-10 shadow-[0_0_10px_rgba(230,57,70,1)] animate-pulse-fast" style="top: -6px; left: -6px;"></div>' +
    '</div>';

    return L.divIcon({
      html: htmlString,
      className: 'blip-custom-icon',
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-transparent pointer-events-none overflow-visible">
      
      <MapContainer
        center={[22.5, 64.0]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        style={{ height: '100%', width: '100%', zIndex: 0, backgroundColor: 'transparent' }}
      >
        <GeoJSON 
          ref={geoJsonRef}
          data={geoData} 
          style={baseStyle}
        />
        
        {calloutData && (
          <Marker 
            position={[calloutData.lat, calloutData.lng]} 
            icon={createCustomIcon(calloutData)}
          />
        )}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-interactive {
          transition: fill-opacity 1s ease-in-out, fill 1s ease-in-out, stroke 1s ease-in-out, stroke-width 1s ease-in-out !important;
        }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-container { background: transparent !important; }
        
        .blip-custom-icon { pointer-events: none; }

        .callout-wrapper-diag {
          position: absolute;
          top: 0;
          left: 0;
        }

        .callout-line-diag-container {
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          background: #000;
          transform-origin: left top;
          animation: stretch-diag 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          z-index: 0;
        }

        .callout-line-diag {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          background: #e63946;
          transform-origin: left;
          animation: stretch-diag-red 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .callout-box-diag {
          position: absolute;
          opacity: 0;
          z-index: 10;
          width: max-content;
        }

        /* Dynamic Direction Classes */
        .dir-br .callout-line-diag-container { transform: rotate(45deg); }
        .dir-br .callout-box-diag { top: 85px; left: 85px; transform: translateY(20px); animation: fade-in-b 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; }

        .dir-bl .callout-line-diag-container { transform: rotate(135deg); }
        .dir-bl .callout-box-diag { top: 85px; right: 85px; transform: translateY(20px); animation: fade-in-b 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; }

        .dir-tr .callout-line-diag-container { transform: rotate(-45deg); }
        .dir-tr .callout-box-diag { bottom: 85px; left: 85px; transform: translateY(-20px); animation: fade-in-t 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; }

        .dir-tl .callout-line-diag-container { transform: rotate(-135deg); }
        .dir-tl .callout-box-diag { bottom: 85px; right: 85px; transform: translateY(-20px); animation: fade-in-t 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; }

        @keyframes stretch-diag {
          0% { width: 0px; }
          100% { width: 120px; }
        }

        @keyframes stretch-diag-red {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes fade-in-b {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0px); }
        }

        @keyframes fade-in-t {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0px); }
        }

        .animate-pulse-fast { animation: pulse-fast 1s infinite; }

        @keyframes pulse-fast {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(230,57,70,1); }
          50% { opacity: 0.4; box-shadow: 0 0 0px rgba(230,57,70,0); }
        }
      `}</style>
    </div>
  );
}