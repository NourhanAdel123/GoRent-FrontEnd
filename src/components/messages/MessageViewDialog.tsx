import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ReplyIcon from "@mui/icons-material/Reply";
import { ContactMessage, ContactStatus } from "../../types/contact";
import { statusMap } from "./statusMap";

interface MessageViewDialogProps {
  message: ContactMessage | null;
  onClose: () => void;
  onUpdateStatus: (contactId: string, status: ContactStatus) => void;
  onStatusChanged: (updated: ContactMessage) => void;
}

export default function MessageViewDialog({
  message,
  onClose,
  onUpdateStatus,
  onStatusChanged,
}: MessageViewDialogProps) {
  if (!message) return null;

  const handleMarkAs = (status: ContactStatus) => {
    onUpdateStatus(message._id, status);
    onStatusChanged({ ...message, status });
  };

  return (
    <Dialog open={!!message} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EmailIcon color="primary" />
        {message.subject}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                المرسل
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {message.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                البريد الإلكتروني
              </Typography>
              <Typography variant="body1">{message.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                الحالة
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={statusMap[message.status].label}
                  color={statusMap[message.status].color}
                  size="small"
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                />
              </Box>
            </Box>
          </Box>

          {message.userId && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                حساب المستخدم
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {message.userId.name} — {message.userId.email}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              الرسالة
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                lineHeight: 1.8,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {message.message}
              </Typography>
            </Paper>
          </Box>

          <Typography variant="caption" color="text.secondary">
            تاريخ الإرسال:{" "}
            {new Date(message.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          إغلاق
        </Button>
        {message.status !== "READ" && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<MarkEmailReadIcon />}
            onClick={() => handleMarkAs("READ")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            تحديد كمقروءة
          </Button>
        )}
        {message.status !== "REPLIED" && (
          <Button
            variant="contained"
            color="success"
            startIcon={<ReplyIcon />}
            onClick={() => handleMarkAs("REPLIED")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            تم الرد
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
