"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Phone, Instagram, Facebook, Twitter, ShieldCheck, ChevronDown, Sparkle } from "lucide-react";
import StepProgress from "@/components/booking/StepProgress";
import RugConfigurator from "@/components/rugs/RugConfigurator";
import RugBookingCalendar from "@/components/rugs/RugBookingCalendar";
import RugBookingForm from "@/components/rugs/RugBookingForm";
import RugPaymentPage from "@/components/rugs/RugPaymentPage";
import { RugBookingData, RugServiceType } from "@/types/booking";
import { PRICE_PER_RUG, RUG_FAQ } from "@/constants/rugs";

const STEPS = ["Rugs & Type", "Schedule", "Details", "Payment"];

export default function RugCleaningPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [bookingData, setBookingData] = useState<RugBookingData>({
    rugCount: 1,
    serviceType: 'pickup',
    pricePerRug: PRICE_PER_RUG,
    totalPrice: PRICE_PER_RUG,
    totalPriceFormatted: `₦${PRICE_PER_RUG.toLocaleString()}`,
    date: null,
    timeSlot: null,
    customer: { name: "", email: "", phone: "", address: "", notes: "" },
    bookingId: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleConfigProceed = (count: number, type: RugServiceType) => {
    const total = count * PRICE_PER_RUG;
    setBookingData((prev) => ({
      ...prev,
      rugCount: count,
      serviceType: type,
      totalPrice: total,
      totalPriceFormatted: `₦${total.toLocaleString()}`,
    }));
    setStep(1);
  };

  const handleDateTimeSelect = (date: Date, timeSlot: string) => {
    setBookingData((prev) => ({
      ...prev,
      date,
      timeSlot,
    }));
    setStep(2);
  };

  const handleFormSubmit = async (customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType: 'rugs',
          rugCount: bookingData.rugCount,
          serviceType: bookingData.serviceType,
          totalPrice: bookingData.totalPrice,
          totalPriceFormatted: bookingData.totalPriceFormatted,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          notes: customer.notes,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingData((prev) => ({
          ...prev,
          customer,
          bookingId: result.bookingId,
        }));
        setStep(3);
      } else if (result.error === "SLOT_FULL") {
        alert(result.message || "This slot is full. Please pick a different time.");
        setStep(1);
      } else {
        alert("Something went wrong processing your booking. Please try again.");
      }
    } catch (error) {
      console.error("Rug booking error:", error);
      alert("Network error submitting booking. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (step > 0 && step < 3) {
      setStep(step - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E7F5E4]/50 via-white to-white pb-20">
      {/* Top Banner Navigation / Service Switcher */}
      <div className="w-full bg-[#00774D] text-white py-2.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-[#A2E28B]" />
        <span>Specialized Rug Restoration & Cleaning</span>
        <span className="hidden sm:inline text-white/50">•</span>
        <Link
          href="/cleanfreaks"
          className="underline underline-offset-2 hover:text-[#A2E28B] transition-colors font-extrabold"
        >
          Need Home Care Cleaning Plans instead? Click here →
        </Link>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full py-5 flex flex-col items-center justify-center gap-4 bg-transparent"
      >
        <Link href="/cleanfreaks" className="px-4 hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo1.png"
            alt="Clean Freaks Logo"
            width={920}
            height={260}
            className="h-20 sm:h-24 md:h-28 w-auto object-contain object-center"
            priority
          />
        </Link>

        {/* Segmented control tabs */}
        <div className="inline-flex items-center p-1.5 bg-gray-100/90 rounded-full border border-gray-200/80 shadow-inner">
          <Link
            href="/cleanfreaks"
            className="px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-all"
          >
            Home Care Plans
          </Link>
          <span className="px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-[#51A432] text-white shadow-md shadow-[#51A432]/30">
            Rug Cleaning
          </span>
        </div>
      </motion.header>

      {/* Hero Section (Visible on Step 0) */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto text-center pt-2 pb-6 px-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#E7F5E4] text-[#00774D] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#51A432]/30 shadow-sm mb-4">
              <Sparkle size={14} className="text-[#51A432] animate-pulse" />
              Flat ₦15,000 per Rug • Free Doorstep Pickup
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#373A3C] tracking-tight leading-[1.1] mb-4">
              Restore Your Rugs to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51A432] to-[#00774D]">
                Showroom Freshness.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Industrial steam extraction, stubborn stain removal, and antibacterial sanitation for Persian, wool, shag, and everyday rugs.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 mt-4">
        {/* Step Progress */}
        <StepProgress currentStep={step} steps={STEPS} />

        {/* Back Button */}
        {step > 0 && step < 3 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#51A432] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        {/* Wizard Steps */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RugConfigurator
                rugCount={bookingData.rugCount}
                serviceType={bookingData.serviceType}
                onProceed={handleConfigProceed}
              />

              {/* FAQ Section */}
              <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-gray-100">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 text-center tracking-tight mb-8">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {RUG_FAQ.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between font-black text-sm sm:text-base text-gray-800 hover:text-[#51A432] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 text-gray-400 ${
                            openFaq === idx ? "rotate-180 text-[#51A432]" : ""
                          }`}
                        />
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RugBookingCalendar
                selectedDate={bookingData.date}
                selectedTime={bookingData.timeSlot}
                serviceType={bookingData.serviceType}
                onSelect={handleDateTimeSelect}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RugBookingForm
                customer={bookingData.customer}
                rugCount={bookingData.rugCount}
                serviceType={bookingData.serviceType}
                totalPriceFormatted={bookingData.totalPriceFormatted}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <RugPaymentPage booking={bookingData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-16 pb-8 border-t border-gray-100 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12 text-center md:text-left text-gray-600">
            {/* Logo & About */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Image
                src="/logo1.png"
                alt="Clean Freaks Logo"
                width={220}
                height={80}
                className="h-14 sm:h-16 w-auto object-contain mb-2"
              />
              <p className="text-sm font-medium leading-relaxed max-w-xs text-gray-500">
                Specialized rug cleaning and restoration powered by CleanFreaks and Henam Facility Management Limited.
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Contact Us</h4>
              <a href="tel:08112220561" className="flex items-center gap-3 text-sm hover:text-[#51A432] transition-colors group">
                <span className="bg-[#E7F5E4] p-2.5 rounded-full text-[#51A432] group-hover:bg-[#51A432] group-hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-[#51A432] transition-colors duration-300">
                  081 1222 0561
                </span>
              </a>
              <a href="tel:08112220562" className="flex items-center gap-3 text-sm hover:text-[#51A432] transition-colors group">
                <span className="bg-[#E7F5E4] p-2.5 rounded-full text-[#51A432] group-hover:bg-[#51A432] group-hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-[#51A432] transition-colors duration-300">
                  081 1222 0562
                </span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/henamfacility.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-100">
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Clean Freaks by Henam Facility Management Limited. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
