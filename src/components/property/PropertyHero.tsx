'use client';
import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Property } from '@/types/property';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PropertyHeroProps {
  property: Property;
}

export default function PropertyHero({ property }: PropertyHeroProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=2000&q=80'];

  // Translate type to Arabic
  const propertyTypeMap: Record<string, string> = {
    'RESIDENTIAL': 'سكني',
    'SHOP': 'تجاري',
    'APARTMENT': 'شقة',
    'VILLA': 'فيلا',
    'HOUSE': 'منزل',
  };
  const typeAr = propertyTypeMap[property.type] || property.type;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-zinc-50 pt-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Header / Top Info */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-zinc-200"
          >
            <ArrowBackIcon sx={{ transform: 'scaleX(-1)' }} />
            <span className="font-semibold">عودة</span>
          </button>
          <span className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider">
            {typeAr}
          </span>
        </div>

        {/* Title & Price Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">{property.title}</h1>
            {property.location?.coordinates?.length >= 2 && (
              <p className="text-zinc-500 flex items-center gap-1 font-medium">
                <LocationOnIcon fontSize="small" />
                إحداثيات الموقع: {property.location.coordinates[0]}, {property.location.coordinates[1]}
              </p>
            )}
          </div>
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm min-w-[200px] text-left rtl:text-right">
            <p className="text-zinc-500 text-sm mb-1 uppercase font-semibold">الإيجار الشهري</p>
            <p className="text-3xl font-bold text-blue-600">{property.pricePerMonth.toLocaleString()} <span className="text-xl text-zinc-500 font-medium">ج.م</span></p>
          </div>
        </div>

        {/* Main Image Carousel */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg bg-zinc-200 group">
          <Image
            src={images[currentIndex]}
            alt={`${property.title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all shadow-md ${idx === currentIndex ? 'bg-pink-400 w-8' : 'bg-zinc-400/80 hover:bg-white w-2.5'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails below */}
        {images.length > 1 && (
          <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden transition-all ${idx === currentIndex
                    ? 'ring-4 ring-pink-300 ring-offset-2 opacity-100'
                    : 'opacity-70 hover:opacity-100 border border-zinc-300'
                  }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
