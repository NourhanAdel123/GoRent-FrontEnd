import NotificationList from "@/components/notifications/NotificationList";

export const metadata = {
  title: "الإشعارات | لوحة تحكم المشرف",
  description: "عرض كافة إشعارات المشرف",
};

export default function AdminNotificationsPage() {
  return <NotificationList />;
}
