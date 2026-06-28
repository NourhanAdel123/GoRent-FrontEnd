'use client';

import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { Property } from '@/types/property';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PropertyHeroProps {
  property: Property;
}

export default function PropertyHero({ property }: PropertyHeroProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // FIX: previously fell back to a plain string when there were no images,
  // which broke `images.length` and `images[currentIndex]` (string indexing
  // instead of array indexing). Now always an array, same intent.
  const images: string[] = property.images && property.images.length > 0
    ? property.images
    : ["/no-image-available.jpeg"];

  // Translate type to Arabic
  const propertyTypeMap: Record<string, string> = {
    'SHOP': 'تجاري',
    'APARTMENT': 'شقة',
  };
  const typeAr = propertyTypeMap[property.type] || property.type;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        pt: 6,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ maxWidth: 1152, mx: 'auto', px: { xs: 2, md: 3 } }}>

        {/* Header / Top Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button
            startIcon={<ArrowForwardIcon />}
            onClick={() => router.back()}
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderColor: 'divider',
              px: 2,
              py: 1,
              borderRadius: 50,
              boxShadow: 1,
              fontWeight: 600,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 3,
                transform: 'translateX(2px)',
              },
            }}
            variant="outlined"
          >
            عودة
          </Button>
          <Box
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
              px: 2.5,
              py: 0.85,
              borderRadius: 50,
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            {typeAr}
          </Box>
        </Box>

        {/* Title & Price Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
            animation: 'fadeInUp 0.5s ease-out both',
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: 'text.primary',
                mb: 0.75,
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.5px',
              }}
            >
              {property.title}
            </Typography>
            {property.location?.coordinates?.length >= 2 && (
              <Typography sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                إحداثيات الموقع: {property.location.coordinates[0]}, {property.location.coordinates[1]}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderInlineStart: '4px solid',
              borderInlineStartColor: 'primary.main',
              p: 2.25,
              borderRadius: 3,
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0 8px 24px rgba(15, 23, 42, 0.1)'
                  : '0 8px 24px rgba(0, 0, 0, 0.5)',
              minWidth: 220,
              textAlign: 'start',
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 0.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>
              الإيجار الشهري
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 800, lineHeight: 1.1 }}>
              {property.pricePerMonth.toLocaleString()}{' '}
              <Typography component="span" sx={{ fontSize: '1.1rem', color: 'text.secondary', fontWeight: 600 }}>
                ج.م
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Main Image Carousel */}
        <Box
          className="group"
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: { xs: '4/3', md: '21/9' },
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? '0 20px 50px rgba(15, 23, 42, 0.18)'
                : '0 20px 50px rgba(0, 0, 0, 0.6)',
            bgcolor: 'background.default',
            animation: 'fadeInUp 0.6s ease-out both',
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`${property.title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />

          {/* Bottom gradient for depth + legibility of the counter badge */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Image counter */}
          {images.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                insetInlineStart: 20,
                bgcolor: 'rgba(0,0,0,0.55)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 50,
                fontSize: '0.8rem',
                fontWeight: 600,
                backdropFilter: 'blur(6px)',
                zIndex: 10,
              }}
            >
              {currentIndex + 1} / {images.length}
            </Box>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Left Arrow (Visually Next in RTL) */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
                  color: 'text.primary',
                  p: 1.5,
                  borderRadius: '50%',
                  boxShadow: 4,
                  backdropFilter: 'blur(4px)',
                  opacity: { xs: 1, md: 0 },
                  transition: 'opacity 0.2s, transform 0.15s',
                  cursor: 'pointer',
                  '.group:hover &': { opacity: 1 },
                  '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.08)' },
                  zIndex: 10,
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
              </Box>

              {/* Right Arrow (Visually Prev in RTL) */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
                  color: 'text.primary',
                  p: 1.5,
                  borderRadius: '50%',
                  boxShadow: 4,
                  backdropFilter: 'blur(4px)',
                  opacity: { xs: 1, md: 0 },
                  transition: 'opacity 0.2s, transform 0.15s',
                  cursor: 'pointer',
                  '.group:hover &': { opacity: 1 },
                  '&:hover': { bgcolor: 'background.paper', transform: 'translateY(-50%) scale(1.08)' },
                  zIndex: 10,
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
              </Box>

              {/* Dots */}
              <Box sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1, zIndex: 10 }}>
                {images.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    sx={{
                      height: 10,
                      borderRadius: '50px',
                      transition: 'all 0.3s',
                      boxShadow: 2,
                      cursor: 'pointer',
                      width: idx === currentIndex ? 32 : 10,
                      bgcolor: idx === currentIndex ? 'secondary.main' : 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { bgcolor: idx === currentIndex ? 'secondary.main' : '#ffffff' },
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* Thumbnails below */}
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              overflowX: 'auto',
              pb: 2,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {images.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  position: 'relative',
                  width: 112,
                  height: 112,
                  flexShrink: 0,
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  opacity: idx === currentIndex ? 1 : 0.65,
                  outline: idx === currentIndex ? '3px solid' : 'none',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                  border: idx === currentIndex ? 'none' : '1px solid',
                  borderColor: 'divider',
                  '&:hover': { opacity: 1, transform: 'translateY(-2px)' },
                }}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </Box>
            ))}
          </Box>
        )}

      </Box>
    </Box>
  );
}