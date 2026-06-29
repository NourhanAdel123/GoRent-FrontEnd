import NotificationList from "@/components/notifications/NotificationList";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "الإشعارات | لوحة تحكم المالك",
  description: "عرض كافة إشعارات المالك",
};

export default function OwnerNotificationsPage() {
  return <NotificationList />;
}
