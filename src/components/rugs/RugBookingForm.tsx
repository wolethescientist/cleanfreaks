"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, ArrowRight, Loader2, FileText, Check } from "lucide-react";
import { motion } from "framer-motion";
import TermsModal from "@/components/booking/TermsModal";
import { RugServiceType } from "@/types/booking";

type RugBookingFormProps = {
  customer: { name: string; email: string; phone: string; address: string; notes?: string };
  rugCount: number;
  serviceType: RugServiceType;
  totalPriceFormatted: string;
  onSubmit: (data: { name: string; email: string; phone: string; address: string; notes?: string }) => void;
  isSubmitting: boolean;
};

export default function RugBookingForm({
  customer,
  rugCount,
  serviceType,
  totalPriceFormatted,
  onSubmit,
  isSubmitting,
}: RugBookingFormProps) {
  const [formData, setFormData] = useState(customer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required for service";
    if (!termsAccepted) newErrors.terms = "You must agree to the Terms & Conditions to proceed";

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
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-[#00774D] bg-[#E7F5E4] px-4 py-1.5 rounded-full border border-[#51A432]/20">
            Step 3 • Customer & Location
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
            Service & Contact Details
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {serviceType === 'pickup'
              ? 'Where should our logistics team collect and deliver your rugs?'
              : 'Where should our cleaning crew meet you?'}
          </p>

          <div className="mt-4 inline-flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-xs font-bold text-gray-700">
            <span>{rugCount} {rugCount === 1 ? 'Rug' : 'Rugs'}</span>
            <span className="text-[#51A432]">•</span>
            <span>{serviceType === 'pickup' ? 'Doorstep Pickup & Delivery' : 'On-Site Cleaning'}</span>
            <span className="text-[#51A432]">•</span>
            <span className="text-[#00774D] font-black">{totalPriceFormatted}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <User size={15} className="text-[#00774D]" /> Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Adeola Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${
                errors.name
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 hover:border-[#51A432]/30 focus:border-[#51A432] focus:bg-[#E7F5E4]/20 bg-gray-50/50'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <Mail size={15} className="text-[#00774D]" /> Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. adeola@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${
                errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 hover:border-[#51A432]/30 focus:border-[#51A432] focus:bg-[#E7F5E4]/20 bg-gray-50/50'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <Phone size={15} className="text-[#00774D]" /> Phone Number (WhatsApp preferred)
            </label>
            <input
              type="tel"
              placeholder="e.g. +234 801 234 5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${
                errors.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 hover:border-[#51A432]/30 focus:border-[#51A432] focus:bg-[#E7F5E4]/20 bg-gray-50/50'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">{errors.phone}</p>}
          </div>

          {/* House Address */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={15} className="text-[#00774D]" /> Full Street Address & Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 3B, Palmview Estate, Lekki Phase 1, Lagos"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all outline-none font-medium text-gray-800 ${
                errors.address
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 hover:border-[#51A432]/30 focus:border-[#51A432] focus:bg-[#E7F5E4]/20 bg-gray-50/50'
              }`}
            />
            {errors.address && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">{errors.address}</p>}
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <FileText size={15} className="text-[#00774D]" /> Rug Details / Special Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 1 shaggy rug in master bedroom, 1 wool rug with coffee stain in living room..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#51A432]/30 focus:border-[#51A432] focus:bg-[#E7F5E4]/20 bg-gray-50/50 transition-all outline-none font-medium text-gray-800 resize-none text-sm"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.terms;
                        return next;
                      });
                    }
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    termsAccepted
                      ? 'bg-[#51A432] border-[#51A432]'
                      : errors.terms
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 group-hover:border-[#51A432]/50'
                  }`}
                >
                  {termsAccepted && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#51A432] font-black underline underline-offset-2 hover:text-[#00774D] transition-colors"
                >
                  Terms & Conditions
                </button>{' '}
                of CleanFreaks by Henam.
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs font-bold uppercase mt-2 px-1">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-[#51A432] text-white py-5 rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#00774D] transform hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:transform-none shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing Booking...
              </>
            ) : (
              <>
                Confirm & Proceed to Payment
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
