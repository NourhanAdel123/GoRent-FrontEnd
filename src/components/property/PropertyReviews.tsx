import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Rating, Divider, CircularProgress, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { reviewService } from '@/services/review';
import { Review } from '@/types/review';
import AddReviewForm from './AddReviewForm';
import EditReviewForm from './EditReviewForm';
import RatingBreakdown from './RatingBreakdown';

interface PropertyReviewsProps {
  targetUserId?: string;
  propertyId?: string;
}

export default function PropertyReviews({ targetUserId, propertyId }: PropertyReviewsProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(!!(targetUserId || propertyId));
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Incrementing refreshKey re-triggers the effect to reload reviews
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!targetUserId && !propertyId) return;

    // Async function defined inside effect — linter-safe pattern
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.fetchReviews({ targetUserId, propertyId });
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setError("فشل في تحميل التقييمات");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [targetUserId, propertyId, refreshKey]);

  const handleDelete = async (reviewId: string) => {
    try {
      setDeletingId(reviewId);
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Merge only the updated fields — the API returns authorId as a plain string
  // (not populated), so we preserve the existing review object's authorId
  const handleReviewSaved = (updated: Review) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === updated._id
          ? { ...r, rating: updated.rating, comment: updated.comment, updatedAt: updated.updatedAt }
          : r
      )
    );
    setEditingId(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
    );
  }

  const displayedReviews = filterRating 
    ? reviews.filter(r => Math.floor(r.rating) === filterRating)
    : reviews;

  return (
    <Box sx={{ mt: 2 }}>
      {propertyId && <AddReviewForm propertyId={propertyId} onReviewAdded={triggerRefresh} />}

      {reviews.length === 0 ? (
        <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">لا توجد تقييمات حتى الآن</Typography>
        </Box>
      ) : (
        <>
          <RatingBreakdown 
            reviews={reviews} 
            selectedRating={filterRating} 
            onRatingSelect={setFilterRating} 
          />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
            التقييمات ({displayedReviews.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {displayedReviews.map((review, index) => {
              const isAuthor = currentUser?._id === review.authorId._id;
              const isDeleting = deletingId === review._id;
              const isEditing = editingId === review._id;

              return (
                <Box key={review._id}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      {review.authorId.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {review.authorId.name}
                        </Typography>

                        {isAuthor && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {/* Edit button */}
                            <Tooltip title="تعديل التقييم">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => setEditingId(isEditing ? null : review._id)}
                                  disabled={isDeleting}
                                  sx={{ color: 'info.main', '&:hover': { bgcolor: 'info.light', color: 'info.dark' } }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            {/* Delete button */}
                            <Tooltip title="حذف التقييم">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(review._id)}
                                  disabled={isDeleting || isEditing}
                                  sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light', color: 'error.dark' } }}
                                >
                                  {isDeleting
                                    ? <CircularProgress size={16} color="inherit" />
                                    : <DeleteIcon fontSize="small" />
                                  }
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>

                      {/* Inline edit form — shown when editing this review */}
                      {isEditing ? (
                        <EditReviewForm
                          review={review}
                          onSaved={handleReviewSaved}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {review.comment}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  {index < displayedReviews.length - 1 && <Divider sx={{ mt: 3 }} />}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}