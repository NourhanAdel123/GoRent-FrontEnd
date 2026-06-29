import NotificationList from "@/components/notifications/NotificationList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإشعارات | GoRent",
  description: "عرض كافة إشعارات المستخدم",
};

export default function NotificationsPage() {
  return <NotificationList />;
}
