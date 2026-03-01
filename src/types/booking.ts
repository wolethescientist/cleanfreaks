export type Plan = {
  id: 'standard' | 'premium';
  name: string;
  price: number;
  priceFormatted: string;
  sessions: string;
  visits: string;
  includes: string[];
  bestFor: string;
  maxSessions: number;
};

export type BookingData = {
  plan: Plan | null;
  dates: Date[];
  timeSlot: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  bookingId: string | null;
};
