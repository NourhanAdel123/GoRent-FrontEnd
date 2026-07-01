"use client";

import PropertyCard from "@/components/property/PropertyCard";
import HeroSection from "@/components/home/HeroSection";
import { propertyServicenorhan } from "@/services/property";
import { Property, PropertyFilters } from "@/types/property";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

const PropertyMap = dynamic(() => import("@/components/home/PropertyMap"), {
  ssr: false,
});

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const listRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState({ page: 1, limit: 9, totalPages: 1, totalItems: 0 });
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 9,
    type: "",
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
    setIsLoading(true);
    propertyServicenorhan.fetchProperties(currentFilters).then((data) => {
      setProperties(data.properties);
      if (data.pagination) {
        setPaginationMeta(data.pagination);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newFilters = { ...filters, page: value };
    setFilters(newFilters);
    fetchProperties(newFilters);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const handleSearch = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleMapClick = (lat: number, lng: number, radius?: number) => {
    const r = radius || 5000;
    const newFilters = { ...filters, lat, lng, radius: r, page: 1 };
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
        ref={listRef}
        className={viewMode === 'map' ? "w-full px-4 mt-8" : "max-w-7xl mx-auto px-4 w-full mt-16"}
        sx={{ scrollMarginTop: '80px' }}
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

        {viewMode === "map" ? (
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
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 10 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : properties.length === 0 ? (
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    {properties.map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>
                  {paginationMeta.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                      <Pagination
                        count={paginationMeta.totalPages}
                        page={paginationMeta.page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
            لم يتم العثور على عقارات تطابق معاييرك.
          </Box>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            {paginationMeta.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Pagination
                  count={paginationMeta.totalPages}
                  page={paginationMeta.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}