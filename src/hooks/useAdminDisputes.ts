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
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AdminDispute["status"] | "all">("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const changeStatusFilter = (status: AdminDispute["status"] | "all") => {
        setStatusFilter(status);
        setPage(1);
    };
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
            setError("تعذر تحديث حالة النزاع، يرجى المحاولة مرة أخرى.");
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getDisputes({ 
                    page, 
                    limit: PAGE_SIZE, 
                    search: debouncedSearch, 
                    status: statusFilter 
                });
                if (!ignore) {
                    setDisputes(data.disputes);
                    setPagination(data.pagination);
                }
            } catch {
                if (!ignore) setError("تعذر تحميل قائمة النزاعات.");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [page, debouncedSearch, statusFilter]);

    return { disputes, pagination, page, setPage, search, setSearch, statusFilter, setStatusFilter: changeStatusFilter, isLoading, error, updateDisputeStatus };
}