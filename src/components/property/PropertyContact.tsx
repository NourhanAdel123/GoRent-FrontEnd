"use client";

import React, { useState } from 'react';
import { Property } from '@/types/property';

import Image from 'next/image';
import BookingModal from './BookingModal';
import ViewingModal from './ViewingModal';

interface PropertyContactProps {
  property: Property;
}

export default function PropertyContact({ property }: PropertyContactProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">تواصل مع المالك</h3>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 relative rounded-full flex items-center justify-center text-xl font-bold text-zinc-600 overflow-hidden bg-zinc-200">
            <Image
              src={`https://i.pravatar.cc/150?u=${property.ownerId._id}`}
              alt={property.ownerId.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{property.ownerId.name}</p>
            <p className="text-sm text-gray-500">{property.ownerId.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 px-4 rounded-xl transition-colors">
            إرسال رسالة
          </button>
          <button
            onClick={() => setIsViewingModalOpen(true)}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold py-3 px-4 rounded-xl transition-colors border border-emerald-100"
          >
            طلب معاينة
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-4 rounded-xl transition-colors border border-blue-100"
          >
            احجز الآن
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">معروض على GoRent • رقم المرجع: {property._id}</p>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal
          propertyId={property._id}
          pricePerMonth={property.pricePerMonth}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isViewingModalOpen && (
        <ViewingModal
          propertyId={property._id}
          onClose={() => setIsViewingModalOpen(false)}
        />
      )}
    </>
  );
}
