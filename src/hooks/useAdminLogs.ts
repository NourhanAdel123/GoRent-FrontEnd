import { useState, useEffect } from 'react';
import { adminService } from '../services/admin';
import { AdminLog, AdminUser } from '../types/admin';

export function useAdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [adminsMap, setAdminsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch logs and admins in parallel
        const [logsRes, adminsRes] = await Promise.all([
          adminService.getLogs({ page, limit: pageSize }),
          adminService.getAdmins()
        ]);
        
        // Create a lookup map: { adminId: adminName }
        const map: Record<string, string> = {};
        adminsRes.admins.forEach((admin: AdminUser) => {
          map[admin._id] = admin.name;
        });
        
        setAdminsMap(map);
        setLogs(logsRes.logs);
        setTotalPages(logsRes.pagination.totalPages);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء جلب السجلات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { logs, adminsMap, isLoading, error, page, setPage, totalPages };
}
