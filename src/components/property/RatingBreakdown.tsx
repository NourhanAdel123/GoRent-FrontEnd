import React from 'react';
import { Box, Typography, Rating, LinearProgress, Paper } from '@mui/material';
import { Review } from '@/types/review';

interface RatingBreakdownProps {
  reviews: Review[];
  selectedRating: number | null;
  onRatingSelect: (rating: number | null) => void;
}

export default function RatingBreakdown({ reviews, selectedRating, onRatingSelect }: RatingBreakdownProps) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;

  const handleRowClick = (stars: number) => {
    if (selectedRating === stars) {
      onRatingSelect(null); // Clear filter if clicking same row
    } else {
      onRatingSelect(stars);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
        تقييمات العملاء
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: { md: 'flex-start' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 150 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={averageRating} precision={0.1} readOnly size="large" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {averageRating.toFixed(1)} من 5
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {totalReviews} تقييم إجمالي
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = selectedRating === stars;

            return (
              <Box
                key={stars}
                onClick={() => handleRowClick(stars)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  p: 0.5,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  border: isSelected ? '1px solid' : '1px solid transparent',
                  borderColor: isSelected ? 'divider' : 'transparent',
                  '&:hover': {
                    bgcolor: isSelected ? 'action.selected' : 'action.hover',
                  },
                }}
              >
                <Typography sx={{ width: 50, color: 'info.main', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {stars} نجوم
                </Typography>
                
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 18,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        bgcolor: 'warning.main',
                      },
                    }}
                  />
                </Box>
                
                <Typography sx={{ width: 45, textAlign: 'left', color: 'info.main' }}>
                  {percentage}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
