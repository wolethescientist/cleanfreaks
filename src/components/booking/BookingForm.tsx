"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import TermsModal from "./TermsModal";

type BookingFormProps = {
  customer: { name: string; email: string; phone: string; address: string };
  onSubmit: (data: { name: string; email: string; phone: string; address: string }) => void;
  isSubmitting: boolean;
};

export default function BookingForm({ customer, onSubmit, isSubmitting }: BookingFormProps) {
  const [formData, setFormData] = useState(customer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!termsAccepted) newErrors.terms = "You must accept the Terms & Conditions to proceed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 md:mb-10 text-center tracking-tight">
          Complete Your <span className="text-brand-primary">Booking</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <User size={16} className="text-brand-secondary" /> Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${errors.name ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-brand-primary/30 focus:border-brand-primary focus:bg-brand-light/20 focus:shadow-[0_0_0_4px_rgba(81,164,50,0.1)] bg-gray-50/50"
                }`}
            />
            {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold uppercase mt-1 px-2">{errors.name}</motion.p>}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <Mail size={16} className="text-brand-secondary" /> Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-brand-primary/30 focus:border-brand-primary focus:bg-brand-light/20 focus:shadow-[0_0_0_4px_rgba(81,164,50,0.1)] bg-gray-50/50"
                }`}
            />
            {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold uppercase mt-1 px-2">{errors.email}</motion.p>}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <Phone size={16} className="text-brand-secondary" /> Phone Number
            </label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-brand-primary/30 focus:border-brand-primary focus:bg-brand-light/20 focus:shadow-[0_0_0_4px_rgba(81,164,50,0.1)] bg-gray-50/50"
                }`}
            />
            {errors.phone && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold uppercase mt-1 px-2">{errors.phone}</motion.p>}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-brand-secondary" /> House Address
            </label>
            <input
              type="text"
              placeholder="123 Cleaning St, Lagos"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${errors.address ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-brand-primary/30 focus:border-brand-primary focus:bg-brand-light/20 focus:shadow-[0_0_0_4px_rgba(81,164,50,0.1)] bg-gray-50/50"
                }`}
            />
            {errors.address && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold uppercase mt-1 px-2">{errors.address}</motion.p>}
          </div>

          {/* Terms & Conditions checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors((prev) => { const next = { ...prev }; delete next.terms; return next; });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${termsAccepted ? "bg-brand-primary border-brand-primary" : errors.terms ? "border-red-500 bg-red-50" : "border-gray-300 group-hover:border-brand-primary/50"}`}>
                  {termsAccepted && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium leading-snug">
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-brand-primary font-black underline underline-offset-2 hover:text-brand-secondary transition-colors"
                >
                  Terms & Conditions
                </button>
              </span>
            </label>
            {errors.terms && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold uppercase mt-2 px-1">
                {errors.terms}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-brand-primary text-white py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-brand-secondary transform hover:-translate-y-1 transition-all disabled:bg-gray-400 disabled:transform-none disabled:shadow-none shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Processing...
              </>
            ) : (
              <>
                Confirm Booking
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>

      </motion.div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
