"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertyService } from '@/services/property';
import { Property } from '@/types/property';
import dynamic from 'next/dynamic';
import PropertyHero from '@/components/property/PropertyHero';
import PropertyFeatures from '@/components/property/PropertyFeatures';
import PropertyContact from '@/components/property/PropertyContact';
import PropertyReviews from '@/components/property/PropertyReviews';

const PropertyMap = dynamic(() => import("@/components/home/PropertyMap"), { ssr: false });

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      propertyService.fetchPropertyById(id)
        .then((data) => {
          setProperty(data.property);
        })
        .catch((err) => {
          console.error("Failed to fetch property details", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
        <h2 className="text-2xl font-bold text-gray-800">العقار غير موجود</h2>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-900"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header Image Section */}
      <PropertyHero property={property} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Right Column: Details (RTL so lg:w-2/3 is on the right) */}
          <div className="w-full lg:w-2/3">

            {/* Key Features Bar */}
            <PropertyFeatures property={property} />

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">حول هذا العقار</h2>
              <div className="prose prose-zinc max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الموقع</h2>
              {property.location?.coordinates?.length >= 2 ? (
                <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  <PropertyMap
                    properties={[property]}
                    searchCenter={{ lat: property.location.coordinates[1], lng: property.location.coordinates[0] }}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-xl text-center text-gray-500">موقع الخريطة غير متوفر.</div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <PropertyReviews propertyId={property._id} />
            </div>

          </div>

          {/* Left Column: Sidebar Contact */}
          <div className="w-full lg:w-1/3">
            <PropertyContact property={property} />
          </div>

        </div>
      </div>
    </div>
  );
}
