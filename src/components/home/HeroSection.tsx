"use client";

import React from 'react';
import FilterBar from './FilterBar';
import { PropertyFilters } from "@/types/property";

interface HeroSectionProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: unknown) => void;
  onSearch: () => void;
}

export default function HeroSection({ filters, onFilterChange, onSearch }: HeroSectionProps) {
  return (
    <div
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center bg-cover bg-center py-16"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 text-center mt-12 gap-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
          Browse Homes, Apartments <br className="hidden md:block" /> & Rentals with Ease
        </h1>

        <FilterBar 
          filters={filters} 
          onFilterChange={onFilterChange} 
          onSearch={onSearch} 
        />
      </div>
    </div>
  );
}
