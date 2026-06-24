"use client";

import { useState, useEffect } from "react";
import { AdminProperty } from "../types/admin";
import { adminService } from "../services/admin";

export function useAdminProperties() {
    const [properties, setProperties] = useState<AdminProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updatePropertyStatus = async (
        id: string,
        status: AdminProperty["status"]
    ) => {
        try {
            await adminService.updatePropertyStatus(id, status);
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
                const data = await adminService.getProperties();
                if (!ignore) setProperties(data.properties);
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
    }, []);

    return { properties, isLoading, error, updatePropertyStatus };
}