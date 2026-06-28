import React from 'react';
import BedIcon from '@mui/icons-material/KingBedOutlined';
import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFootOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ElevatorIcon from '@mui/icons-material/ElevatorOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Property } from '@/types/property';

interface PropertyFeaturesProps {
  property: Property;
}

// استخراج كومبوننت صغير للستايل المتكرر
function FeatureItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          bgcolor: 'background.default',
          p: 1.5,
          borderRadius: '50%',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'text.primary' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const isResidential = property.type === 'APARTMENT';
  const bedrooms = property.specifications?.apartment?.bedrooms;
  const bathrooms = property.specifications?.apartment?.bathrooms;
  const hasElevator = property.specifications?.apartment?.hasElevator;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 5,
      }}
    >
      <FeatureItem
        icon={<SquareFootIcon />}
        label="المساحة"
        value={`${property.squareFootage} متر مربع`}
      />

      {isResidential ? (
        <>
          <FeatureItem
            icon={<BedIcon />}
            label="غرف النوم"
            value={bedrooms || 0}
          />
          <FeatureItem
            icon={<BathtubIcon />}
            label="الحمامات"
            value={bathrooms || 0}
          />
          {hasElevator && (
            <FeatureItem
              icon={<ElevatorIcon />}
              label="مصعد"
              value="نعم"
            />
          )}
        </>
      ) : (
        <>
          <FeatureItem
            icon={<StorefrontIcon />}
            label="نوع العقار"
            value="تجاري"
          />

          {property.specifications?.shop?.electricityCapacity !== null && property.specifications?.shop?.electricityCapacity !== undefined && (
            <FeatureItem
              icon={<BoltIcon />}
              label="قدرة الكهرباء"
              value={`${property.specifications.shop.electricityCapacity} واط`}
            />
          )}

          {property.specifications?.shop?.footTrafficTier && (
            <FeatureItem
              icon={<PeopleIcon />}
              label="مستوى حركة المرور"
              value={property.specifications.shop.footTrafficTier}
            />
          )}

          {property.specifications?.shop?.commercialLicenseRequired !== null && property.specifications?.shop?.commercialLicenseRequired !== undefined && (
            <FeatureItem
              icon={<AssignmentIcon />}
              label="رخصة تجارية مطلوبة"
              value={property.specifications.shop.commercialLicenseRequired ? 'نعم' : 'لا'}
            />
          )}
        </>
      )}
    </Box>
  );
}