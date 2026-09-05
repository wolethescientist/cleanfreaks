import { Plan } from "@/types/booking";

// Every plan now ships with a fixed team of 2 cleaners.
const CLEANERS_PER_SESSION = 2;

// Shared across all plans — the only per-plan difference is the complimentary services.
const STANDARD_INCLUDES = [
  "4 hour session",
  "Cleaning supplies such as floor cleaners, degreasers, toilet whiteners, towels, soap etc. will be brought by the cleaners",
  "Cleaning tools such as brooms, mops, cobweb removers and ladders will be provided by the client"
];

export const PLANS: Plan[] = [
  {
    id: 'one-off',
    name: "One-Off Cleaning",
    price: 45000,
    priceFormatted: "₦45,000",
    period: "per session",
    sessions: "1 cleaning session (4 Hours)",
    visits: "Strict 4-hour service window",
    cleaners: CLEANERS_PER_SESSION,
    includes: STANDARD_INCLUDES,
    bestFor: "Perfect for first-time clients or occasional cleaning needs. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 1
  },
  {
    id: 'monthly',
    name: "Monthly Home Care Plan",
    price: 100000,
    priceFormatted: "₦100,000",
    period: "per month",
    sessions: "4 cleaning sessions (1 per week)",
    visits: "Strict 4-hour service per visit",
    cleaners: CLEANERS_PER_SESSION,
    includes: STANDARD_INCLUDES,
    bestFor: "Ideal for busy households that want their home consistently clean. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 4,
    maxWeekendDays: 2,
    weekendLimitPerMonth: false,
    popular: true
  },
  {
    id: 'quarterly',
    name: "Quarterly Home Care Plan",
    price: 290000,
    priceFormatted: "₦290,000",
    period: "per quarter",
    sessions: "12 cleaning sessions (1 per week)",
    visits: "Strict 4-hour service per visit",
    cleaners: CLEANERS_PER_SESSION,
    includes: STANDARD_INCLUDES,
    complimentary: [
      "Complimentary Sofa Cleaning"
    ],
    bestFor: "Best for households requiring frequent professional cleaning over a medium term. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 12,
    maxWeekendDays: 2,
    weekendLimitPerMonth: true
  },
  {
    id: 'yearly',
    name: "Yearly Home Care Plan",
    price: 1100000,
    priceFormatted: "₦1,100,000",
    period: "per year",
    sessions: "48 cleaning sessions (1 per week)",
    visits: "Strict 4-hour service per visit",
    cleaners: CLEANERS_PER_SESSION,
    includes: STANDARD_INCLUDES,
    complimentary: [
      "Complimentary Fumigation",
      "Complimentary Sofa Cleaning"
    ],
    bestFor: "Best for families who want year-round peace of mind and an always-clean home. Note: Excludes construction dirt, post-renovation cleaning, or heavily soiled environments.",
    maxSessions: 48,
    maxWeekendDays: 2,
    weekendLimitPerMonth: true
  }
];
