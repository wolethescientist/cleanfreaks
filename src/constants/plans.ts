import { Plan } from "@/types/booking";

export const PLANS: Plan[] = [
  {
    id: 'standard',
    name: "STANDARD QUARTERLY PLAN",
    price: 60000,
    priceFormatted: "₦60,000",
    sessions: "12 Cleaning Sessions (3 Months)",
    visits: "Equivalent to 4 visits per month",
    includes: [
      "12 structured cleaning sessions",
      "Up to 3 labor-hours per session",
      "Trained professional cleaner",
      "Standard home cleaning checklist",
      "Scheduled weekly visit",
      "Quality assurance review",
      "Dedicated support line"
    ],
    bestFor: "Apartments, small to mid-size homes, routine upkeep.",
    maxSessions: 4
  },
  {
    id: 'premium',
    name: "PREMIUM QUARTERLY PLAN",
    price: 120000,
    priceFormatted: "₦120,000",
    sessions: "24 Cleaning Sessions (3 Months)",
    visits: "Equivalent to 8 visits per month",
    includes: [
      "24 structured cleaning sessions",
      "Up to 3 labor-hours per session",
      "Priority scheduling",
      "Extended detailing coverage",
      "Suitable for larger homes",
      "Quality assurance review",
      "Dedicated support line"
    ],
    bestFor: "Large households, high-traffic homes, twice-weekly upkeep.",
    maxSessions: 8
  }
];
