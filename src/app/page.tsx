"use client";

import PropertyCard from "@/components/property/PropertyCard";
import HeroSection from "@/components/home/HeroSection";
import { propertyService } from "@/services/property";
import { Property, PropertyFilters } from "@/types/property";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';

const PropertyMap = dynamic(() => import("@/components/home/PropertyMap"), { ssr: false });

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<PropertyFilters>({
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    minSize: undefined,
    maxSize: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    lng: undefined,
    lat: undefined,
    radius: undefined,
  });

  const fetchProperties = (currentFilters: PropertyFilters) => {
    propertyService.fetchProperties(currentFilters).then((data) => {
      setProperties(data.properties);
    });
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const handleSearch = () => {
    fetchProperties(filters);
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMapClick = (lat: number, lng: number, radius?: number) => {
    const r = radius || 5000;
    const newFilters = { ...filters, lat, lng, radius: r };
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans pb-16">
      <HeroSection 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSearch={handleSearch} 
      />

      {/* Main Content */}
      <div className={viewMode === 'map' ? "w-full px-4 mt-8" : "max-w-7xl mx-auto px-4 w-full mt-16"}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-zinc-900">
            Browse the Properties
          </h2>
          
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ViewListIcon fontSize="small" /> Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-zinc-100 text-zinc-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MapIcon fontSize="small" /> Map
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start h-[calc(100vh-200px)] min-h-[600px]">
            <div className="w-full lg:w-1/2 h-full">
              <PropertyMap 
                properties={properties} 
                searchCenter={filters.lat && filters.lng ? { lat: filters.lat, lng: filters.lng } : undefined}
                searchRadius={filters.radius}
                onMapClick={handleMapClick}
              />
            </div>
            <div className="w-full lg:w-1/2 h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
              {properties.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
                  No properties found in this area. Try adjusting the map location or radius.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No properties found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
