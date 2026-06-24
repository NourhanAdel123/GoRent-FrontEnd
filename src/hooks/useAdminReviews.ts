"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminReview } from "../types/admin";
import { adminService } from "../services/admin";

export function useAdminReviews() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getReviews();
            setReviews(data.reviews);
        } catch {
            setError("فشل جلب التقييمات");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteReview = async (id: string) => {
        try {
            await adminService.deleteReview(id);
            await fetchReviews();
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
                const data = await adminService.getReviews();
                if (!ignore) setReviews(data.reviews);
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
    }, []);

    return { reviews, isLoading, error, deleteReview };
}
