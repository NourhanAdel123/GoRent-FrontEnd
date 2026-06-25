"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminUser } from "../types/admin";
import { adminService } from "../services/admin";

const PAGE_SIZE = 10;

export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<"all" | AdminUser["role"]>("all");
    const [totalActive, setTotalActive] = useState(0);
    const [totalSuspended, setTotalSuspended] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getUsers({
                page,
                limit: PAGE_SIZE,
                role: roleFilter === "all" ? undefined : roleFilter,
            });
            setUsers(data.users);
            setTotalItems(data.pagination.totalItems);
            setTotalPages(data.pagination.totalPages);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "فشل جلب المستخدمين";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [page, roleFilter]);

    const fetchCounts = useCallback(async () => {
        try {
            const counts = await adminService.getUserCounts();
            setTotalActive(counts.totalActive);
            setTotalSuspended(counts.totalSuspended);
        } catch {
        }
    }, []);

    const toggleUserStatus = async (id: string, currentStatus: AdminUser["status"]) => {
        try {
            await adminService.toggleUserStatus(id, currentStatus);
            // Refetch the page we're already on (not page 1) so the admin
            // doesn't lose their place, plus the global counts since a
            // ban/unban just changed the active/suspended split.
            await Promise.all([fetchUsers(), fetchCounts()]);
        } catch (err) {
            const message = err instanceof Error ? err.message : "فشل تحديث حالة المستخدم";
            setError(message);
        }
    };

    const changeRoleFilter = (role: "all" | AdminUser["role"]) => {
        setRoleFilter(role);
        setPage(1); // a new filter means a new result set — start from page 1
    };
    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getUsers({
                    page,
                    limit: PAGE_SIZE,
                    role: roleFilter === "all" ? undefined : roleFilter,
                });
                if (!ignore) {
                    setUsers(data.users);
                    setTotalItems(data.pagination.totalItems);
                    setTotalPages(data.pagination.totalPages);
                    setError(null);
                }
            } catch (err) {
                if (!ignore) {
                    const message = err instanceof Error ? err.message : "فشل جلب المستخدمين";
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
    }, [page, roleFilter]);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const counts = await adminService.getUserCounts();
                if (!ignore) {
                    setTotalActive(counts.totalActive);
                    setTotalSuspended(counts.totalSuspended);
                }
            } catch {
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, []);

    return {
        users,
        isLoading,
        error,
        page,
        totalPages,
        totalItems,
        pageSize: PAGE_SIZE,
        setPage,
        roleFilter,
        setRoleFilter: changeRoleFilter,
        totalActive,
        totalSuspended,
        toggleUserStatus,
    };
}
