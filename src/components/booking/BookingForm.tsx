"use client";

import { useState } from "react";
import { User, Mail, Phone, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type BookingFormProps = {
  customer: { name: string; email: string; phone: string };
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  isSubmitting: boolean;
};

export default function BookingForm({ customer, onSubmit, isSubmitting }: BookingFormProps) {
  const [formData, setFormData] = useState(customer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";

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
        className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        <h3 className="text-3xl font-black text-gray-900 mb-10 text-center tracking-tight">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-12 bg-brand-primary text-white py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-brand-secondary transform hover:-translate-y-1 transition-all disabled:bg-gray-400 disabled:transform-none disabled:shadow-none shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)]"
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

        <p className="text-center text-xs text-gray-400 mt-8 font-semibold italic border-t border-gray-100 pt-8">
          By confirming, you agree to our terms of service and professional cleaning standards.
        </p>
      </motion.div>
    </div>
  );
}
