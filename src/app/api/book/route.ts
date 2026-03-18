import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';
import { format } from 'date-fns';
import { fetchAvailabilityData, invalidateAvailabilityCache, MAX_PER_SLOT } from '@/app/api/availability/route';

const resend = new Resend(process.env.RESEND_API_KEY || '');

const TAG = '[BOOKING]';

export async function POST(req: NextRequest) {
  const requestTime = new Date().toISOString();
  console.log(`${TAG} ---- New booking request at ${requestTime} ----`);

  try {
    const data = await req.json();
    const { plan, dates, timeSlot, customer } = data;

    console.log(`${TAG} Customer: ${customer?.name} | Email: ${customer?.email} | Plan: ${plan?.name} | Time: ${timeSlot} | Dates: ${dates?.length}`);

    // 1. Generate booking ID
    const today = new Date();
    const dateStr = format(today, 'yyyyMMdd');
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingId = `CF-${dateStr}-${randomStr}`;
    console.log(`${TAG} Generated booking ID: ${bookingId}`);

    const formattedDates = dates && dates.length > 0
      ? dates.map((d: string | Date) => format(new Date(d), 'MMMM d, yyyy')).join(', ')
      : 'N/A';

    const parsedDateStrings: string[] = dates
      ? dates.map((d: string | Date) => format(new Date(d), 'MMMM d, yyyy'))
      : [];

    // 2. Double-check availability (fresh Sheets read, bypass cache)
    if (parsedDateStrings.length > 0 && timeSlot) {
      console.log(`${TAG} Running availability double-check for ${parsedDateStrings.length} date(s) at ${timeSlot}...`);
      const availability = await fetchAvailabilityData(true);

      for (const ds of parsedDateStrings) {
        const count = availability.slotCounts[ds]?.[timeSlot] || 0;
        console.log(`${TAG}   ${ds} @ ${timeSlot}: ${count}/${MAX_PER_SLOT} booked`);
      }

      const overbooked = parsedDateStrings.find(ds => {
        const count = availability.slotCounts[ds]?.[timeSlot] || 0;
        return count >= MAX_PER_SLOT;
      });

      if (overbooked) {
        console.warn(`${TAG} SLOT_FULL — ${overbooked} @ ${timeSlot} is at capacity. Rejecting ${bookingId}`);
        return NextResponse.json({
          success: false,
          error: 'SLOT_FULL',
          message: `Sorry, the ${timeSlot} slot on ${overbooked} is now fully booked. Please go back and choose a different time or date.`,
        }, { status: 409 });
      }

      console.log(`${TAG} Availability check passed — all slots have capacity`);
    } else {
      console.log(`${TAG} Skipping availability check (no dates or no timeSlot)`);
    }

    // 3. Save to Google Sheets
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
      console.log(`${TAG} Saving to Google Sheets...`);
      try {
        const auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Sheet1!A:K',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              bookingId,
              customer.name,
              customer.email,
              customer.phone,
              customer.address,
              plan.name,
              plan.priceFormatted,
              formattedDates,
              timeSlot,
              new Date().toISOString(),
              'Not Paid',
            ]],
          },
        });
        console.log(`${TAG} Saved to Sheets successfully — invalidating availability cache`);
        invalidateAvailabilityCache();
      } catch (sheetError) {
        console.error(`${TAG} Google Sheets write FAILED for ${bookingId}:`, sheetError);
        // Continue — customer still gets a confirmation, but flag clearly for manual fix
      }
    } else {
      console.warn(`${TAG} Google Sheets credentials not configured — ${bookingId} NOT saved to Sheets`);
    }

    // 4. Send confirmation email
    if (process.env.RESEND_API_KEY) {
      console.log(`${TAG} Sending confirmation email to ${customer.email}...`);
      try {
        const senderEmail = process.env.SENDER_EMAIL || 'noreply@henamfacility.com.ng';
        await resend.emails.send({
          to: customer.email,
          from: senderEmail,
          subject: `Booking Confirmation: ${bookingId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #2D5A27;">Hello ${customer.name},</h2>
              <p>Thank you for choosing <strong>Clean Freaks</strong>! Your booking has been successfully reserved.</p>
              <div style="background: #F1F8F1; padding: 15px; border-radius: 10px;">
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Plan:</strong> ${plan.name}</p>
                <p><strong>Schedule:</strong> <br/> ${formattedDates} <br/> at ${timeSlot}</p>
              </div>
              <p>Please ensure you complete your payment and send the receipt to us via WhatsApp to finalize your cleaning schedule.</p>
              <p>Best regards,<br/>The Clean Freaks Team</p>
            </div>
          `,
        });
        console.log(`${TAG} Confirmation email sent to ${customer.email}`);
      } catch (emailError) {
        console.error(`${TAG} Email send FAILED for ${bookingId}:`, emailError);
      }
    } else {
      console.warn(`${TAG} RESEND_API_KEY not configured — email NOT sent for ${bookingId}`);
    }

    console.log(`${TAG} ✓ Booking ${bookingId} completed successfully`);
    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking processed successfully',
    });

  } catch (error) {
    console.error(`${TAG} Unhandled error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
    }, { status: 500 });
  }
}
