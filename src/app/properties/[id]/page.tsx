"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertyServicenorhan } from '@/services/property';
import { Property } from '@/types/property';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PropertyHero from '@/components/property/PropertyHero';
import PropertyFeatures from '@/components/property/PropertyFeatures';
import PropertyContact from '@/components/property/PropertyContact';
import PropertyReviews from '@/components/property/PropertyReviews';

const PropertyMap = dynamic(() => import("@/components/home/PropertyMap"), { ssr: false });

// Shared entrance animation for content sections — keeps every block
// consistent without repeating the same sx object everywhere.
const fadeInUp = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(16px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  animation: 'fadeInUp 0.5s ease-out both',
};

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      propertyServicenorhan.fetchPropertyById(id)
        .then((data) => {
          setProperty(data.property);
        })
        .catch((err) => {
          console.error("Failed to fetch property details", err);
          setErrorMsg(err.message || "حدث خطأ");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
        <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: 320, md: 480 } }} />
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, mt: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6 }}>
            <Box sx={{ width: '100%', flex: { lg: 2 } }}>
              <Skeleton variant="rounded" height={80} sx={{ mb: 4, borderRadius: 3 }} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="80%" sx={{ mb: 4 }} />
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
            </Box>
            <Box sx={{ width: '100%', flex: { lg: 1 } }}>
              <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!property) {
    const isUnavailable = errorMsg === "Property is not available";

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: (theme) => theme.palette.mode === 'light' 
              ? (isUnavailable ? 'rgba(245, 158, 11, 0.08)' : 'rgba(220, 38, 38, 0.08)') 
              : (isUnavailable ? 'rgba(252, 211, 77, 0.08)' : 'rgba(248, 113, 113, 0.08)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: isUnavailable ? 'warning.main' : 'error.main',
            mb: 2,
          }}
        >
          {isUnavailable ? (
            <LockOutlinedIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
          ) : (
            <MapOutlinedIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {isUnavailable ? 'هذا العقار غير متاح حالياً' : 'العقار غير موجود'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/')}
          sx={{ px: 4, py: 1.5, borderRadius: 1.5 }}
        >
          العودة للرئيسية
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header Image Section */}
      <PropertyHero property={property} />

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, mt: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 6 }}>

          {/* Right Column: Details (RTL so flex: 2 is on the right) */}
          <Box sx={{ width: '100%', flex: { lg: 2 }, ...fadeInUp }}>

            {/* Key Features Bar */}
            <PropertyFeatures property={property} />

            {/* Description */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                حول هذا العقار
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.9,
                  whiteSpace: 'pre-line',
                  fontSize: '1.02rem',
                }}
              >
                {property.description}
              </Typography>
            </Box>

            {/* Map */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                الموقع
              </Typography>
              {property.location?.coordinates?.length >= 2 ? (
                <Paper
                  elevation={0}
                  sx={{
                    height: 400,
                    width: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'light'
                        ? '0 8px 24px rgba(15, 23, 42, 0.08)'
                        : '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <PropertyMap
                    properties={[property]}
                    searchCenter={{ lat: property.location.coordinates[1], lng: property.location.coordinates[0] }}
                  />
                </Paper>
              ) : (
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                    color: 'text.secondary',
                    border: '1px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <MapOutlinedIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                  <Typography>موقع الخريطة غير متوفر.</Typography>
                </Box>
              )}
            </Box>

            {/* Reviews */}
            <Box>
              <PropertyReviews propertyId={property._id} />
            </Box>

          </Box>

          {/* Left Column: Sidebar Contact — sticky so it stays in view while scrolling */}
          <Box
            sx={{
              width: '100%',
              flex: { lg: 1 },
              ...fadeInUp,
              animationDelay: '0.1s',
              alignSelf: 'flex-start',
              position: { lg: 'sticky' },
              top: { lg: 96 },
            }}
          >
            <PropertyContact property={property} />
          </Box>

        </Box>
      </Box>
    </Box>
  );
}