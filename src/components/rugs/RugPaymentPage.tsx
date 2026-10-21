"use client";

import { useState } from "react";
import { RugBookingData } from "@/types/booking";
import { Copy, MessageCircle, Check, Building, Calendar, Info, Layers, Truck, Home } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

type RugPaymentPageProps = {
  booking: RugBookingData;
};

const BANK_DETAILS = {
  bankName: "Access Bank",
  accountName: "Henam Facility Management Limited",
  accountNumber: "1883625366",
};

export default function RugPaymentPage({ booking }: RugPaymentPageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = booking.date
    ? format(booking.date, "EEEE, MMMM d, yyyy")
    : "Not specified";

  const serviceLabel = booking.serviceType === 'pickup'
    ? 'Doorstep Pickup & Facility Deep Wash'
    : 'On-Site Steam Cleaning';

  const whatsappMessage = `Hello Clean Freaks, 

I have just made a payment for my Rug Cleaning service.

Booking ID: ${booking.bookingId}
Service: Rug Cleaning (${booking.rugCount} ${booking.rugCount === 1 ? 'Rug' : 'Rugs'} — ${serviceLabel})
Amount: ${booking.totalPriceFormatted}
Scheduled Date: ${formattedDate}
Time Window: ${booking.timeSlot}
Customer: ${booking.customer.name}
Phone: ${booking.customer.phone}
Address: ${booking.customer.address}
${booking.customer.notes ? `Notes: ${booking.customer.notes}\n` : ''}
Please find my payment receipt attached below.`;

  const whatsappUrl = `https://wa.me/2349053121695?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Banner */}
        <div className="bg-[#51A432] p-5 sm:p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 backdrop-blur-sm shadow-inner">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1.5">
            Rug Booking Reserved!
          </h2>
          <p className="text-[#E7F5E4] font-medium text-xs sm:text-sm">
            Please complete transfer to confirm your scheduled slot
          </p>

          <div className="mt-4 inline-block bg-white/10 px-5 py-1.5 rounded-full border border-white/20">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mr-2 opacity-80">Booking ID:</span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-white">{booking.bookingId}</span>
          </div>
        </div>

        <div className="p-4 sm:p-7 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
            {/* Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Order Breakdown
              </h4>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-[#00774D] uppercase mb-1">
                    {booking.serviceType === 'pickup' ? <Truck size={14} /> : <Home size={14} />}
                    {serviceLabel}
                  </div>
                  <p className="text-3xl font-black text-gray-900 mb-4">{booking.totalPriceFormatted}</p>
                </div>

                <div className="space-y-2.5 border-t border-gray-200/60 pt-4 text-xs font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-[#51A432]" />
                    <span>{booking.rugCount} {booking.rugCount === 1 ? 'Rug' : 'Rugs'} (Flat ₦15,000/rug)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#51A432]" />
                    <span>{formattedDate} • {booking.timeSlot}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Building size={14} /> Bank Transfer Details
              </h4>
              <div className="bg-[#E7F5E4]/50 p-6 rounded-2xl border border-[#51A432]/20 relative overflow-hidden">
                <div className="space-y-3.5 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-[#00774D] uppercase tracking-wider">Bank Name</p>
                    <p className="font-bold text-gray-900">{BANK_DETAILS.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#00774D] uppercase tracking-wider">Account Name</p>
                    <p className="font-bold text-gray-900 text-sm">{BANK_DETAILS.accountName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#00774D] uppercase tracking-wider">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-[#51A432] tracking-tighter">
                        {BANK_DETAILS.accountNumber}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                        className="p-2.5 bg-white hover:bg-[#51A432] hover:text-white rounded-xl transition-all text-[#51A432] shadow-sm"
                        aria-label="Copy account number"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Call to action */}
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Once payment is sent, click below to send your receipt to our WhatsApp team for instant verification and pickup/service confirmation.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.01] transition-all shadow-xl shadow-green-200"
            >
              <MessageCircle size={22} />
              Confirm Payment via WhatsApp
            </a>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/cleanfreaks"
                className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#51A432] transition-colors"
              >
                ← Back to CleanFreaks Home Care
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#51A432] transition-colors"
              >
                Book Another Rug
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
