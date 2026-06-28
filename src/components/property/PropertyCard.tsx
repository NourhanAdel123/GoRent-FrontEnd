import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
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
      <Rating value={Math.round(rating)} precision={1} readOnly size="small" sx={{ color: '#fbc02d' }} />
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

  const isResidential = property.type === 'APARTMENT';
  const bedrooms = property.specifications?.apartment?.bedrooms;
  const bathrooms = property.specifications?.apartment?.bathrooms;

  // Handle ownerId whether it's populated or not
  const owner = typeof property.ownerId === 'string'
    ? { _id: property.ownerId, name: 'Owner', email: '' }
    : (property.ownerId as unknown as { _id: string; name: string; email: string; });

  return (
    <Link href={`/properties/${property._id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          position: 'relative',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
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
              backgroundColor: '#86c5da',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              letterSpacing: 1,
              borderRadius: 1,
              height: 24,
            }}
          />

          {/* Price Overlay */}
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
            alt={owner.name}
            src={`https://i.pravatar.cc/150?u=${owner._id}`} // Optional placeholder avatar
          >
            {owner.name.charAt(0)}
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
            {isResidential ? (
              <>
                {bedrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                    <BedIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    <Typography variant="body2">{bedrooms} غرف</Typography>
                  </Box>
                )}
                {bathrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                    <BathtubIcon fontSize="small" sx={{ opacity: 0.7 }} />
                    <Typography variant="body2">{bathrooms} حمام</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                <StorefrontIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography variant="body2">مساحة تجارية</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
              <SquareFootIcon fontSize="small" sx={{ opacity: 0.7 }} />
              <Typography variant="body2">{property.squareFootage} م²</Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'capitalize' }}>
            {property.type === 'APARTMENT' ? 'سكني' : property.type === 'SHOP' ? 'تجاري' : property.type}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
            <PropertyRating propertyId={property._id} ownerId={owner._id} />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
