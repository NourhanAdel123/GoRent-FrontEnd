import NotificationList from "@/components/notifications/NotificationList";

export const metadata = {
  title: "الإشعارات | لوحة تحكم المالك",
  description: "عرض كافة إشعارات المالك",
};

export default function OwnerNotificationsPage() {
  return <NotificationList />;
}
