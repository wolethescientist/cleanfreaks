"use client";

import { useState } from "react";
import { User, Mail, Phone, ArrowRight, Loader2 } from "lucide-react";

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
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center uppercase tracking-tight">Your Details</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-brand-primary" /> Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-4 rounded-xl border-2 transition-all outline-none ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-brand-primary bg-gray-50/50"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-brand-primary" /> Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-4 rounded-xl border-2 transition-all outline-none ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-brand-primary bg-gray-50/50"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Phone size={16} className="text-brand-primary" /> Phone Number
            </label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-4 rounded-xl border-2 transition-all outline-none ${
                errors.phone ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-brand-primary bg-gray-50/50"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs font-bold uppercase mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-10 bg-brand-primary text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-dark transition-all disabled:bg-gray-400 shadow-xl shadow-brand-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Processing Booking...
              </>
            ) : (
              <>
                Confirm & Pay
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-400 mt-6 font-medium italic">
          By clicking Confirm & Pay, you agree to our terms of service and professional cleaning standards.
        </p>
      </div>
    </div>
  );
}
