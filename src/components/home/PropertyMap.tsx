"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '@/types/property';

// Fix Leaflet's default icon path issues with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface PropertyMapProps {
  properties: Property[];
  searchCenter?: { lat: number; lng: number };
  searchRadius?: number; // in meters
  onMapClick?: (lat: number, lng: number, radius?: number) => void;
}

// A helper component to handle map clicks
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

// A helper to recenter the map when searchCenter changes
function MapRecenter({ center }: { center?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
}

export default function PropertyMap({ properties, searchCenter, searchRadius, onMapClick }: PropertyMapProps) {
  // Default center
  const defaultCenter: [number, number] = [30.0444, 31.2357];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [radiusInput, setRadiusInput] = React.useState(searchRadius || 5000);

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (onMapClick) {
          // Fake a map click to update the parent filters and center
          onMapClick(lat, lng, radiusInput);
        }
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setRadiusInput(val);
  };

  const applyRadius = () => {
    if (onMapClick && searchCenter) {
      onMapClick(searchCenter.lat, searchCenter.lng, radiusInput);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">

      {/* Overlay Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-xl p-3 flex flex-col md:flex-row gap-4 items-center w-[90%] md:w-auto">
        <form onSubmit={handleSearchLocation} className="flex gap-2">
          <input
            type="text"
            placeholder="Search location (e.g. Cairo)"
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-zinc-800 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-zinc-900">
            Find
          </button>
        </form>

        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4 w-full md:w-auto">
          <span className="text-xs text-gray-500 font-medium">Radius:</span>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={radiusInput}
            onChange={handleRadiusChange}
            onMouseUp={applyRadius}
            onTouchEnd={applyRadius}
            className="w-24 md:w-32"
          />
          <span className="text-xs font-semibold">{radiusInput / 1000}km</span>
        </div>
      </div>

      <MapContainer
        center={searchCenter ? [searchCenter.lat, searchCenter.lng] : defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapEvents onMapClick={(lat, lng) => onMapClick && onMapClick(lat, lng, radiusInput)} />
        <MapRecenter center={searchCenter} />

        {searchCenter && searchRadius && (
          <Circle
            center={[searchCenter.lat, searchCenter.lng]}
            radius={searchRadius}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
          />
        )}

        {properties.map((property) => {
          if (!property.location?.coordinates || property.location.coordinates.length < 2) return null;
          // Note: GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
          const [lng, lat] = property.location.coordinates;

          return (
            <Marker key={property._id} position={[lat, lng]} icon={icon}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="w-48">
                  {property.images && property.images.length > 0 && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-24 object-cover mb-2 rounded-md"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                  <p className="text-sm font-bold text-blue-600">${property.pricePerMonth} / month</p>
                  <p className="text-xs text-gray-500 capitalize">{property.type.toLowerCase()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
