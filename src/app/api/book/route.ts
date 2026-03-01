import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';
import { format } from 'date-fns';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { plan, dates, timeSlot, customer } = data;

    // 1. Generate Unique Booking ID (e.g., CF-YYYYMMDD-001)
    const today = new Date();
    const dateStr = format(today, 'yyyyMMdd');
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingId = `CF-${dateStr}-${randomStr}`;

    const formattedDates = dates && dates.length > 0
      ? dates.map((d: string | Date) => format(new Date(d), 'MMMM d, yyyy')).join(', ')
      : 'N/A';

    // 2. Save to Google Sheets (if credentials exist)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
      try {
        const auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Sheet1!A:J',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              bookingId,
              customer.name,
              customer.email,
              customer.phone,
              plan.name,
              plan.priceFormatted,
              formattedDates,
              timeSlot,
              new Date().toISOString(),
              "Not Paid"
            ]],
          },
        });
      } catch (sheetError) {
        console.error('Google Sheets Error:', sheetError);
        // Continue even if sheets fail, but log it
      }
    }

    // 3. Send Emails via Resend (if API key exists)
    if (process.env.RESEND_API_KEY) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'oluwalz247@gmail.com';
        const senderEmail = process.env.SENDER_EMAIL || 'noreply@henamfacility.com.ng';

        // Email to Admin
        await resend.emails.send({
          to: adminEmail,
          from: senderEmail,
          subject: `New Booking: ${bookingId} - ${customer.name}`,
          html: `
            <h3>New Booking Received</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Customer:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Plan:</strong> ${plan.name}</p>
            <p><strong>Schedule:</strong> <br/> ${formattedDates} <br/> at ${timeSlot}</p>
            <p><strong>Total Amount:</strong> ${plan.priceFormatted}</p>
          `,
        });

        // Email to Customer
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
      } catch (emailError) {
        console.error('Resend Email Error:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking processed successfully"
    });

  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error"
    }, { status: 500 });
  }
}
