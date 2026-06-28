import React, { useState } from 'react';
import { Box, Button, TextField, Rating, Typography, Alert, CircularProgress } from '@mui/material';
import { reviewService } from '@/services/review';
import { Review } from '@/types/review';

interface EditReviewFormProps {
  review: Review;
  onSaved: (updated: Review) => void;
  onCancel: () => void;
}

export default function EditReviewForm({ review, onSaved, onCancel }: EditReviewFormProps) {
  const [rating, setRating] = useState<number | null>(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await reviewService.updateReview(review._id, { rating, comment });
      onSaved(response.review);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تعديل التقييم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 1, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#0369a1' }}>
        تعديل التقييم
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

      <Box sx={{ mb: 1.5 }}>
        <Typography component="legend" variant="body2" sx={{ mb: 0.5, color: '#4b5563' }}>
          التقييم
        </Typography>
        <Rating
          name={`edit-rating-${review._id}`}
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          sx={{ color: '#fbc02d' }}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="اكتب تعليقك هنا..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 1.5, bgcolor: 'white' }}
        size="small"
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          size="small"
          sx={{ bgcolor: '#86c5da', color: 'white', '&:hover': { bgcolor: '#6ab0c7' } }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : 'حفظ التعديل'}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onCancel}
          disabled={loading}
          sx={{ borderColor: '#d1d5db', color: '#6b7280' }}
        >
          إلغاء
        </Button>
      </Box>
    </Box>
  );
}
