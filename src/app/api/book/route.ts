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
import { MAX_PER_SLOT, SHEET_DATE_FORMAT } from '@/constants/schedule';

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
    const rawBody = await req.json();
    const isDedicatedRugBooking = rawBody.bookingType === 'rugs';

    let bookingId: string;
    let planName: string;
    let priceFormatted: string;
    let timeSlot: string;
    let formattedDates: string;
    let dateLabels: string[] = [];
    let customer: { name: string; email: string; phone: string; address: string; notes?: string };
    let skipCapacityCheck = false;

    const today = new Date();
    const dateStr = format(today, 'yyyyMMdd');
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    if (isDedicatedRugBooking) {
      const rugCount = Math.max(1, Number(rawBody.rugCount) || 1);
      const totalAmount = rugCount * 15000;
      priceFormatted = rawBody.totalPriceFormatted || `₦${totalAmount.toLocaleString()}`;
      const serviceLabel = rawBody.serviceType === 'pickup' ? 'Pickup & Delivery' : 'On-Site Cleaning';
      planName = `Rug Cleaning (${rugCount} ${rugCount === 1 ? 'Rug' : 'Rugs'} — ${serviceLabel})`;
      timeSlot = rawBody.timeSlot || '09:00 AM';
      bookingId = `CFR-${dateStr}-${randomStr}`;

      const rawDate = rawBody.date ? new Date(rawBody.date) : null;
      if (rawDate && !isNaN(rawDate.getTime())) {
        const label = format(rawDate, SHEET_DATE_FORMAT);
        dateLabels = [label];
        formattedDates = label;
      } else {
        formattedDates = 'N/A';
      }

      const c = rawBody.customer || {};
      customer = {
        name: String(c.name || '').trim().slice(0, 120),
        email: String(c.email || '').trim().slice(0, 200),
        phone: String(c.phone || '').trim().slice(0, 40),
        address: String(c.address || '').trim().slice(0, 300),
        notes: rawBody.notes ? String(rawBody.notes).trim().slice(0, 500) : undefined,
      };

      if (!customer.name || !customer.phone || !customer.address || !/\S+@\S+\.\S+/.test(customer.email)) {
        return NextResponse.json({
          success: false,
          error: 'INVALID_BOOKING',
          message: 'Please fill in your name, a valid email, phone number and address.',
        }, { status: 400 });
      }

      // Pickup services don't count against cleaning teams on-site, but on-site cleaning does
      skipCapacityCheck = rawBody.serviceType === 'pickup';
      console.log(`${TAG} [RUGS] Customer: ${customer.name} | Rugs: ${rugCount} | Type: ${rawBody.serviceType} | Time: ${timeSlot}`);
    } else {
      const validation = validateBooking(rawBody);
      if (!validation.ok) {
        console.warn(`${TAG} Rejected invalid booking: ${validation.message}`);
        return NextResponse.json({
          success: false,
          error: 'INVALID_BOOKING',
          message: validation.message,
        }, { status: 400 });
      }

      const valid = validation.booking;
      planName = valid.plan.name;
      priceFormatted = valid.plan.priceFormatted;
      timeSlot = valid.timeSlot;
      customer = valid.customer;
      dateLabels = valid.dateLabels;
      formattedDates = dateLabels.join(', ');
      bookingId = `CF-${dateStr}-${randomStr}`;
      skipCapacityCheck = isPerUnitPlan(valid.plan);

      console.log(`${TAG} [PLAN] Customer: ${customer.name} | Plan: ${planName} | Time: ${timeSlot} | Dates: ${dateLabels.length}`);
    }

    console.log(`${TAG} Generated booking ID: ${bookingId}`);

    // Check capacity and append to Sheets inside lock
    try {
      await withBookingLock(async () => {
        if (!skipCapacityCheck && dateLabels.length > 0 && timeSlot) {
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
            const addressField = customer.notes
              ? `${customer.address} (Notes: ${customer.notes})`
              : customer.address;

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
                  asText(addressField),
                  planName,
                  priceFormatted,
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

    // Send emails via Resend if key exists
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const senderEmail = process.env.SENDER_EMAIL || 'noreply@henamfacility.com.ng';

      // Customer email
      console.log(`${TAG} Sending confirmation email to ${customer.email}...`);
      try {
        const bodyContent = isDedicatedRugBooking ? `
          <div style="background: #F1F8F1; padding: 15px; border-radius: 10px; margin-bottom: 16px;">
            <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 4px 0;"><strong>Service:</strong> CleanFreaks Rug Cleaning</p>
            <p style="margin: 4px 0;"><strong>Plan / Details:</strong> ${planName}</p>
            <p style="margin: 4px 0;"><strong>Schedule:</strong> ${formattedDates} at ${timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Total Amount:</strong> ${priceFormatted}</p>
            ${customer.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${customer.notes}</p>` : ''}
          </div>
          <p>Please complete payment and send the transfer receipt via WhatsApp to finalize your booking.</p>
        ` : `
          <div style="background: #F1F8F1; padding: 15px; border-radius: 10px; margin-bottom: 16px;">
            <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 4px 0;"><strong>Plan:</strong> ${planName}</p>
            <p style="margin: 4px 0;"><strong>Schedule:</strong> <br/> ${formattedDates} <br/> at ${timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Total Amount:</strong> ${priceFormatted}</p>
          </div>
          <p>Please ensure you complete your payment and send the receipt to us via WhatsApp to finalize your cleaning schedule.</p>
        `;

        await resend.emails.send({
          to: customer.email,
          from: senderEmail,
          subject: isDedicatedRugBooking
            ? `Rug Cleaning Booking Confirmation: ${bookingId}`
            : `Booking Confirmation: ${bookingId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #2D5A27;">Hello ${customer.name},</h2>
              <p>Thank you for choosing <strong>Clean Freaks</strong>! Your booking has been successfully reserved.</p>
              ${bodyContent}
              <p>Best regards,<br/>The Clean Freaks Team</p>
            </div>
          `,
        });
        console.log(`${TAG} Confirmation email sent to ${customer.email}`);
      } catch (emailError) {
        console.error(`${TAG} Customer email send FAILED for ${bookingId}:`, emailError);
      }

      // Admin email
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        console.log(`${TAG} Sending admin notification to ${adminEmail}...`);
        try {
          await resend.emails.send({
            to: adminEmail,
            from: senderEmail,
            subject: `New Booking: ${bookingId} — ${customer.name} (${planName})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #2D5A27;">New Booking Received</h2>
                <div style="background: #F1F8F1; padding: 15px; border-radius: 10px; margin-bottom: 16px;">
                  <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
                  <p style="margin: 4px 0;"><strong>Service:</strong> ${planName}</p>
                  <p style="margin: 4px 0;"><strong>Total:</strong> ${priceFormatted}</p>
                  <p style="margin: 4px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
                  <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDates}</p>
                  ${customer.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${customer.notes}</p>` : ''}
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
      }
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
