"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BookingData, Plan, RugBookingData, RugServiceType } from "@/types/booking";
import StepProgress from "@/components/booking/StepProgress";
import PlanSelection from "@/components/booking/PlanSelection";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingForm from "@/components/booking/BookingForm";
import PaymentPage from "@/components/booking/PaymentPage";
import RugConfigurator from "@/components/rugs/RugConfigurator";
import RugBookingCalendar from "@/components/rugs/RugBookingCalendar";
import RugBookingForm from "@/components/rugs/RugBookingForm";
import RugPaymentPage from "@/components/rugs/RugPaymentPage";
import { PRICE_PER_RUG, RUG_FAQ } from "@/constants/rugs";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { WIRE_DATE_FORMAT } from "@/lib/booking";
import { Sparkles, ArrowLeft, Phone, Instagram, Facebook, Twitter, ChevronDown, Tag } from "lucide-react";

const HOME_STEPS = ["Proceed", "Schedule", "Details", "Payment"];
const RUG_STEPS = ["Rugs & Type", "Schedule", "Details", "Payment"];

function CleanFreaksBookingContent() {
  const searchParams = useSearchParams();

  const checkIsRugs = () => {
    const service = searchParams.get("service")?.toLowerCase();
    const tab = searchParams.get("tab")?.toLowerCase();
    return (
      service === "rugs" ||
      service === "rug" ||
      tab === "rugs" ||
      tab === "rug" ||
      searchParams.has("rugs") ||
      searchParams.has("rug")
    );
  };

  const [serviceMode, setServiceMode] = useState<"home" | "rugs">(() => (checkIsRugs() ? "rugs" : "home"));
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (checkIsRugs()) {
      setServiceMode("rugs");
    } else if (typeof window !== "undefined" && window.location.hash.toLowerCase().includes("rug")) {
      setServiceMode("rugs");
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, serviceMode]);

  // Home Care Booking State
  const [bookingData, setBookingData] = useState<BookingData>({
    plan: null,
    quantity: 1,
    dates: [],
    timeSlot: null,
    customer: { name: "", email: "", phone: "", address: "" },
    bookingId: null,
  });

  // Rug Cleaning Booking State
  const [rugBookingData, setRugBookingData] = useState<RugBookingData>({
    rugCount: 1,
    serviceType: "pickup",
    pricePerRug: PRICE_PER_RUG,
    totalPrice: PRICE_PER_RUG,
    totalPriceFormatted: `₦${PRICE_PER_RUG.toLocaleString()}`,
    date: null,
    timeSlot: null,
    customer: { name: "", email: "", phone: "", address: "", notes: "" },
    bookingId: null,
  });

  // Home Care Handlers
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

  const handleHomeDateTimeSelect = (dates: Date[], timeSlot: string) => {
    setBookingData({ ...bookingData, dates, timeSlot });
    setStep(2);
  };

  const handleHomeFormSubmit = async (customer: { name: string; email: string; phone: string; address: string }) => {
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

  // Rug Cleaning Handlers
  const handleRugConfigProceed = (count: number, type: RugServiceType) => {
    const total = count * PRICE_PER_RUG;
    setRugBookingData((prev) => ({
      ...prev,
      rugCount: count,
      serviceType: type,
      totalPrice: total,
      totalPriceFormatted: `₦${total.toLocaleString()}`,
    }));
    setStep(1);
  };

  const handleRugDateTimeSelect = (date: Date, timeSlot: string) => {
    setRugBookingData((prev) => ({
      ...prev,
      date,
      timeSlot,
    }));
    setStep(2);
  };

  const handleRugFormSubmit = async (customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: "rugs",
          rugCount: rugBookingData.rugCount,
          serviceType: rugBookingData.serviceType,
          totalPrice: rugBookingData.totalPrice,
          totalPriceFormatted: rugBookingData.totalPriceFormatted,
          date: rugBookingData.date,
          timeSlot: rugBookingData.timeSlot,
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
        setRugBookingData((prev) => ({
          ...prev,
          customer,
          bookingId: result.bookingId,
        }));
        setStep(3);
      } else if (result.error === "SLOT_FULL") {
        alert(result.message || "This slot is full. Please choose another time.");
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

  const switchMode = (mode: "home" | "rugs") => {
    setServiceMode(mode);
    setStep(0);
  };

  const activeSteps = serviceMode === "home" ? HOME_STEPS : RUG_STEPS;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E7F5E4]/50 via-white to-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full py-4 flex flex-col items-center justify-center gap-3 bg-transparent px-4"
      >
        <div className="drop-shadow-sm hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo1.png"
            alt="Clean Freaks Logo"
            width={920}
            height={260}
            className="h-16 sm:h-22 md:h-26 w-auto object-contain object-center"
            priority
          />
        </div>

        {/* In-Page Service Switcher - Works perfectly inside WordPress iframe */}
        <div className="inline-flex items-center p-1.5 bg-gray-100/90 rounded-full border border-gray-200 shadow-inner">
          <button
            type="button"
            onClick={() => switchMode("home")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
              serviceMode === "home"
                ? "bg-[#51A432] text-white shadow-md shadow-[#51A432]/30"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home Care Plans
          </button>
          <button
            type="button"
            onClick={() => switchMode("rugs")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
              serviceMode === "rugs"
                ? "bg-[#51A432] text-white shadow-md shadow-[#51A432]/30"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Rug Cleaning (₦15k/rug)
          </button>
        </div>
      </motion.header>

      {/* Hero Section (Only on Step 0) */}
      <AnimatePresence mode="wait">
        {step === 0 && serviceMode === "home" && (
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

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => switchMode("rugs")}
                className="inline-flex items-center gap-2 bg-[#E7F5E4] hover:bg-[#d8eed4] text-[#00774D] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#51A432]/30 shadow-sm transition-all hover:scale-105"
              >
                <Sparkles size={15} className="text-[#51A432] animate-pulse" />
                <span>Looking for Rug Cleaning? Switch to Rugs →</span>
              </button>
            </div>
          </motion.section>
        )}

        {step === 0 && serviceMode === "rugs" && (
          <motion.section
            key="rugs-hero"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto text-center pt-2 pb-6 px-4"
          >
            {/* Prominent Price Callout - The First Thing Users See */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/95 border-2 border-[#51A432]/40 px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl sm:rounded-full shadow-lg shadow-[#51A432]/10 mb-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  ₦15,000
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                  / per rug
                </span>
              </div>
              <div className="hidden sm:block h-7 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-xs font-bold text-[#00774D]">
                <span className="bg-[#E7F5E4] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  Flat Rate
                </span>
                <span>All Sizes • Free Doorstep Pickup</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#373A3C] tracking-tight leading-[1.1] mb-2 sm:mb-3">
              Restore Your Rugs to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51A432] to-[#00774D]">
                Showroom Freshness.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed px-2 mb-2">
              Industrial hot water extraction, stubborn stain removal, and antibacterial sanitation for Persian, wool, shag, and everyday rugs.
            </p>

            <button
              type="button"
              onClick={() => switchMode("home")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#51A432] transition-colors"
            >
              ← Back to Home Care Cleaning Plans
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-2 sm:mt-4">
        {/* Step Progress */}
        <StepProgress currentStep={step} steps={activeSteps} />

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

        {/* Content Area */}
        <div className="mt-2">
          {/* HOME CARE WIZARD FLOW */}
          {serviceMode === "home" && (
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
                    onSwitchToRugs={() => switchMode("rugs")}
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
                    onSelect={handleHomeDateTimeSelect}
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
                    onSubmit={handleHomeFormSubmit}
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
          )}

          {/* RUG CLEANING WIZARD FLOW */}
          {serviceMode === "rugs" && (
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="rug-step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RugConfigurator
                    rugCount={rugBookingData.rugCount}
                    serviceType={rugBookingData.serviceType}
                    onProceed={handleRugConfigProceed}
                  />

                  {/* FAQ */}
                  <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 text-center tracking-tight mb-6">
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
                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-black text-xs sm:text-sm text-gray-800 hover:text-[#51A432] transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 text-gray-400 ${
                                openFaq === idx ? "rotate-180 text-[#51A432]" : ""
                              }`}
                            />
                          </button>
                          {openFaq === idx && (
                            <div className="px-4 sm:px-5 pb-4 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-3">
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
                  key="rug-step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RugBookingCalendar
                    selectedDate={rugBookingData.date}
                    selectedTime={rugBookingData.timeSlot}
                    serviceType={rugBookingData.serviceType}
                    onSelect={handleRugDateTimeSelect}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="rug-step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RugBookingForm
                    customer={rugBookingData.customer}
                    rugCount={rugBookingData.rugCount}
                    serviceType={rugBookingData.serviceType}
                    totalPriceFormatted={rugBookingData.totalPriceFormatted}
                    onSubmit={handleRugFormSubmit}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="rug-step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <RugPaymentPage booking={rugBookingData} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
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

export default function CleanFreaksBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E7F5E4]/30 flex items-center justify-center font-bold text-[#00774D]">Loading CleanFreaks...</div>}>
      <CleanFreaksBookingContent />
    </Suspense>
  );
}
