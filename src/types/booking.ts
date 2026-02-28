export type Plan = {
  id: 'standard' | 'premium';
  name: string;
  price: number;
  priceFormatted: string;
  sessions: string;
  visits: string;
  includes: string[];
  bestFor: string;
};

export type BookingData = {
  plan: Plan | null;
  date: Date | null;
  timeSlot: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  bookingId: string | null;
};
