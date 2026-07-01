const NIGHTS_PER_MONTH = 30;

export const calculateTotalStayValue = (
  nights: number,
  pricePerMonth: number | undefined,
  pricePerDay?: number | null
): number => {
  const safePricePerMonth = pricePerMonth || 0;
  const dailyRate = pricePerDay ?? (safePricePerMonth / NIGHTS_PER_MONTH);

  if (nights < NIGHTS_PER_MONTH) {
    return nights * dailyRate;
  }

  const fullMonths = Math.floor(nights / NIGHTS_PER_MONTH);
  const remainingDays = nights % NIGHTS_PER_MONTH;

  return fullMonths * safePricePerMonth + remainingDays * dailyRate;
};

export const calculateBookingBreakdown = (
  startDate: string | Date,
  endDate: string | Date,
  property: { pricePerMonth?: number; pricePerDay?: number | null } | undefined
) => {
  if (!property || (!property.pricePerMonth && !property.pricePerDay)) {
    return { stayValue: 0, brokerageFee: 0, totalAmount: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDayMs = 24 * 60 * 60 * 1000;

  const nights = Math.round((end.getTime() - start.getTime()) / oneDayMs);

  if (nights <= 0) {
    return { stayValue: 0, brokerageFee: 0, totalAmount: 0 };
  }

  const stayValue = calculateTotalStayValue(nights, property.pricePerMonth, property.pricePerDay);
  const brokerageFee = stayValue * 0.10;
  const totalAmount = stayValue + brokerageFee;

  return {
    stayValue: Math.round(stayValue * 100) / 100,
    brokerageFee: Math.round(brokerageFee * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
};
