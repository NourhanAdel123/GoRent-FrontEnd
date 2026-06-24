import {
    AdminUser,
    AdminProperty,
    AdminReview,
    AdminDispute,
    PlatformReport,
} from "../types/admin";


const API_URL = "";

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء الاتصال بالخادم");
    }

    return data as T;
}

interface RawOwner {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
}

interface RawProperty {
    _id: string;
    title: string;
    ownerId: RawOwner | string;
    pricePerMonth: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    location?: { coordinates?: [number, number] };
    createdAt: string;
}

interface RawReview {
    _id: string;
    authorId?: { name?: string };
    propertyId?: { title?: string } | null;
    targetType: "PROPERTY" | "OWNER" | "TENANT";
    rating: number;
    comment: string;
    createdAt: string;
}

interface RawUser {
    _id: string;
    name: string;
    email: string;
    role: "tenant" | "owner" | "admin" | "superadmin";
    phone?: string;
    isbanned: boolean;
    createdAt: string;
}

function mapProperty(raw: RawProperty): AdminProperty {
    const coords = raw.location?.coordinates;
    return {
        _id: raw._id,
        title: raw.title,
        ownerName: typeof raw.ownerId === "object" ? raw.ownerId.name : "—",
        // The backend stores GeoJSON coordinates, not a text address, so we
        // show the coordinates as a readable fallback.
        location: coords ? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}` : "—",
        pricePerMonth: raw.pricePerMonth,
        status: raw.status,
        createdAt: raw.createdAt,
    };
}

function mapReview(raw: RawReview): AdminReview {
    const propertyTitle =
        raw.targetType === "PROPERTY"
            ? raw.propertyId?.title || "عقار محذوف"
            : raw.targetType === "OWNER"
                ? "تقييم لمؤجر"
                : "تقييم لمستأجر";

    return {
        _id: raw._id,
        propertyTitle,
        tenantName: raw.authorId?.name || "مستخدم محذوف",
        rating: raw.rating,
        comment: raw.comment,
        createdAt: raw.createdAt,
    };
}

function mapUser(raw: RawUser): AdminUser {
    return {
        _id: raw._id,
        name: raw.name,
        email: raw.email,
        role: raw.role,
        phone: raw.phone,
        status: raw.isbanned ? "SUSPENDED" : "ACTIVE",
        createdAt: raw.createdAt,
    };
}
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockDisputes: AdminDispute[] = [
    {
        _id: "d1",
        propertyTitle: "شقة غرفتين بمدينة نصر",
        tenantName: "عمر حلمي",
        ownerName: "كريم فتحي",
        subject: "عدم تطابق الشقة مع الوصف",
        description: "الشقة المستلمة تختلف بشكل كبير عن الصور والوصف المنشور على المنصة، ويطلب المستأجر استرداد مبلغ الحجز.",
        status: "OPEN",
        createdAt: "2026-05-02",
    },
    {
        _id: "d2",
        propertyTitle: "دوبلكس بالساحل الشمالي",
        tenantName: "هبة ناصر",
        ownerName: "ياسمين طارق",
        subject: "تأخر في استرداد مبلغ التأمين",
        description: "انتهت مدة الإيجار منذ أسبوعين ولم يتم استرداد مبلغ التأمين المتفق عليه حتى الآن.",
        status: "IN_REVIEW",
        createdAt: "2026-05-22",
    },
    {
        _id: "d3",
        propertyTitle: "شقة مفروشة بالمهندسين",
        tenantName: "أحمد السيد",
        ownerName: "منى عبد الله",
        subject: "خلاف حول فاتورة الكهرباء",
        description: "خلاف بين المستأجر والمالكة حول من يتحمل فاتورة الكهرباء عن الشهر الأخير من الإيجار.",
        status: "RESOLVED",
        createdAt: "2026-04-15",
    },
    {
        _id: "d4",
        propertyTitle: "شقة عائلية بالزمالك",
        tenantName: "محمود رشدي",
        ownerName: "منى عبد الله",
        subject: "طلب إلغاء حجز بعد التأكيد",
        description: "يطلب المستأجر إلغاء الحجز بعد تأكيده بثلاثة أيام بسبب تغيير ظروف عمله.",
        status: "REJECTED",
        createdAt: "2026-04-28",
    },
    {
        _id: "d5",
        propertyTitle: "فيلا بحديقة في الشيخ زايد",
        tenantName: "هبة ناصر",
        ownerName: "ياسمين طارق",
        subject: "أعطال في التكييف لم تُصلح",
        description: "تم الإبلاغ عن عطل بالتكييف منذ أكثر من أسبوعين دون رد من المالكة.",
        status: "OPEN",
        createdAt: "2026-06-08",
    },
];

// =====================================================================
// SERVICE
// =====================================================================

export const adminService = {
    getUsers: async (): Promise<{ users: AdminUser[] }> => {
        const data = await fetchApi<{ users: RawUser[] }>("/api/users");
        return { users: data.users.map(mapUser) };
    },

    toggleUserStatus: async (
        id: string,
        currentStatus: AdminUser["status"]
    ): Promise<{ users: AdminUser[] }> => {
        const endpoint =
            currentStatus === "ACTIVE"
                ? `/api/users/${id}/ban`
                : `/api/users/${id}/unban`;
        await fetchApi(endpoint, { method: "PATCH" });
        return adminService.getUsers();
    },

    getProperties: async (): Promise<{ properties: AdminProperty[] }> => {
        const data = await fetchApi<{ properties: RawProperty[] }>(
            "/api/properties/admin/properties"
        );
        return { properties: data.properties.map(mapProperty) };
    },

    updatePropertyStatus: async (
        id: string,
        status: AdminProperty["status"]
    ): Promise<void> => {
        const endpoint =
            status === "APPROVED"
                ? `/api/properties/${id}/approve`
                : `/api/properties/${id}/reject`;
        await fetchApi(endpoint, { method: "PATCH" });
    },


    getReviews: async (): Promise<{ reviews: AdminReview[] }> => {
        const data = await fetchApi<{ reviews: RawReview[] }>("/api/reviews");
        return { reviews: data.reviews.map(mapReview) };
    },

    deleteReview: async (id: string): Promise<{ reviews: AdminReview[] }> => {
        await fetchApi(`/api/reviews/${id}`, { method: "DELETE" });
        return adminService.getReviews();
    },

    getDisputes: async (): Promise<{ disputes: AdminDispute[] }> => {
        await delay();
        return { disputes: mockDisputes };
    },

    updateDisputeStatus: async (
        id: string,
        status: AdminDispute["status"]
    ): Promise<{ disputes: AdminDispute[] }> => {
        await delay(250);
        mockDisputes = mockDisputes.map((d) =>
            d._id === id ? { ...d, status } : d
        );
        return { disputes: mockDisputes };
    },

    getReport: async (): Promise<{ report: PlatformReport }> => {
        const [{ users }, { properties }, { reviews }] = await Promise.all([
            adminService.getUsers(),
            adminService.getProperties(),
            adminService.getReviews(),
        ]);
        await delay(150);

        const totalOwners = users.filter((u) => u.role === "owner").length;
        const totalTenants = users.filter((u) => u.role === "tenant").length;

        const approvedProperties = properties.filter(
            (p) => p.status === "APPROVED"
        ).length;
        const pendingProperties = properties.filter(
            (p) => p.status === "PENDING"
        ).length;
        const openDisputes = mockDisputes.filter(
            (d) => d.status === "OPEN" || d.status === "IN_REVIEW"
        ).length;
        const resolvedDisputes = mockDisputes.filter(
            (d) => d.status === "RESOLVED" || d.status === "REJECTED"
        ).length;
        const averageRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

        const topProperties = properties
            .filter((p) => p.status === "APPROVED")
            .map((p) => ({
                title: p.title,
                bookings: Math.max(1, Math.round(p.pricePerMonth / 2500)),
                revenue: p.pricePerMonth * Math.max(1, Math.round(p.pricePerMonth / 2500)),
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const report: PlatformReport = {
            totalUsers: users.length,
            totalOwners,
            totalTenants,
            totalProperties: properties.length,
            approvedProperties,
            pendingProperties,
            totalBookings: topProperties.reduce((sum, p) => sum + p.bookings, 0),
            totalRevenue: topProperties.reduce((sum, p) => sum + p.revenue, 0),
            openDisputes,
            resolvedDisputes,
            averageRating: Math.round(averageRating * 10) / 10,
            topProperties,
        };

        return { report };
    },
};