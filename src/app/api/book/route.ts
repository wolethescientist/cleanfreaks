import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { format } from 'date-fns';
import {
  fetchAvailabilityData,
  getSheetsClient,
  hasSheetsCredentials,
  invalidateAvailabilityCache,
  withBookingLock,
} from '@/lib/availability';
import { isPerUnitPlan, validateBooking } from '@/lib/booking';
import { MAX_PER_SLOT } from '@/constants/schedule';

const TAG = '[BOOKING]';

// The sheet uses USER_ENTERED, so a value starting with = + - @ would be evaluated as a formula.
// A leading apostrophe forces Sheets to treat it as plain text (and is not displayed).
const asText = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

class SlotFullError extends Error {
  constructor(public readonly dateLabel: string) {
    super('SLOT_FULL');
  }
}

export async function POST(req: NextRequest) {
  const requestTime = new Date().toISOString();
  console.log(`${TAG} ---- New booking request at ${requestTime} ----`);

  try {
    const validation = validateBooking(await req.json());
    if (!validation.ok) {
      console.warn(`${TAG} Rejected invalid booking: ${validation.message}`);
      return NextResponse.json({
        success: false,
        error: 'INVALID_BOOKING',
        message: validation.message,
      }, { status: 400 });
    }

    // Plan name, price and dates below are server-validated — never the raw client payload.
    const { plan, timeSlot, customer, dateLabels } = validation.booking;

    console.log(`${TAG} Customer: ${customer.name} | Email: ${customer.email} | Plan: ${plan.name} (${plan.priceFormatted}) | Time: ${timeSlot} | Dates: ${dateLabels.length}`);

    // 1. Generate booking ID
    const today = new Date();
    const dateStr = format(today, 'yyyyMMdd');
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingId = `CF-${dateStr}-${randomStr}`;
    console.log(`${TAG} Generated booking ID: ${bookingId}`);

    const formattedDates = dateLabels.join(', ');

    // 2 + 3. Check capacity and save to Google Sheets. Done inside a lock so two simultaneous
    // requests can't both pass the check for the last free spot.
    try {
      await withBookingLock(async () => {
        // Rug pickups don't use a cleaning team, so they skip the cleaning-capacity check.
        if (!isPerUnitPlan(plan)) {
          console.log(`${TAG} Running availability double-check for ${dateLabels.length} date(s) at ${timeSlot}...`);
          const availability = await fetchAvailabilityData(true);

          for (const ds of dateLabels) {
            const count = availability.slotCounts[ds]?.[timeSlot] || 0;
            console.log(`${TAG}   ${ds} @ ${timeSlot}: ${count}/${MAX_PER_SLOT} booked`);
            if (count >= MAX_PER_SLOT) throw new SlotFullError(ds);
          }
          console.log(`${TAG} Availability check passed — all slots have capacity`);
        }

        if (hasSheetsCredentials()) {
          console.log(`${TAG} Saving to Google Sheets...`);
          try {
            const sheets = getSheetsClient();
            await sheets.spreadsheets.values.append({
              spreadsheetId: process.env.GOOGLE_SHEET_ID!,
              range: 'Sheet1!A:K',
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[
                  bookingId,
                  asText(customer.name),
                  asText(customer.email),
                  asText(customer.phone),
                  asText(customer.address),
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
      });
    } catch (err) {
      if (err instanceof SlotFullError) {
        console.warn(`${TAG} SLOT_FULL — ${err.dateLabel} @ ${timeSlot} is at capacity. Rejecting ${bookingId}`);
        return NextResponse.json({
          success: false,
          error: 'SLOT_FULL',
          message: `Sorry, the ${timeSlot} slot on ${err.dateLabel} is now fully booked. Please go back and choose a different time or date.`,
        }, { status: 409 });
      }
      throw err;
    }

    // 4. Send confirmation email to customer + admin
    if (process.env.RESEND_API_KEY) {
      // Created lazily: the Resend constructor throws when no API key is set (e.g. at build time).
      const resend = new Resend(process.env.RESEND_API_KEY);
      const senderEmail = process.env.SENDER_EMAIL || 'noreply@henamfacility.com.ng';

      // Customer confirmation
      console.log(`${TAG} Sending confirmation email to ${customer.email}...`);
      try {
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
        console.error(`${TAG} Customer email send FAILED for ${bookingId}:`, emailError);
      }

      // Admin notification
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        console.log(`${TAG} Sending admin notification to ${adminEmail}...`);
        try {
          await resend.emails.send({
            to: adminEmail,
            from: senderEmail,
            subject: `New Booking: ${bookingId} — ${customer.name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #2D5A27;">New Booking Received</h2>
                <div style="background: #F1F8F1; padding: 15px; border-radius: 10px; margin-bottom: 16px;">
                  <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
                  <p style="margin: 4px 0;"><strong>Plan:</strong> ${plan.name} — ${plan.priceFormatted}</p>
                  <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
                  <p style="margin: 4px 0;"><strong>Dates:</strong><br/>${formattedDates}</p>
                </div>
                <div style="background: #fff; padding: 15px; border-radius: 10px; border: 1px solid #eee;">
                  <p style="margin: 4px 0; font-weight: bold; color: #555;">Customer Details</p>
                  <p style="margin: 4px 0;"><strong>Name:</strong> ${customer.name}</p>
                  <p style="margin: 4px 0;"><strong>Email:</strong> ${customer.email}</p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> ${customer.phone}</p>
                  <p style="margin: 4px 0;"><strong>Address:</strong> ${customer.address}</p>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 16px;">Booked at ${requestTime}</p>
              </div>
            `,
          });
          console.log(`${TAG} Admin notification sent to ${adminEmail}`);
        } catch (adminEmailError) {
          console.error(`${TAG} Admin email send FAILED for ${bookingId}:`, adminEmailError);
        }
      } else {
        console.warn(`${TAG} ADMIN_EMAIL not configured — admin notification skipped for ${bookingId}`);
      }
    } else {
      console.warn(`${TAG} RESEND_API_KEY not configured — emails NOT sent for ${bookingId}`);
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
