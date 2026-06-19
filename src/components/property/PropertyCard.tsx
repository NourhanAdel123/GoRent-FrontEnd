import React from 'react';
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
import BedIcon from '@mui/icons-material/KingBedOutlined';
import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import SquareFootIcon from '@mui/icons-material/SquareFootOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import { PropertyCardProps } from '../../types/property';



export default function PropertyCard({ property }: PropertyCardProps) {
  // Use a placeholder if images array is empty
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=800&q=80';

  const isResidential = property.type === 'RESIDENTIAL';
  const bedrooms = property.specifications.apartment?.bedrooms;
  const bathrooms = property.specifications.apartment?.bathrooms;

  return (
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
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={property.title}
          sx={{ filter: 'brightness(0.95)' }}
        />

        {/* Featured Chip */}
        <Chip
          label="FEATURED"
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
            ${property.pricePerMonth}
          </Typography>
          <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
            /month
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
          {isResidential ? (
            <>
              {bedrooms && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                  <BedIcon fontSize="small" sx={{ opacity: 0.7 }} />
                  <Typography variant="body2">{bedrooms} Bedrooms</Typography>
                </Box>
              )}
              {bathrooms && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                  <BathtubIcon fontSize="small" sx={{ opacity: 0.7 }} />
                  <Typography variant="body2">{bathrooms} Baths</Typography>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
              <StorefrontIcon fontSize="small" sx={{ opacity: 0.7 }} />
              <Typography variant="body2">Commercial Space</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
            <SquareFootIcon fontSize="small" sx={{ opacity: 0.7 }} />
            <Typography variant="body2">{property.squareFootage} sqft</Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'capitalize' }}>
          {property.type.toLowerCase()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={5} readOnly size="small" sx={{ color: '#fbc02d' }} />
            <Typography variant="body2" color="text.secondary">
              Excellent
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
