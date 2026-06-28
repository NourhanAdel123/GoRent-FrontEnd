import { ContactStatus } from "../../types/contact";

export const statusMap: Record<
  ContactStatus,
  { label: string; color: "default" | "primary" | "success" | "warning" | "error" }
> = {
  UNREAD: { label: "غير مقروءة", color: "warning" },
  READ: { label: "مقروءة", color: "primary" },
  REPLIED: { label: "تم الرد", color: "success" },
};
