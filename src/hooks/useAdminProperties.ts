"use client";

import { useState, useEffect } from "react";
import { AdminProperty, Pagination } from "../types/admin";
import { adminService } from "../services/admin";

const PAGE_SIZE = 10;

export function useAdminProperties() {
    const [properties, setProperties] = useState<AdminProperty[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updatePropertyStatus = async (
        id: string,
        status: AdminProperty["status"]
    ) => {
        try {
            await adminService.updatePropertyStatus(id, status);
            setError(null);
            setProperties((prev) =>
                prev.map((p) => (p._id === id ? { ...p, status } : p))
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : "فشل تحديث حالة العقار";
            setError(message);
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getProperties({ page, limit: PAGE_SIZE });
                if (!ignore) {
                    setProperties(data.properties);
                    setPagination(data.pagination);
                    setError(null);
                }
            } catch {
                if (!ignore) setError("فشل جلب العقارات");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [page]);

    return { properties, pagination, page, setPage, isLoading, error, updatePropertyStatus };
}