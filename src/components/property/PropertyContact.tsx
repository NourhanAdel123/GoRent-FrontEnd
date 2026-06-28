"use client";

import React, { useState } from 'react';
import { Property } from '@/types/property';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingModal from './BookingModal';
import ViewingModal from './ViewingModal';

interface PropertyContactProps {
  property: Property;
}

export default function PropertyContact({ property }: PropertyContactProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  const owner = typeof property.ownerId === 'string'
    ? { _id: property.ownerId, name: 'Owner', email: '', avatar: undefined }
    : (property.ownerId as unknown as { _id: string; name: string; email: string; avatar?: string });

  const ownerAvatar = owner.avatar;

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
          position: 'sticky',
          top: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          تواصل مع المالك
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              position: 'relative',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'text.secondary',
              overflow: 'hidden',
              bgcolor: 'background.default',
            }}
          >
            <Image
              src={ownerAvatar || '/user-default.jpg'}
              alt={owner.name}
              fill
              className="object-cover"
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1.125rem' }}>
              {owner.name}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {owner.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.5, borderRadius: 1.5 }}
          >
            إرسال رسالة
          </Button>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            sx={{ py: 1.5, borderRadius: 1.5 }}
            onClick={() => setIsViewingModalOpen(true)}
          >
            طلب معاينة
          </Button>
          <Button
            variant="outlined"
            color="info"
            fullWidth
            sx={{ py: 1.5, borderRadius: 1.5 }}
            onClick={() => setIsModalOpen(true)}
          >
            احجز الآن
          </Button>
        </Box>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            معروض على GoRent • رقم المرجع: {property._id}
          </Typography>
        </Box>
      </Box>

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