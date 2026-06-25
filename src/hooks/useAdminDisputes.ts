"use client";

import { useState, useEffect } from "react";
import { AdminDispute, Pagination } from "../types/admin";
import { adminService } from "../services/admin";

const PAGE_SIZE = 10;

export function useAdminDisputes() {
    const [disputes, setDisputes] = useState<AdminDispute[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updateDisputeStatus = async (
        id: string,
        status: AdminDispute["status"]
    ) => {
        try {
            await adminService.updateDisputeStatus(id, status);
            setDisputes((prev) =>
                prev.map((d) => (d._id === id ? { ...d, status } : d))
            );
        } catch {
            setError("فشل تحديث حالة النزاع");
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getDisputes({ page, limit: PAGE_SIZE });
                if (!ignore) {
                    setDisputes(data.disputes);
                    setPagination(data.pagination);
                }
            } catch {
                if (!ignore) setError("فشل جلب النزاعات");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [page]);

    return { disputes, pagination, page, setPage, isLoading, error, updateDisputeStatus };
}