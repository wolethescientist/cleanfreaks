"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookingData, Plan } from "@/types/booking";
import StepProgress from "@/components/booking/StepProgress";
import PlanSelection from "@/components/booking/PlanSelection";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import PaymentPage from "@/components/booking/PaymentPage";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { WIRE_DATE_FORMAT } from "@/lib/booking";
import { Sparkles, ArrowLeft, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const STEPS = ["Proceed", "Schedule", "Details", "Payment"];

export default function CleanFreaksBookingPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Home Care Booking State
  const [bookingData, setBookingData] = useState<BookingData>({
    plan: null,
    quantity: 1,
    dates: [],
    timeSlot: null,
    customer: { name: "", email: "", phone: "", address: "" },
    bookingId: null,
  });

  const handlePlanSelect = (plan: Plan, quantity = 1) => {
    const changedProduct = bookingData.plan?.id !== plan.id;
    setBookingData({
      ...bookingData,
      plan,
      quantity,
      ...(changedProduct ? { dates: [], timeSlot: null } : {}),
    });
    setStep(1);
  };

  const handleDateTimeSelect = (dates: Date[], timeSlot: string) => {
    setBookingData({ ...bookingData, dates, timeSlot });
    setStep(2);
  };

  const handleFormSubmit = async (customer: { name: string; email: string; phone: string; address: string }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          dates: bookingData.dates.map((d) => format(d, WIRE_DATE_FORMAT)),
          customer,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setBookingData({
          ...bookingData,
          customer,
          bookingId: result.bookingId,
        });
        setStep(3);
      } else if (result.error === "SLOT_FULL") {
        alert(result.message);
        setStep(1);
      } else {
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error submitting booking. Please check your connection.");
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
      {/* Header - Clean logo, NO tab switcher */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full py-4 flex flex-col items-center justify-center bg-transparent px-4"
      >
        <Link href="/cleanfreaks" className="drop-shadow-sm hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo1.png"
            alt="Clean Freaks Logo"
            width={920}
            height={260}
            className="h-16 sm:h-22 md:h-26 w-auto object-contain object-center"
            priority
          />
        </Link>
      </motion.header>

      {/* Hero Section (Step 0) */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            key="home-hero"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto text-center pt-2 pb-6 px-4"
          >
            <motion.h1
              className="text-3xl sm:text-5xl md:text-6xl font-black text-[#373A3C] tracking-tight leading-[1.15] mb-3 sm:mb-4"
            >
              A Cleaner Home, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51A432] to-[#00774D]">
                A Fresher Life.
              </span>
            </motion.h1>

            {/* Price-first banner */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/95 border-2 border-[#51A432]/30 px-4 sm:px-6 py-2 rounded-2xl shadow-sm mb-3">
              <span className="text-xs sm:text-sm font-black text-gray-900">
                Plans from <span className="text-[#51A432] text-sm sm:text-base">₦45,000</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs sm:text-sm font-black text-gray-900">
                Rug Care <span className="text-[#51A432] text-sm sm:text-base">₦15,000</span>/rug
              </span>
            </div>

            {/* Direct Link to Rug Cleaning */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/rugs"
                className="inline-flex items-center gap-2 bg-[#E7F5E4] hover:bg-[#d8eed4] text-[#00774D] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#51A432]/30 shadow-sm transition-all hover:scale-105"
              >
                <Sparkles size={15} className="text-[#51A432] animate-pulse" />
                <span>Looking for Rug Cleaning? Book Rugs Here (₦15,000/rug) →</span>
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-2 sm:mt-4">
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
        <div className="mt-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="home-step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PlanSelection
                  selectedPlan={bookingData.plan}
                  selectedQuantity={bookingData.quantity}
                  onSelect={handlePlanSelect}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="home-step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <BookingCalendar
                  selectedDates={bookingData.dates}
                  selectedTime={bookingData.timeSlot}
                  plan={bookingData.plan}
                  onSelect={handleDateTimeSelect}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="home-step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <BookingForm
                  customer={bookingData.customer}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="home-step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <PaymentPage booking={bookingData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-12 pb-8 border-t border-gray-100 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 mb-10 text-center md:text-left text-gray-600">
            {/* Logo & About */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <Image
                src="/logo1.png"
                alt="Clean Freaks Logo"
                width={220}
                height={80}
                className="h-12 sm:h-14 w-auto object-contain mb-1"
              />
              <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-xs text-gray-500">
                Professional residential, commercial, and rug cleaning services powered by Henam Facility Management Limited.
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Contact Us</h4>
              <a href="tel:08112220561" className="flex items-center gap-3 text-xs sm:text-sm hover:text-[#51A432] transition-colors group">
                <span className="bg-[#E7F5E4] p-2 rounded-full text-[#51A432] group-hover:bg-[#51A432] group-hover:text-white transition-colors duration-300">
                  <Phone size={15} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-[#51A432] transition-colors duration-300">
                  081 1222 0561
                </span>
              </a>
              <a href="tel:08112220562" className="flex items-center gap-3 text-xs sm:text-sm hover:text-[#51A432] transition-colors group">
                <span className="bg-[#E7F5E4] p-2 rounded-full text-[#51A432] group-hover:bg-[#51A432] group-hover:text-white transition-colors duration-300">
                  <Phone size={15} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-[#51A432] transition-colors duration-300">
                  081 1222 0562
                </span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/henamfacility.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-2.5 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-2.5 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-[#51A432] hover:text-white text-gray-500 hover:-translate-y-1 p-2.5 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Clean Freaks by Henam Facility Management Limited (henamfacility.com). All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
