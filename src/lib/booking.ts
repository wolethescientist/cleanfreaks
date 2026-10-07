import { format } from "date-fns";
import { ALL_PRODUCTS } from "@/constants/plans";
import { SHEET_DATE_FORMAT, TIME_SLOTS } from "@/constants/schedule";
import type { Plan } from "@/types/booking";
import { formatNaira } from "@/lib/utils";

// Wire format for booking dates: a plain calendar day, so the server never has to guess the client's timezone.
export const WIRE_DATE_FORMAT = "yyyy-MM-dd";

/**
 * Turns a catalogue entry into the plan that is actually booked: cleaning plans get their
 * cleaner count appended to the name, per-unit products get the quantity and the total price.
 */
export function buildBookingPlan(base: Plan, quantity = 1): Plan {
  if (base.unit) {
    const total = base.price * quantity;
    return {
      ...base,
      name: `${base.name} (${quantity} ${quantity === 1 ? base.unit : `${base.unit}s`})`,
      price: total,
      priceFormatted: formatNaira(total),
    };
  }
  return { ...base, name: `${base.name} (${base.cleaners} Cleaners)` };
}

export function isPerUnitPlan(plan: Pick<Plan, "unit"> | null | undefined) {
  return !!plan?.unit;
}

function parseWireDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  // Reject overflow like 2026-02-31 silently rolling into March.
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

// Today's calendar day in Lagos, as yyyy-MM-dd (the business operates there, the server may run in UTC).
function todayInLagos() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
}

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export type ValidBooking = {
  plan: Plan;
  quantity: number;
  timeSlot: string;
  /** Dates in the sheet's display format, e.g. "April 1, 2026" */
  dateLabels: string[];
  customer: { name: string; email: string; phone: string; address: string };
};

export type BookingValidation =
  | { ok: true; booking: ValidBooking }
  | { ok: false; message: string };

const fail = (message: string): BookingValidation => ({ ok: false, message });

/**
 * Validates a booking request against the catalogue. Price, plan name and limits are always taken from
 * the server-side catalogue; only the plan id, quantity, dates, slot and customer details come from the client.
 */
export function validateBooking(input: unknown): BookingValidation {
  const body = (input ?? {}) as Record<string, unknown>;

  const planId = (body.plan as { id?: unknown } | null | undefined)?.id;
  const base = ALL_PRODUCTS.find(p => p.id === planId);
  if (!base) return fail("Unknown plan selected. Please go back and choose a plan.");

  let quantity = 1;
  if (base.unit) {
    quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > (base.maxQuantity ?? 1)) {
      return fail(`Please choose between 1 and ${base.maxQuantity ?? 1} ${base.unit}s.`);
    }
  }

  const timeSlot = body.timeSlot;
  if (typeof timeSlot !== "string" || !TIME_SLOTS.includes(timeSlot)) {
    return fail("Please choose a valid time slot.");
  }

  if (!Array.isArray(body.dates) || body.dates.length === 0) {
    return fail("Please choose at least one date.");
  }
  if (body.dates.length > base.maxSessions) {
    return fail(`This plan allows a maximum of ${base.maxSessions} date${base.maxSessions === 1 ? "" : "s"}.`);
  }

  const today = todayInLagos();
  const dates: Date[] = [];
  const seen = new Set<string>();
  for (const raw of body.dates) {
    const date = parseWireDate(raw);
    if (!date) return fail("One of the selected dates is invalid.");
    if ((raw as string) < today) return fail("Booking dates cannot be in the past. Please choose new dates.");
    if (seen.has(raw as string)) return fail("The same date was selected more than once.");
    seen.add(raw as string);
    dates.push(date);
  }

  // Weekend limits (mirrors the calendar UI): max N weekend days in total, or per calendar month.
  if (base.maxWeekendDays !== undefined) {
    const weekends = dates.filter(isWeekend);
    if (base.weekendLimitPerMonth) {
      const perMonth = new Map<string, number>();
      for (const d of weekends) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        perMonth.set(key, (perMonth.get(key) ?? 0) + 1);
      }
      if ([...perMonth.values()].some(n => n > base.maxWeekendDays!)) {
        return fail(`This plan allows a maximum of ${base.maxWeekendDays} weekend days per month.`);
      }
    } else if (weekends.length > base.maxWeekendDays) {
      return fail(`This plan allows a maximum of ${base.maxWeekendDays} weekend days.`);
    }
  }

  const c = (body.customer ?? {}) as Record<string, unknown>;
  const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const customer = {
    name: clean(c.name, 120),
    email: clean(c.email, 200),
    phone: clean(c.phone, 40),
    address: clean(c.address, 300),
  };
  if (!customer.name || !customer.phone || !customer.address || !/\S+@\S+\.\S+/.test(customer.email)) {
    return fail("Please fill in your name, a valid email, phone number and address.");
  }

  return {
    ok: true,
    booking: {
      plan: buildBookingPlan(base, quantity),
      quantity,
      timeSlot,
      dateLabels: dates.map(d => format(d, SHEET_DATE_FORMAT)),
      customer,
    },
  };
}
