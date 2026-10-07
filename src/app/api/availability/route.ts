import { NextResponse } from 'next/server';
import { fetchAvailabilityData } from '@/lib/availability';

const TAG = '[AVAILABILITY]';

export async function GET() {
  console.log(`${TAG} GET /api/availability called`);
  try {
    const data = await fetchAvailabilityData();
    console.log(`${TAG} Returning availability — ${data.fullDates.length} full date(s), ${Object.keys(data.slotCounts).length} date(s) with bookings`);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error(`${TAG} Fatal error fetching availability:`, error);
    return NextResponse.json({ success: false, fullDates: [], slotCounts: {} });
  }
}
