import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Rating, Alert, CircularProgress } from '@mui/material';
import { reviewService } from '@/services/review';
import { CreateReviewPayload } from '@/types/review';

interface AddReviewFormProps {
  propertyId: string;
  onReviewAdded: () => void;
}

export default function AddReviewForm({ propertyId, onReviewAdded }: AddReviewFormProps) {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError("الرجاء تحديد التقييم");
      return;
    }
    if (!comment.trim()) {
      setError("الرجاء كتابة تعليق");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload: CreateReviewPayload = {
        targetType: 'PROPERTY',
        propertyId,
        rating,
        comment,
      };

      await reviewService.createReview(payload);
      
      setSuccess(true);
      setRating(0);
      setComment('');
      onReviewAdded();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إضافة التقييم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 4, p: 3, bgcolor: '#f9fafb', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1f2937' }}>
        أضف تقييمك
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>تمت إضافة التقييم بنجاح</Alert>}
      
      <Box sx={{ mb: 2 }}>
        <Typography component="legend" sx={{ mb: 1, color: '#4b5563' }}>التقييم</Typography>
        <Rating
          name="property-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          sx={{ color: '#fbc02d' }}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="اكتب تقييمك هنا..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2, bgcolor: 'white' }}
      />

      <Button 
        type="submit" 
        variant="contained" 
        disabled={loading}
        sx={{ 
          bgcolor: '#86c5da', 
          color: 'white', 
          '&:hover': { bgcolor: '#6ab0c7' } 
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'إرسال التقييم'}
      </Button>
    </Box>
  );
}
