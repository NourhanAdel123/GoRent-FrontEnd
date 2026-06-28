import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ContactMessage } from "../../types/contact";

interface MessageDeleteDialogProps {
  target: ContactMessage | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function MessageDeleteDialog({
  target,
  onClose,
  onConfirm,
}: MessageDeleteDialogProps) {
  return (
    <Dialog open={!!target} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>تأكيد حذف الرسالة</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          هل أنت متأكد من حذف رسالة{" "}
          <strong>{target?.name}</strong> بخصوص &quot;
          {target?.subject}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
        </Typography>
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
          تراجع
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
}
