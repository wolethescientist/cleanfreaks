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
import { Sparkles, ArrowLeft } from "lucide-react";

const STEPS = ["Select Plan", "Schedule", "Details", "Payment"];

export default function CleanFreaksBooking() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    plan: null,
    date: null,
    timeSlot: null,
    customer: { name: "", email: "", phone: "" },
    bookingId: null,
  });

  const handlePlanSelect = (plan: Plan) => {
    setBookingData({ ...bookingData, plan });
    setStep(1);
  };

  const handleDateTimeSelect = (date: Date, timeSlot: string) => {
    setBookingData({ ...bookingData, date, timeSlot });
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
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <Image 
            src="/logo.jpeg" 
            alt="Clean Freaks Logo" 
            width={200} 
            height={80} 
            className="h-12 w-auto object-contain mb-2"
          />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Professional Cleaning Services</p>
        </div>
      </header>

      {/* Hero Section (Only on Step 0) */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto text-center py-16 px-4"
          >
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} />
              Quarterly Cleaning Subscriptions
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              A Cleaner Home, <br />
              <span className="text-brand-primary">A Fresher Life.</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed italic">
              Experience consistent excellence with our structured cleaning plans. 
              Designed for busy households who value quality and reliability.
            </p>
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
                  selectedDate={bookingData.date}
                  selectedTime={bookingData.timeSlot}
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
      <footer className="mt-20 py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Image 
            src="/logo.jpeg" 
            alt="Clean Freaks Logo" 
            width={120} 
            height={50} 
            className="h-8 w-auto object-contain mx-auto mb-6 opacity-50 grayscale hover:grayscale-0 transition-all"
          />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Clean Freaks by Henam. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
