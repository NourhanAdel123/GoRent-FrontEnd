"use client";

import React from 'react';
import { PropertyFilters } from "@/types/property";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';

interface FilterBarProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: unknown) => void;
  onSearch: () => void;
}

export default function FilterBar({ filters, onFilterChange, onSearch }: FilterBarProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-xl flex flex-col w-full max-w-6xl gap-4">
      {/* Top Row: Main Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">

        <div className="flex items-center px-2 md:px-4 py-2 w-full">
          <HomeIcon className="text-gray-400 mr-2" />
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-gray-500">نوع العقار</span>
            <select
              className="w-full text-sm font-medium text-gray-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
              value={filters.type || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
            >
              <option value="">أي نوع</option>
              <option value="APARTMENT">شقة</option>
              <option value="COMMERCIAL">محل تجاري</option>
            </select>
          </div>
        </div>

        <div className="flex items-center px-2 md:px-4 py-2 w-full">
          <AttachMoneyIcon className="text-gray-400 mr-2" />
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-gray-500">نطاق السعر</span>
            <div className="flex items-center gap-2 w-full">
              <input
                type="number"
                placeholder="الأدنى"
                className="w-1/2 text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="الأقصى"
                className="w-1/2 text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center px-2 md:px-4 py-2 w-full">
          <SquareFootIcon className="text-gray-400 mr-2" />
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-gray-500">المساحة (متر مربع)</span>
            <div className="flex items-center gap-2 w-full">
              <input
                type="number"
                placeholder="الأدنى"
                className="w-1/2 text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                value={filters.minSize || ''}
                onChange={(e) => onFilterChange('minSize', e.target.value ? Number(e.target.value) : undefined)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="الأقصى"
                className="w-1/2 text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                value={filters.maxSize || ''}
                onChange={(e) => onFilterChange('maxSize', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center px-2 md:px-4 py-2 w-full">
          <BedIcon className="text-gray-400 mr-2" />
          <div className="flex flex-col items-start w-full">
            <span className="text-xs font-semibold text-gray-500">الغرف</span>
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center w-1/2" title="غرف النوم">
                <input
                  type="number"
                  placeholder="نوم"
                  min="0"
                  className="w-full text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                  value={filters.bedrooms || ''}
                  onChange={(e) => onFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center w-1/2" title="الحمامات">
                <BathtubIcon className="text-gray-400 text-sm ml-1 hidden lg:block" />
                <input
                  type="number"
                  placeholder="حمامات"
                  min="0"
                  className="w-full text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 border-b border-transparent focus:border-gray-300 transition-colors"
                  value={filters.bathrooms || ''}
                  onChange={(e) => onFilterChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Search Button */}
      <div className="flex justify-end px-2 md:px-4 pt-2 border-t border-gray-100">
        <button
          onClick={onSearch}
          className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-900 text-white font-medium py-2.5 px-8 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <SearchIcon fontSize="small" />
          البحث عن عقارات
        </button>
      </div>
    </div>
  );
}
