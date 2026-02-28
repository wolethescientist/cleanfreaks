"use client";

import { BookingData } from "@/types/booking";
import { Copy, MessageCircle, Check, CreditCard, Building, User as UserIcon, Calendar, Info } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

type PaymentPageProps = {
  booking: BookingData;
};

const BANK_DETAILS = {
  bankName: "Zenith Bank",
  accountName: "Clean Freaks by Henam",
  accountNumber: "1223456789", // Placeholder
};

export default function PaymentPage({ booking }: PaymentPageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Hello Clean Freaks, 

I have just made a payment for my booking.

*Booking ID:* ${booking.bookingId}
*Plan:* ${booking.plan?.name}
*Amount:* ${booking.plan?.priceFormatted}
*Date:* ${booking.date ? format(booking.date, "MMMM d, yyyy") : "N/A"}
*Time:* ${booking.timeSlot}
*Customer:* ${booking.customer.name}
*Phone:* ${booking.customer.phone}

Please find the receipt attached below.`;

  const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(whatsappMessage)}`; // Placeholder phone

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-brand-primary p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Booking Reserved!</h2>
          <p className="text-brand-light/80 font-medium">Please complete payment to secure your schedule</p>
          
          <div className="mt-6 inline-block bg-white/10 px-6 py-2 rounded-full border border-white/20">
             <span className="text-xs font-bold uppercase tracking-widest mr-2 opacity-70">Booking ID:</span>
             <span className="text-sm font-black tracking-wider">{booking.bookingId}</span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Info size={14} /> Plan Summary
               </h4>
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-sm font-bold text-brand-primary uppercase mb-1">{booking.plan?.name}</p>
                  <p className="text-2xl font-black text-gray-900 mb-4">{booking.plan?.priceFormatted}</p>
                  
                  <div className="space-y-2 border-t pt-4">
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-brand-secondary" />
                        <span>{booking.date ? format(booking.date, "MMMM d, yyyy") : "N/A"}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard size={14} className="text-brand-secondary" />
                        <span>{booking.timeSlot}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Building size={14} /> Bank Details
               </h4>
               <div className="bg-brand-light/50 p-6 rounded-2xl border border-brand-secondary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Building size={80} />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Bank Name</p>
                      <p className="font-bold text-gray-900">{BANK_DETAILS.bankName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Account Name</p>
                      <p className="font-bold text-gray-900">{BANK_DETAILS.accountName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Account Number</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-brand-primary tracking-tighter">{BANK_DETAILS.accountNumber}</p>
                        <button 
                          onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                          className="p-2 hover:bg-brand-primary hover:text-white rounded-lg transition-colors text-brand-primary"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
               <div className="bg-amber-100 p-2 rounded-lg h-fit text-amber-600">
                 <Info size={20} />
               </div>
               <p className="text-sm text-amber-800 font-medium leading-relaxed">
                 After making the transfer, please click the button below to send your payment receipt via WhatsApp for verification.
               </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-green-200"
            >
              <MessageCircle size={24} />
              Confirm via WhatsApp
            </a>
            
            <button 
              onClick={() => window.location.href = '/cleanfreaks'}
              className="w-full text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-brand-primary transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
