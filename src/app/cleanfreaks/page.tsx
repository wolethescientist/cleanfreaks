"use client";

import { useState } from "react";
import Image from "next/image";
import { BookingData, Plan } from "@/types/booking";
import StepProgress from "@/components/booking/StepProgress";
import PlanSelection from "@/components/booking/PlanSelection";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import PaymentPage from "@/components/booking/PaymentPage";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const STEPS = ["Proceed", "Schedule", "Details", "Payment"];

export default function CleanFreaksBooking() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    plan: null,
    dates: [],
    timeSlot: null,
    customer: { name: "", email: "", phone: "" },
    bookingId: null,
  });

  const handlePlanSelect = (plan: Plan) => {
    setBookingData({ ...bookingData, plan });
    setStep(1);
  };

  const handleDateTimeSelect = (dates: Date[], timeSlot: string) => {
    setBookingData({ ...bookingData, dates, timeSlot });
    setStep(2);
  };

  const handleFormSubmit = async (customer: { name: string; email: string; phone: string }) => {
    setIsSubmitting(true);

    try {
      // Mock API call
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
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
      } else {
        alert("Something went wrong. Please try again.");
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
    <main className="min-h-screen bg-gradient-to-b from-[#E7F5E4]/40 to-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full py-8 flex justify-center bg-transparent"
      >
        <div className="relative h-20 w-64 md:h-28 md:w-[22rem] drop-shadow-sm hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo1.png"
            alt="Clean Freaks Logo"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </motion.header>

      {/* Hero Section (Only on Step 0) */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center pt-24 pb-20 px-4 md:pt-32"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#E7F5E4] text-[#00774D] px-6 py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest mb-10 border border-[#51A432]/20 shadow-sm"
            >
              <Sparkles size={18} className="text-[#51A432] animate-pulse" />
              Quarterly Cleaning Subscriptions
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-7xl md:text-[5.5rem] font-black text-[#373A3C] mb-8 tracking-tighter leading-[1.1]"
            >
              A Cleaner Home, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51A432] to-[#00774D]">A Fresher Life.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-[#373A3C]/80 font-semibold max-w-3xl mx-auto leading-relaxed px-4"
            >
              Experience consistent excellence with our structured cleaning plans.
              Designed for busy households who value quality and reliability.
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Step Progress */}
        <StepProgress currentStep={step} steps={STEPS} />

        {/* Back Button */}
        {step > 0 && step < 3 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        {/* Main Content Area */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PlanSelection
                  selectedPlan={bookingData.plan}
                  onSelect={handlePlanSelect}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
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
                key="step2"
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
                key="step3"
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
      <footer className="mt-24 pt-16 pb-8 border-t border-gray-100 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12 text-center md:text-left text-gray-600">
            {/* Logo & About */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Image
                src="/logo1.png"
                alt="Clean Freaks Logo"
                width={160}
                height={60}
                className="h-12 w-auto object-contain mb-2"
              />
              <p className="text-sm font-medium leading-relaxed max-w-xs text-gray-500">
                Elevating your living spaces with meticulous, reliable, and recurring professional cleaning services.
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Contact Us</h4>
              <a href="tel:08112220561" className="flex items-center gap-3 text-sm hover:text-brand-primary transition-colors group">
                <span className="bg-brand-light p-2.5 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-brand-primary transition-colors duration-300">081 1222 0561</span>
              </a>
              <a href="tel:08112220562" className="flex items-center gap-3 text-sm hover:text-brand-primary transition-colors group">
                <span className="bg-brand-light p-2.5 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                </span>
                <span className="font-bold text-gray-700 group-hover:text-brand-primary transition-colors duration-300">081 1222 0562</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-brand-primary hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-brand-primary hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-brand-primary hover:text-white text-gray-500 hover:-translate-y-1 p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
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
