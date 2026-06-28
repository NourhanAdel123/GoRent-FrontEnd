"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAdminContacts } from "../../../../hooks/useAdminContacts";
import { ContactMessage, ContactStatus } from "../../../../types/contact";
import MessageStatsCards from "../../../../components/messages/MessageStatsCards";
import MessageTable from "../../../../components/messages/MessageTable";
import MessageViewDialog from "../../../../components/messages/MessageViewDialog";
import MessageDeleteDialog from "../../../../components/messages/MessageDeleteDialog";

export default function AdminMessagesPage() {
  const {
    contacts,
    pagination,
    unreadCount,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    updateStatus,
    deleteContact,
  } = useAdminContacts();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      updateStatus(msg._id, "READ");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteContact(deleteTarget._id);
      setDeleteTarget(null);
      if (selectedMessage?._id === deleteTarget._id) {
        setSelectedMessage(null);
      }
    }
  };

  const repliedCount = contacts.filter((c) => c.status === "REPLIED").length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        رسائل التواصل
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        عرض وإدارة جميع الرسائل الواردة من نموذج &quot;تواصل معنا&quot;.
      </Typography>

      {/* Stats Cards */}
      <MessageStatsCards
        total={pagination.total}
        unreadCount={unreadCount}
        repliedCount={repliedCount}
        isLoading={isLoading}
      />

      {/* Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">تصفية حسب الحالة</InputLabel>
          <Select
            labelId="status-filter-label"
            label="تصفية حسب الحالة"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ContactStatus | "");
              setPage(1);
            }}
          >
            <MenuItem value="">جميع الرسائل</MenuItem>
            <MenuItem value="UNREAD">غير مقروءة</MenuItem>
            <MenuItem value="READ">مقروءة</MenuItem>
            <MenuItem value="REPLIED">تم الرد</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Messages Table */}
      <MessageTable
        contacts={contacts}
        pagination={pagination}
        page={page}
        isLoading={isLoading}
        onPageChange={setPage}
        onOpenMessage={handleOpenMessage}
        onMarkReplied={(id) => updateStatus(id, "REPLIED")}
        onDeleteClick={setDeleteTarget}
      />

      {/* View Message Dialog */}
      <MessageViewDialog
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onUpdateStatus={updateStatus}
        onStatusChanged={setSelectedMessage}
      />

      {/* Delete Confirmation Dialog */}
      <MessageDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
