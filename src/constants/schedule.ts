// Single source of truth for slot times and capacity, used by both the calendar UI and the API.
export const TIME_SLOTS = ["09:00 AM", "01:00 PM"];

// Maximum number of cleaning bookings per date + time slot.
export const MAX_PER_SLOT = 10;

// Calendar dates are stored in the sheet (and used as lookup keys) in this format, e.g. "April 1, 2026".
export const SHEET_DATE_FORMAT = "MMMM d, yyyy";
