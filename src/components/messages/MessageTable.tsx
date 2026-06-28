import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination as MuiPagination,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ContactMessage, ContactPagination } from "../../types/contact";
import { statusMap } from "./statusMap";

interface MessageTableProps {
  contacts: ContactMessage[];
  pagination: ContactPagination;
  page: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onOpenMessage: (msg: ContactMessage) => void;
  onMarkReplied: (contactId: string) => void;
  onDeleteClick: (msg: ContactMessage) => void;
}

export default function MessageTable({
  contacts,
  pagination,
  page,
  isLoading,
  onPageChange,
  onOpenMessage,
  onMarkReplied,
  onDeleteClick,
}: MessageTableProps) {
  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: "1px solid #eaeaea",
        boxShadow: "none",
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: "bold" }}>المرسل</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>البريد الإلكتروني</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>الموضوع</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>التاريخ</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                الإجراءات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Loading skeleton */}
            {isLoading &&
              [1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <EmailIcon
                      sx={{ fontSize: 56, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      لا توجد رسائل
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading &&
              contacts.map((msg) => (
                <TableRow
                  key={msg._id}
                  hover
                  sx={{
                    cursor: "pointer",
                    bgcolor:
                      msg.status === "UNREAD"
                        ? "rgba(237, 108, 2, 0.04)"
                        : "inherit",
                  }}
                  onClick={() => onOpenMessage(msg)}
                >
                  <TableCell
                    sx={{
                      fontWeight: msg.status === "UNREAD" ? 700 : 600,
                    }}
                  >
                    {msg.name}
                  </TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: msg.status === "UNREAD" ? 700 : 400,
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.subject}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[msg.status].label}
                      color={statusMap[msg.status].color}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(msg.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip title="عرض">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onOpenMessage(msg)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="تم الرد">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => onMarkReplied(msg._id)}
                        disabled={msg.status === "REPLIED"}
                      >
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(msg)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
            borderTop: "1px solid #eaeaea",
          }}
        >
          <MuiPagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Paper>
  );
}
