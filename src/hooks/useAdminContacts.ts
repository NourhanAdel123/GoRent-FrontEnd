"use client";

import { useState, useEffect } from "react";
import { contactService } from "../services/contact";
import {
  ContactMessage,
  ContactPagination,
  ContactStatus,
} from "../types/contact";

const PAGE_SIZE = 20;

export function useAdminContacts() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<ContactPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Shared reload helper — called from event handlers only (not from effects) */
  const reload = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.getMessages({
        page,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
      });
      setContacts(data.contacts);
      setPagination(data.pagination);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "فشل جلب الرسائل";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (contactId: string, status: ContactStatus) => {
    try {
      await contactService.updateStatus(contactId, status);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "فشل تحديث حالة الرسالة";
      setError(message);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      await contactService.deleteMessage(contactId);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "فشل حذف الرسالة";
      setError(message);
    }
  };

  // Initial load + re-fetch when page or filter changes
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await contactService.getMessages({
          page,
          limit: PAGE_SIZE,
          status: statusFilter || undefined,
        });
        if (!ignore) {
          setContacts(data.contacts);
          setPagination(data.pagination);
          setUnreadCount(data.unreadCount);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error ? err.message : "فشل جلب الرسائل";
          setError(message);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [page, statusFilter]);

  return {
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
  };
}
