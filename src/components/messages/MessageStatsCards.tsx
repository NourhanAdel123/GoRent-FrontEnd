import React from "react";
import { Box, Typography, Paper, Grid, Skeleton } from "@mui/material";

interface MessageStatsCardsProps {
  total: number;
  unreadCount: number;
  repliedCount: number;
  isLoading: boolean;
}

export default function MessageStatsCards({
  total,
  unreadCount,
  repliedCount,
  isLoading,
}: MessageStatsCardsProps) {
  const cards = [
    { label: "إجمالي الرسائل", value: total, color: "primary" },
    { label: "غير مقروءة", value: unreadCount, color: "warning.main" },
    { label: "تم الرد", value: repliedCount, color: "success.main" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 4 }}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              border: "1px solid #eaeaea",
              boxShadow: "none",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {card.label}
            </Typography>
            <Typography
              variant="h3"
              color={card.color}
              sx={{ mt: 1, fontWeight: "bold" }}
            >
              {isLoading ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={48}
                  sx={{ mx: "auto" }}
                />
              ) : (
                card.value
              )}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
