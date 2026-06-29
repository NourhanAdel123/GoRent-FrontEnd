import { useState, useCallback, useEffect } from "react";
import { adminService } from "../services/admin";
import { AdminUser } from "../types/admin";
import { useNotifications } from "./useNotifications";

export function useSuperAdmin() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useNotifications();

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getAdmins();
      setAdmins(data.admins);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تحميل المشرفين";
      setError(message);
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const promoteAdmin = async (email: string) => {
    try {
      setError(null);
      await adminService.promoteAdmin(email);
      showToast("تم ترقية المستخدم إلى مشرف بنجاح");
      await fetchAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل ترقية المستخدم";
      setError(message);
      showToast(message);
      throw err;
    }
  };

  const demoteAdmin = async (id: string) => {
    try {
      setError(null);
      await adminService.demoteAdmin(id);
      showToast("تم تجريد المشرف من صلاحياته بنجاح");
      await fetchAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تجريد المشرف";
      setError(message);
      showToast(message);
      throw err;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    isLoading,
    error,
    promoteAdmin,
    demoteAdmin,
    refreshAdmins: fetchAdmins,
  };
}
