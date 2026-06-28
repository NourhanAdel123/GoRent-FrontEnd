import {
  AdminUser,
  AdminProperty,
  AdminReview,
  AdminDispute,
  PlatformReport,
  Pagination,
} from "@/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

interface RawDispute {
  _id: string;
  propertyId?: { _id: string; title: string } | null;
  tenantId?: { _id: string; name: string; email: string } | null;
  ownerId?: { _id: string; name: string; email: string } | null;
  subject: string;
  description: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

function mapProperty(raw: RawProperty): AdminProperty {
  const coords = raw.location?.coordinates;
  return {
    _id: raw._id,
    title: raw.title,
    ownerName: typeof raw.ownerId === "object" ? raw.ownerId.name : "—",
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

function mapDispute(raw: RawDispute): AdminDispute {
  return {
    _id: raw._id,
    propertyTitle: raw.propertyId?.title || "عقار محذوف",
    tenantName: raw.tenantId?.name || "مستخدم محذوف",
    ownerName: raw.ownerId?.name || "مستخدم محذوف",
    subject: raw.subject,
    description: raw.description,
    status: raw.status,
    createdAt: raw.createdAt,
  };
}


export const adminService = {
  getUsers: async (params: {
    page?: number;
    limit?: number;
    role?: AdminUser["role"];
  } = {}): Promise<{ users: AdminUser[]; pagination: Pagination }> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.role) query.set("role", params.role);
    const qs = query.toString();

    const data = await fetchApi<{ users: RawUser[]; pagination: Pagination }>(
        `/api/users${qs ? `?${qs}` : ""}`
    );
    return { users: data.users.map(mapUser), pagination: data.pagination };
  },

  getUserCounts: async (): Promise<{
    totalActive: number;
    totalSuspended: number;
  }> => {
    const [activeRes, suspendedRes] = await Promise.all([
      fetchApi<{ pagination: Pagination }>("/api/users?isbanned=false&limit=1"),
      fetchApi<{ pagination: Pagination }>("/api/users?isbanned=true&limit=1"),
    ]);
    return {
      totalActive: activeRes.pagination.totalItems,
      totalSuspended: suspendedRes.pagination.totalItems,
    };
  },

  toggleUserStatus: async (
      id: string,
      currentStatus: AdminUser["status"]
  ): Promise<void> => {
    const endpoint =
        currentStatus === "ACTIVE"
            ? `/api/users/${id}/ban`
            : `/api/users/${id}/unban`;
    await fetchApi(endpoint, { method: "PATCH" });
  },

  getProperties: async (params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ properties: AdminProperty[]; pagination: Pagination }> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const data = await fetchApi<{ properties: RawProperty[]; pagination: Pagination }>(
        `/api/properties/admin/properties${qs ? `?${qs}` : ""}`
    );
    return { properties: data.properties.map(mapProperty), pagination: data.pagination };
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

  getReviews: async (params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ reviews: AdminReview[]; pagination: Pagination }> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const data = await fetchApi<{ reviews: RawReview[]; pagination: Pagination }>(
        `/api/reviews${qs ? `?${qs}` : ""}`
    );
    return { reviews: data.reviews.map(mapReview), pagination: data.pagination };
  },

  deleteReview: async (id: string): Promise<void> => {
    await fetchApi(`/api/reviews/${id}`, { method: "DELETE" });
  },

  getDisputes: async (params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ disputes: AdminDispute[]; pagination: Pagination }> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const data = await fetchApi<{ disputes: RawDispute[]; pagination: Pagination }>(
        `/api/disputes${qs ? `?${qs}` : ""}`
    );
    return { disputes: data.disputes.map(mapDispute), pagination: data.pagination };
  },

  updateDisputeStatus: async (
      id: string,
      status: AdminDispute["status"]
  ): Promise<void> => {
    let endpoint = "";

    if (status === "IN_REVIEW") {
      endpoint = `/api/disputes/${id}/review`;
    } else if (status === "RESOLVED") {
      endpoint = `/api/disputes/${id}/resolve`;
    } else if (status === "REJECTED") {
      endpoint = `/api/disputes/${id}/reject`;
    } else {
      throw new Error("Cannot set dispute status to OPEN via API");
    }

    await fetchApi(endpoint, { method: "PATCH" });
  },

  getReport: async (): Promise<{ report: PlatformReport }> => {
    return fetchApi<{ report: PlatformReport }>("/api/report");
  },
};