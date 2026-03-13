import { Plan } from "@/types/booking";

export const PLANS: Plan[] = [
  {
    id: 'one-off',
    name: "One-Off Cleaning",
    price: 12500,
    priceFormatted: "₦12,500",
    period: "per session",
    sessions: "1 professional home cleaning session",
    visits: "Strict 3-hour service window",
    includes: [
      "Dusting of surfaces and furniture",
      "Floor sweeping and mopping",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning products provided"
    ],
    bestFor: "Perfect for first-time clients or occasional cleaning needs. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 1
  },
  {
    id: 'monthly',
    name: "Monthly Home Care Plan",
    price: 30000,
    priceFormatted: "₦30,000",
    period: "per month",
    sessions: "4 cleaning sessions (1 per week)",
    visits: "Strict 3-hour service per visit",
    includes: [
      "Professional dusting and surface care",
      "Floor cleaning and sanitation",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning supplies included",
      "Priority booking for subscribers"
    ],
    bestFor: "Ideal for busy households that want their home consistently clean. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 4,
    popular: true
  },
  {
    id: 'premium',
    name: "Premium Home Care Plan",
    price: 159000,
    priceFormatted: "₦159,000",
    period: "per quarter",
    sessions: "24 cleaning sessions (2 per week)",
    visits: "Strict 3-hour service per visit",
    includes: [
      "Comprehensive surface dusting and care",
      "Floor cleaning and sanitation",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning products included",
      "Priority scheduling"
    ],
    bestFor: "Best for large homes or households requiring frequent professional cleaning. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 24
  }
];
