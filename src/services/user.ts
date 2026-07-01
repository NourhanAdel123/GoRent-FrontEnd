

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const userService = {
    updateUser: async (id: string, data: { name?: string; phone?: string }) => {
        const res = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("حدث خطأ أثناء تحديث البيانات، حاول مرة أخرى.");
        return res.json();
    },

    changePassword: async (id: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        const res = await fetch(`${API_URL}/api/users/${id}/change-password`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "فشل تغيير كلمة السر");
        }
        return res.json();
    },

    updateProfileImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });
        if (!res.ok) throw new Error("تعذر رفع الصورة، يرجى التأكد من حجمها وحاول مجدداً.");
        return res.json();
    },
};