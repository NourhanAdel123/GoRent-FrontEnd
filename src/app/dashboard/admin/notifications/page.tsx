import NotificationList from "@/components/notifications/NotificationList";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "الإشعارات | لوحة تحكم المشرف",
  description: "عرض كافة إشعارات المشرف",
};

export default function AdminNotificationsPage() {
  return <NotificationList />;
}
