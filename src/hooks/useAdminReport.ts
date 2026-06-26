"use client";

import { useState, useEffect } from "react";
import { PlatformReport } from "../types/admin";
import { adminService } from "../services/admin";

export function useAdminReport() {
    const [report, setReport] = useState<PlatformReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getReport();
            setReport(data.report);
        } catch {
            setError("فشل جلب التقارير");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect( () => {
        const runLoad = async () => {
            await load();
        };
        runLoad();
    }, []);

    return { report, isLoading, error, refreshReport: load };
}
