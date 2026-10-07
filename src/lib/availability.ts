import { google } from 'googleapis';
import { MAX_PER_SLOT, TIME_SLOTS } from '@/constants/schedule';
import { RUG_WASHING } from '@/constants/plans';

export type SlotCounts = Record<string, number>;
export type AvailabilityData = {
  fullDates: string[];
  slotCounts: Record<string, SlotCounts>;
};

// Simple in-memory cache (best-effort — resets on cold start)
let cache: { data: AvailabilityData; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute

const TAG = '[AVAILABILITY]';

export function invalidateAvailabilityCache() {
  console.log(`${TAG} Cache invalidated — next request will read fresh from Sheets`);
  cache = null;
}

export function hasSheetsCredentials() {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

export function getSheetsClient(readonly = false) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
    scopes: [`https://www.googleapis.com/auth/spreadsheets${readonly ? '.readonly' : ''}`],
  });
  return google.sheets({ version: 'v4', auth });
}

// Serialises the "check capacity → append row" critical section so concurrent requests handled by the
// same server instance can't both pass the check for the last free spot. This does NOT protect across
// multiple serverless instances — Sheets has no transactions — but it closes the common same-instance race.
let bookingQueue: Promise<unknown> = Promise.resolve();
export function withBookingLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = bookingQueue.then(fn, fn);
  bookingQueue = run.catch(() => {});
  return run;
}

// Dates are stored as "April 1, 2026, April 8, 2026" — use regex to parse safely
// Splitting by ", " would break because date format itself contains ", " (e.g. "April 1, 2026")
function parseDatesFromCell(cellValue: string): string[] {
  const matches = cellValue.match(/[A-Za-z]+ \d+, \d{4}/g) || [];
  return matches;
}

export async function fetchAvailabilityData(skipCache = false): Promise<AvailabilityData> {
  if (!skipCache && cache && Date.now() < cache.expiresAt) {
    const secondsLeft = Math.round((cache.expiresAt - Date.now()) / 1000);
    console.log(`${TAG} Cache hit — ${secondsLeft}s remaining`);
    return cache.data;
  }

  console.log(`${TAG} ${skipCache ? 'Skipping cache (double-check)' : 'Cache miss'} — reading from Google Sheets`);

  const slotCounts: Record<string, SlotCounts> = {};

  if (!hasSheetsCredentials()) {
    console.warn(`${TAG} Google Sheets credentials not configured — returning empty availability`);
    const empty: AvailabilityData = { fullDates: [], slotCounts: {} };
    if (!skipCache) cache = { data: empty, expiresAt: Date.now() + CACHE_TTL_MS };
    return empty;
  }

  const sheets = getSheetsClient(true);

  // Read columns A (bookingId) through I (timeSlot) so we can log booking IDs
  // Row 1 is the header — data starts at row 2
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Sheet1!A2:I', // skip header row
  });

  const rows = response.data.values || [];
  console.log(`${TAG} Read ${rows.length} booking rows from Sheets`);

  let skipped = 0;
  let parsed = 0;
  let totalDateSlotPairs = 0;

  for (const row of rows) {
    // Column layout: A=bookingId, B=name, C=email, D=phone, E=address,
    //               F=planName, G=price, H=dates, I=timeSlot
    const bookingId = (row[0] as string) || '';
    const planName  = (row[5] as string) || ''; // column F (index 5)
    const datesStr  = (row[7] as string) || ''; // column H (index 7)
    const timeSlot  = ((row[8] as string) || '').trim(); // column I (index 8)

    // Rug pickups don't use a cleaning team, so they don't take up cleaning capacity.
    if (planName.startsWith(RUG_WASHING.name)) {
      skipped++;
      continue;
    }

    if (!datesStr || !timeSlot) {
      if (datesStr || timeSlot) {
        console.log(`${TAG} Skipping row (bookingId="${bookingId}" datesStr="${datesStr}" timeSlot="${timeSlot}") — invalid data`);
      }
      skipped++;
      continue;
    }

    const dateList = parseDatesFromCell(datesStr);

    if (dateList.length === 0) {
      console.warn(`${TAG} Could not parse any dates from cell value: "${datesStr}" (bookingId=${bookingId})`);
      skipped++;
      continue;
    }

    console.log(`${TAG} Booking ${bookingId} | slot=${timeSlot} | dates=[${dateList.join(', ')}]`);

    for (const dateStr of dateList) {
      if (!slotCounts[dateStr]) {
        slotCounts[dateStr] = Object.fromEntries(TIME_SLOTS.map(s => [s, 0]));
      }
      // Rows with a slot we no longer offer are still tallied, they just don't count towards a date being full.
      slotCounts[dateStr][timeSlot] = (slotCounts[dateStr][timeSlot] || 0) + 1;
      totalDateSlotPairs++;
    }

    parsed++;
  }

  console.log(`${TAG} Processed ${parsed} bookings, skipped ${skipped} rows, counted ${totalDateSlotPairs} date-slot pairs`);

  // Log the full slot breakdown
  if (Object.keys(slotCounts).length > 0) {
    console.log(`${TAG} Slot counts by date:`);
    for (const [date, slots] of Object.entries(slotCounts)) {
      const total = Object.values(slots).reduce((s, n) => s + n, 0);
      console.log(`  ${date}: ${Object.entries(slots).map(([s, n]) => `${s}=${n}`).join(' | ')} | total=${total}`);
    }
  } else {
    console.log(`${TAG} No bookings found — all dates open`);
  }

  // A date is full when every slot has hit MAX_PER_SLOT
  const fullDates = Object.entries(slotCounts)
    .filter(([, slots]) => TIME_SLOTS.every(slot => (slots[slot] || 0) >= MAX_PER_SLOT))
    .map(([date]) => date);

  if (fullDates.length > 0) {
    console.log(`${TAG} FULL dates (all slots at ${MAX_PER_SLOT}): [${fullDates.join(', ')}]`);
  } else {
    console.log(`${TAG} No fully booked dates`);
  }

  const data: AvailabilityData = { fullDates, slotCounts };

  if (!skipCache) {
    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    console.log(`${TAG} Result cached for ${CACHE_TTL_MS / 1000}s`);
  }

  return data;
}
