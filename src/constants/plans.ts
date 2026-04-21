import { Plan } from "@/types/booking";

export const PLANS: Plan[] = [
  {
    id: 'one-off',
    name: "One-Off Cleaning",
    price: 25000,
    priceFormatted: "₦25,000",
    period: "per session",
    sessions: "1 cleaning session (4 Hours)",
    visits: "Strict 4-hour service window",
    includes: [
      "Dusting of surfaces and furniture",
      "Floor sweeping and mopping",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning products provided",
      "Well trained cleaners"
    ],
    bestFor: "Perfect for first-time clients or occasional cleaning needs. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 1,
    hasTwoCleanersOption: true,
    twoCleanersPrice: 45000,
    twoCleanersPriceFormatted: "₦45,000"
  },
  {
    id: 'monthly',
    name: "Monthly Home Care Plan",
    price: 100000,
    priceFormatted: "₦100,000",
    period: "per month",
    sessions: "4 cleaning sessions (1 per week)",
    pricePerSession: "₦25,000 per session",
    visits: "Strict 4-hour service per visit",
    includes: [
      "Professional dusting and surface care",
      "Floor cleaning and sanitation",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning supplies included",
      "Well trained cleaners",
      "Priority booking for subscribers"
    ],
    bestFor: "Ideal for busy households that want their home consistently clean. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 4,
    maxWeekendDays: 2,
    weekendLimitPerMonth: false,
    popular: true,
    hasTwoCleanersOption: true,
    twoCleanersPrice: 180000,
    twoCleanersPriceFormatted: "₦180,000"
  },
  {
    id: 'quarterly',
    name: "Quarterly Home Care Plan",
    price: 270000,
    priceFormatted: "₦270,000",
    period: "per quarter",
    sessions: "12 cleaning sessions (1 per week)",
    pricePerSession: "₦22,500 per session",
    visits: "Strict 4-hour service per visit",
    includes: [
      "Comprehensive surface dusting and care",
      "Floor cleaning and sanitation",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning products included",
      "Well trained cleaners",
      "Priority scheduling"
    ],
    bestFor: "Best for households requiring frequent professional cleaning over a medium term. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 12,
    maxWeekendDays: 2,
    weekendLimitPerMonth: true,
    hasTwoCleanersOption: true,
    twoCleanersPrice: 550000,
    twoCleanersPriceFormatted: "₦550,000"
  },
  {
    id: 'yearly',
    name: "Yearly Home Care Plan",
    price: 1100000,
    priceFormatted: "₦1,100,000",
    period: "per year",
    sessions: "48 cleaning sessions (1 per week)",
    pricePerSession: "₦22,916 per session",
    visits: "Strict 4-hour service per visit",
    includes: [
      "Comprehensive surface dusting and care",
      "Floor cleaning and sanitation",
      "Kitchen surface cleaning",
      "Bathroom and toilet cleaning",
      "Premium cleaning products included",
      "Well trained cleaners",
      "Guaranteed weekly scheduling"
    ],
    bestFor: "Best for families who want year-round peace of mind and an always-clean home. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 48,
    maxWeekendDays: 2,
    weekendLimitPerMonth: true,
    hasTwoCleanersOption: true,
    twoCleanersPrice: 2050000,
    twoCleanersPriceFormatted: "₦2,050,000"
  }
];
