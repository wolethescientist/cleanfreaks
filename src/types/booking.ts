export type Plan = {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  period: string;
  sessions: string;
  visits: string;
  includes: string[];
  bestFor: string;
  maxSessions: number;
  hasTwoCleanersOption?: boolean;
  twoCleanersPrice?: number;
  twoCleanersPriceFormatted?: string;
  maxWeekendDays?: number;
  weekendLimitPerMonth?: boolean;
  pricePerSession?: string;
  popular?: boolean;
};

export type BookingData = {
  plan: Plan | null;
  dates: Date[];
  timeSlot: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  bookingId: string | null;
};
