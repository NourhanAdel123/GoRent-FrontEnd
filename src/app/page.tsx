"use client";

import PropertyCard from "@/components/property/PropertyCard";
import HeroSection from "@/components/home/HeroSection";
import { propertyService } from "@/services/property";
import { Property, PropertyFilters } from "@/types/property";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <HeroSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <Box
        className={viewMode === 'map' ? "w-full px-4 mt-8" : "max-w-7xl mx-auto px-4 w-full mt-16"}
      >
        <Box className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '1.5rem', md: '1.875rem' } }}>
            تصفح العقارات
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newView) => {
              if (newView !== null) setViewMode(newView);
            }}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              boxShadow: 1,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 1,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'background.default',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'background.default',
                  }
                }
              }
            }}
          >
            <ToggleButton value="grid">
              <ViewListIcon fontSize="small" sx={{ ml: 0.5 }} /> شبكة
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon fontSize="small" sx={{ ml: 0.5 }} /> خريطة
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

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
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    py: 5,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 1,
                  }}
                >
                  لم يتم العثور على عقارات في هذه المنطقة. حاول تعديل موقع الخريطة أو النطاق.
                </Box>
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
          <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
            لم يتم العثور على عقارات تطابق معاييرك.
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
}