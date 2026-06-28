import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Rating,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import BedIcon from '@mui/icons-material/KingBedOutlined';
import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFootOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import { PropertyCardProps } from '../../types/property';
import { reviewService } from '@/services/review';

function PropertyRating({ propertyId, ownerId }: { propertyId: string, ownerId: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    // Fetch reviews by propertyId (targetType: PROPERTY)
    reviewService.fetchReviews({ propertyId, targetType: 'PROPERTY' })
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          const sum = data.reviews.reduce((acc, rev) => acc + rev.rating, 0);
          setRating(sum / data.reviews.length);
          setReviewCount(data.reviews.length);
        } else {
          setRating(0);
          setReviewCount(0);
        }
      })
      .catch(err => {
        console.error("Failed to fetch reviews for card", err);
      });
  }, [propertyId, ownerId]);

  if (rating === null) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">جاري التحميل...</Typography>
      </Box>
    );
  }

  if (rating === 0) {
    return (
      <Typography variant="body2" color="text.secondary">لا توجد تقييمات</Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, direction: 'ltr' }}>
      <Rating
        value={Math.round(rating)}
        precision={1}
        readOnly
        size="small"
        sx={{ color: 'warning.main' }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        {rating.toFixed(1)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        ({reviewCount})
      </Typography>
    </Box>
  );
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Use a placeholder if images array is empty
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=800&q=80';

  // FIX: the real Property type is "APARTMENT" | "SHOP" (not "RESIDENTIAL" /
  // "COMMERCIAL" as it was before) — this previously meant the apartment
  // branch could never be reached and amenities/labels were always wrong.
  const isApartment = property.type === 'APARTMENT';
  const bedrooms = property.specifications.apartment?.bedrooms;
  const bathrooms = property.specifications.apartment?.bathrooms;
  const footTrafficTier = property.specifications.shop?.footTrafficTier;

  const typeLabel = property.type === 'APARTMENT'
    ? 'شقة'
    : property.type === 'SHOP'
      ? 'محل تجاري'
      : property.type;

  return (
    <Link href={`/properties/${property._id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          maxWidth: 345,
          bgcolor: 'background.paper',
          borderRadius: 2,
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 4px 12px rgba(15, 23, 42, 0.08)'
              : '0 4px 12px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? '0 12px 24px rgba(15, 23, 42, 0.15)'
                : '0 12px 24px rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'relative', height: 220, width: '100%' }}>
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.95)' }}
            />
          </Box>

          {/* Featured Chip */}
          <Chip
            label="مميز"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              letterSpacing: 1,
              borderRadius: 1,
              height: 24,
            }}
          />

          {/* Price Overlay — text stays white intentionally: it sits on top
              of the property photo, not on the theme background, so it must
              stay readable regardless of light/dark mode. */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              display: 'flex',
              alignItems: 'baseline',
              color: 'white',
              textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
              {property.pricePerMonth}
            </Typography>
            <Typography variant="body2" component="span" sx={{ ml: 0.5, mr: 0.5 }}>
              ج.م/شهر
            </Typography>
          </Box>

          {/* Owner Avatar */}
          <Avatar
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              border: '2px solid white',
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            alt={property.ownerId.name}
            src={`https://i.pravatar.cc/150?u=${property.ownerId._id}`} // Optional placeholder avatar
          >
            {property.ownerId.name.charAt(0)}
          </Avatar>
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
            {property.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.description}
          </Typography>

          {/* Amenities */}
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
            {isApartment ? (
              <>
                {bedrooms != null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                    <BedIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    <Typography variant="body2">{bedrooms} غرف</Typography>
                  </Box>
                )}
                {bathrooms != null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                    <BathtubIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    <Typography variant="body2">{bathrooms} حمام</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                <StorefrontIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography variant="body2">
                  {footTrafficTier ? `حركة عملاء: ${footTrafficTier}` : 'مساحة تجارية'}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
              <SquareFootIcon fontSize="small" sx={{ opacity: 0.7 }} />
              <Typography variant="body2">{property.squareFootage} م²</Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'capitalize' }}>
            {typeLabel}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <PropertyRating propertyId={property._id} ownerId={property.ownerId._id} />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}