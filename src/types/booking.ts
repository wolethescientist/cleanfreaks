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
  // Per-unit products (e.g. rug washing): `price` is the price of one unit.
  unit?: string;
  maxQuantity?: number;
};

export type BookingData = {
  plan: Plan | null;
  // Number of units for per-unit products. Always 1 for cleaning plans.
  quantity: number;
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
