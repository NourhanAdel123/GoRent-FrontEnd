import React from 'react';
import BedIcon from '@mui/icons-material/KingBedOutlined';
import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFootOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ElevatorIcon from '@mui/icons-material/ElevatorOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { Property } from '@/types/property';

interface PropertyFeaturesProps {
  property: Property;
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const isResidential = property.type === 'APARTMENT';
  const bedrooms = property.specifications.apartment?.bedrooms;
  const bathrooms = property.specifications.apartment?.bathrooms;
  const hasElevator = property.specifications.apartment?.hasElevator;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-8 items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
          <SquareFootIcon />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">المساحة</p>
          <p className="text-lg font-bold text-gray-900">{property.squareFootage} متر مربع</p>
        </div>
      </div>

      {isResidential ? (
        <>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
              <BedIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">غرف النوم</p>
              <p className="text-lg font-bold text-gray-900">{bedrooms || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
              <BathtubIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">الحمامات</p>
              <p className="text-lg font-bold text-gray-900">{bathrooms || 0}</p>
            </div>
          </div>
          {hasElevator && (
            <div className="flex items-center gap-3">
              <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
                <ElevatorIcon />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">مصعد</p>
                <p className="text-lg font-bold text-gray-900">نعم</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
              <StorefrontIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">نوع العقار</p>
              <p className="text-lg font-bold text-gray-900">تجاري</p>
            </div>
          </div>

          {property.specifications?.shop?.electricityCapacity !== null && property.specifications?.shop?.electricityCapacity !== undefined && (
            <div className="flex items-center gap-3">
              <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
                <BoltIcon />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">قدرة الكهرباء</p>
                <p className="text-lg font-bold text-gray-900">{property.specifications.shop.electricityCapacity} واط</p>
              </div>
            </div>
          )}

          {property.specifications?.shop?.footTrafficTier && (
            <div className="flex items-center gap-3">
              <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
                <PeopleIcon />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">مستوى حركة المرور</p>
                <p className="text-lg font-bold text-gray-900">{property.specifications.shop.footTrafficTier}</p>
              </div>
            </div>
          )}

          {property.specifications?.shop?.commercialLicenseRequired !== null && property.specifications?.shop?.commercialLicenseRequired !== undefined && (
            <div className="flex items-center gap-3">
              <div className="bg-zinc-100 p-3 rounded-full text-zinc-700">
                <AssignmentIcon />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">رخصة تجارية مطلوبة</p>
                <p className="text-lg font-bold text-gray-900">{property.specifications.shop.commercialLicenseRequired ? 'نعم' : 'لا'}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
