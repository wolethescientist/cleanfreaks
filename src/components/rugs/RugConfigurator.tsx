"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RUG_SERVICES, RUG_INCLUDES, PRICE_PER_RUG } from "@/constants/rugs";
import { RugServiceType } from "@/types/booking";
import { Sparkles, Home, Truck, Check, ArrowRight, ShieldCheck, Plus, Minus, Info } from "lucide-react";

type RugConfiguratorProps = {
  rugCount: number;
  serviceType: RugServiceType;
  onProceed: (count: number, type: RugServiceType) => void;
};

export default function RugConfigurator({
  rugCount: initialCount,
  serviceType: initialType,
  onProceed,
}: RugConfiguratorProps) {
  const [count, setCount] = useState<number>(initialCount || 1);
  const [type, setType] = useState<RugServiceType>(initialType || 'pickup');

  const totalPrice = count * PRICE_PER_RUG;
  const totalPriceFormatted = `₦${totalPrice.toLocaleString()}`;

  const handleIncrement = () => {
    setCount((prev) => Math.min(prev + 1, 30));
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max(prev - 1, 1));
  };

  const setExactCount = (c: number) => {
    setCount(c);
  };

  const currentService = RUG_SERVICES[type];

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Service Type Selection Cards */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-[#00774D] bg-[#E7F5E4] px-4 py-1.5 rounded-full border border-[#51A432]/20">
            Step 1 • Choose Your Service Method
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#373A3C] tracking-tight mt-3">
            How would you like your rugs cleaned?
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-medium mt-2 max-w-xl mx-auto">
            Select between on-site treatment at your location or deep facility wash with complimentary doorstep pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup & Delivery */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setType('pickup')}
            className={`cursor-pointer relative p-6 sm:p-8 rounded-[2rem] transition-all border-2 flex flex-col justify-between ${
              type === 'pickup'
                ? 'bg-white border-[#51A432] shadow-[0_16px_40px_rgba(81,164,50,0.18)] ring-4 ring-[#E7F5E4]'
                : 'bg-white/80 border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            }`}
          >
            {type === 'pickup' && (
              <div className="absolute top-5 right-5 bg-[#51A432] text-white p-1 rounded-full shadow-md">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3.5 rounded-2xl ${type === 'pickup' ? 'bg-[#51A432] text-white' : 'bg-[#E7F5E4] text-[#00774D]'}`}>
                  <Truck size={24} />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-[#E7F5E4] text-[#00774D] px-2.5 py-0.5 rounded-full mb-1">
                    {RUG_SERVICES.pickup.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    {RUG_SERVICES.pickup.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                {RUG_SERVICES.pickup.description}
              </p>

              <div className="space-y-2.5 mb-6">
                {RUG_SERVICES.pickup.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="bg-[#E7F5E4] p-1 rounded-full text-[#51A432] shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#00774D]">
                <Sparkles size={14} className="text-[#51A432]" />
                {RUG_SERVICES.pickup.duration}
              </span>
              <span className="text-xs uppercase tracking-wider font-black text-[#51A432]">Free Pickup</span>
            </div>
          </motion.div>

          {/* On-Site Cleaning */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setType('on-site')}
            className={`cursor-pointer relative p-6 sm:p-8 rounded-[2rem] transition-all border-2 flex flex-col justify-between ${
              type === 'on-site'
                ? 'bg-white border-[#51A432] shadow-[0_16px_40px_rgba(81,164,50,0.18)] ring-4 ring-[#E7F5E4]'
                : 'bg-white/80 border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            }`}
          >
            {type === 'on-site' && (
              <div className="absolute top-5 right-5 bg-[#51A432] text-white p-1 rounded-full shadow-md">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3.5 rounded-2xl ${type === 'on-site' ? 'bg-[#51A432] text-white' : 'bg-[#E7F5E4] text-[#00774D]'}`}>
                  <Home size={24} />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full mb-1">
                    {RUG_SERVICES['on-site'].badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    {RUG_SERVICES['on-site'].title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                {RUG_SERVICES['on-site'].description}
              </p>

              <div className="space-y-2.5 mb-6">
                {RUG_SERVICES['on-site'].highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="bg-[#E7F5E4] p-1 rounded-full text-[#51A432] shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#00774D]">
                <Sparkles size={14} className="text-[#51A432]" />
                {RUG_SERVICES['on-site'].duration}
              </span>
              <span className="text-xs uppercase tracking-wider font-black text-[#51A432]">No Moving Required</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quantity & Live Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-gray-100 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Quantity Controls */}
          <div className="lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-widest text-[#00774D] bg-[#E7F5E4] px-4 py-1.5 rounded-full border border-[#51A432]/20">
              Step 2 • Select Quantity
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3 mb-2">
              How many rugs do you have?
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              Flat rate of <span className="font-black text-[#51A432]">₦15,000</span> per rug, regardless of size or material.
            </p>

            {/* Quick chips */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setExactCount(num)}
                  className={`w-11 h-11 rounded-2xl font-black text-sm transition-all ${
                    count === num
                      ? 'bg-[#51A432] text-white shadow-md shadow-[#51A432]/30 scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-[#E7F5E4] hover:text-[#00774D]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-xs font-bold text-gray-400 pl-2">or adjust below:</span>
            </div>

            {/* Counter bar */}
            <div className="flex items-center gap-5">
              <div className="inline-flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count <= 1}
                  className="w-12 h-12 rounded-xl bg-white text-gray-700 hover:text-[#51A432] hover:bg-[#E7F5E4] disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition-all shadow-sm"
                  aria-label="Decrease rug count"
                >
                  <Minus size={20} strokeWidth={2.5} />
                </button>

                <div className="w-20 text-center">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">{count}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {count === 1 ? 'Rug' : 'Rugs'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-12 h-12 rounded-xl bg-[#51A432] text-white hover:bg-[#00774D] flex items-center justify-center transition-all shadow-md shadow-[#51A432]/30"
                  aria-label="Increase rug count"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                <p className="font-bold text-gray-800">
                  {count} {count === 1 ? 'Rug' : 'Rugs'} × ₦15,000
                </p>
                <p className="text-[11px] text-gray-400">All materials & sizes included</p>
              </div>
            </div>
          </div>

          {/* Price Calculation Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#E7F5E4]/80 to-[#E7F5E4]/30 rounded-3xl p-6 sm:p-8 border border-[#51A432]/20 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00774D] mb-1">
                Order Estimate
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                  {totalPriceFormatted}
                </span>
                <span className="text-xs font-bold text-gray-500">Total</span>
              </div>

              <div className="space-y-2 border-t border-[#51A432]/10 pt-4 mb-6 text-xs text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>Selected Service:</span>
                  <span className="font-black text-gray-900">{currentService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Rugs:</span>
                  <span className="font-black text-gray-900">{count} {count === 1 ? 'Rug' : 'Rugs'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup / Visit Fee:</span>
                  <span className="font-black text-[#51A432]">FREE</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onProceed(count, type)}
              className="w-full bg-[#51A432] text-white py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(81,164,50,0.35)] hover:shadow-[0_12px_30px_rgba(81,164,50,0.45)] hover:-translate-y-1 transition-all"
            >
              Continue to Schedule
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Inclusions & Quality Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Deep Sanitization</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Industrial hot water extraction eradicates bacteria, stubborn dirt, and embedded dust mites deep within rug fibers.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Color & Fiber Safe</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Custom pH-balanced detergents ensure your dyes remain vibrant without color bleed, shrinkage, or texture stiffness.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Stain & Odor Removal</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Specialized spot-treatment for pet messes, wine, grease, oil, and coffee with complete odor neutralization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
