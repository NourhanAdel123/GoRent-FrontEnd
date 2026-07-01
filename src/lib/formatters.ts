import { CURRENCY_SYMBOL } from "../constants/currency";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return `0 ${CURRENCY_SYMBOL}`;
  return `${amount.toLocaleString("ar-SA")} ${CURRENCY_SYMBOL}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "تم التحديث اليوم";
  if (diffDays === 1) return "تم التحديث منذ يوم";
  if (diffDays === 2) return "تم التحديث منذ يومين";
  if (diffDays <= 10) return `تم التحديث منذ ${diffDays} أيام`;
  if (diffDays <= 30) return `تم التحديث منذ ${Math.floor(diffDays / 7)} أسابيع`;
  return `تم التحديث منذ ${Math.floor(diffDays / 30)} شهر`;
}

export function formatPropertyLocation(
  location?: { coordinates?: [number, number] },
): string {
  const coords = location?.coordinates;
  if (!coords || coords.length < 2) return "موقع غير محدد";
  const [lng, lat] = coords;
  return `${lat.toFixed(2)}°، ${lng.toFixed(2)}°`;
}
