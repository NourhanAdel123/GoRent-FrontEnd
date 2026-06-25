"use client";

import { useState, useEffect } from "react";
import { AdminReview, Pagination } from "../types/admin";
import { adminService } from "../services/admin";

const PAGE_SIZE = 10;

export function useAdminReviews() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const deleteReview = async (id: string) => {
        try {
            await adminService.deleteReview(id);
            const data = await adminService.getReviews({ page, limit: PAGE_SIZE });
            setReviews(data.reviews);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "فشل حذف التقييم";
            setError(message);
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await adminService.getReviews({ page, limit: PAGE_SIZE });
                if (!ignore) {
                    setReviews(data.reviews);
                    setPagination(data.pagination);
                    setError(null);
                }
            } catch {
                if (!ignore) setError("فشل جلب التقييمات");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [page]);

    return { reviews, pagination, page, setPage, isLoading, error, deleteReview };
}