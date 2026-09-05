export type Plan = {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  period: string;
  sessions: string;
  visits: string;
  cleaners: number;
  includes: string[];
  complimentary?: string[];
  bestFor: string;
  maxSessions: number;
  maxWeekendDays?: number;
  weekendLimitPerMonth?: boolean;
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
