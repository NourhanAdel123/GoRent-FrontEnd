

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export const userService = {
    updateUser: async (id: string, data: { name?: string; phone?: string }) => {
        const res = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("فشل تحديث البيانات");
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
        if (!res.ok) throw new Error("فشل تحديث الصورة");
        return res.json();
    },
};