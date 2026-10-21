"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RUG_SERVICES, PRICE_PER_RUG } from "@/constants/rugs";
import { RugServiceType } from "@/types/booking";
import { Sparkles, Home, Truck, Check, ArrowRight, ShieldCheck, Plus, Minus, Info, Tag } from "lucide-react";
import AnimatedPrice from "@/components/booking/AnimatedPrice";

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
  const currentService = RUG_SERVICES[type];

  const handleIncrement = () => {
    setCount((prev) => Math.min(prev + 1, 30));
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max(prev - 1, 1));
  };

  const setExactCount = (c: number) => {
    setCount(c);
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6 px-3 sm:px-4">
      {/* 1. LEAD WITH THE MONEY: Dynamic Quantity & Live Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.06)] border-2 border-[#51A432]/30 mb-8 sm:mb-10 relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#E7F5E4]/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Left Column: Rug Count Selector */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#E7F5E4] text-[#00774D] px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2">
              <Tag size={13} className="text-[#51A432]" />
              Flat Rate • ₦15,000 per Rug
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Select Number of Rugs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 mb-5">
              Any size or material (Persian, Wool, Shag, Area Rugs) — flat ₦15,000 each.
            </p>

            {/* Quick-select chips */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setExactCount(num)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-black text-sm transition-all shrink-0 ${
                    count === num
                      ? 'bg-[#51A432] text-white shadow-md shadow-[#51A432]/30 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-[#E7F5E4] hover:text-[#00774D] border border-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-xs font-bold text-gray-400 pl-2 whitespace-nowrap">or custom:</span>
            </div>

            {/* Interactive Counter Stepper */}
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center bg-gray-50 p-1.5 sm:p-2 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count <= 1}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white text-gray-700 hover:text-[#51A432] hover:bg-[#E7F5E4] disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition-all shadow-sm"
                  aria-label="Decrease rug count"
                >
                  <Minus size={18} strokeWidth={3} />
                </button>

                <div className="w-16 sm:w-20 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{count}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {count === 1 ? 'Rug' : 'Rugs'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#51A432] text-white hover:bg-[#00774D] flex items-center justify-center transition-all shadow-md shadow-[#51A432]/30"
                  aria-label="Increase rug count"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                <p className="font-bold text-gray-800 text-sm">
                  {count} {count === 1 ? 'Rug' : 'Rugs'} × ₦15,000
                </p>
                <p className="text-[11px] text-[#00774D] font-bold">✓ Free Doorstep Pickup</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Price Display Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#E7F5E4] to-[#E7F5E4]/50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#51A432]/20 flex flex-col justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#00774D] mb-1">
                Total Amount Due
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <AnimatedPrice
                  value={totalPrice}
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight"
                />
                <span className="text-xs sm:text-sm font-bold text-gray-500">Total</span>
              </div>

              <div className="space-y-1.5 border-t border-[#51A432]/15 pt-3 mb-5 text-xs text-gray-700 font-medium">
                <div className="flex justify-between">
                  <span>Price per rug:</span>
                  <span className="font-black text-gray-900">₦15,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Quantity:</span>
                  <span className="font-black text-gray-900">{count} {count === 1 ? 'Rug' : 'Rugs'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup & Delivery:</span>
                  <span className="font-black text-[#51A432]">FREE (₦0)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onProceed(count, type)}
              className="w-full bg-[#51A432] text-white py-4 sm:py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_8px_25px_rgba(81,164,50,0.35)] hover:shadow-[0_12px_30px_rgba(81,164,50,0.45)] hover:-translate-y-0.5 transition-all"
            >
              Continue to Schedule
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. SERVICE METHOD SELECTION */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#00774D] bg-[#E7F5E4] px-4 py-1.5 rounded-full border border-[#51A432]/20">
            Step 2 • Choose Service Method
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#373A3C] tracking-tight mt-2.5">
            How should we clean your rugs?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Choose between facility wash with free pickup or on-site cleaning in your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Pickup & Delivery */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => setType('pickup')}
            className={`cursor-pointer relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl transition-all border-2 flex flex-col justify-between ${
              type === 'pickup'
                ? 'bg-white border-[#51A432] shadow-[0_12px_35px_rgba(81,164,50,0.18)] ring-4 ring-[#E7F5E4]'
                : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
            }`}
          >
            {type === 'pickup' && (
              <div className="absolute top-4 right-4 bg-[#51A432] text-white p-1 rounded-full shadow-md">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl ${type === 'pickup' ? 'bg-[#51A432] text-white' : 'bg-[#E7F5E4] text-[#00774D]'}`}>
                  <Truck size={22} />
                </div>
                <div>
                  <span className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#E7F5E4] text-[#00774D] px-2.5 py-0.5 rounded-full mb-0.5">
                    {RUG_SERVICES.pickup.badge}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                    {RUG_SERVICES.pickup.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-4">
                {RUG_SERVICES.pickup.description}
              </p>

              <div className="space-y-2 mb-5">
                {RUG_SERVICES.pickup.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="bg-[#E7F5E4] p-0.5 rounded-full text-[#51A432] shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#00774D]">
                <Sparkles size={13} className="text-[#51A432]" />
                {RUG_SERVICES.pickup.duration}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-black text-[#51A432]">Free Pickup</span>
            </div>
          </motion.div>

          {/* On-Site Cleaning */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => setType('on-site')}
            className={`cursor-pointer relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl transition-all border-2 flex flex-col justify-between ${
              type === 'on-site'
                ? 'bg-white border-[#51A432] shadow-[0_12px_35px_rgba(81,164,50,0.18)] ring-4 ring-[#E7F5E4]'
                : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
            }`}
          >
            {type === 'on-site' && (
              <div className="absolute top-4 right-4 bg-[#51A432] text-white p-1 rounded-full shadow-md">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-2xl ${type === 'on-site' ? 'bg-[#51A432] text-white' : 'bg-[#E7F5E4] text-[#00774D]'}`}>
                  <Home size={22} />
                </div>
                <div>
                  <span className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full mb-0.5">
                    {RUG_SERVICES['on-site'].badge}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                    {RUG_SERVICES['on-site'].title}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-4">
                {RUG_SERVICES['on-site'].description}
              </p>

              <div className="space-y-2 mb-5">
                {RUG_SERVICES['on-site'].highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="bg-[#E7F5E4] p-0.5 rounded-full text-[#51A432] shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#00774D]">
                <Sparkles size={13} className="text-[#51A432]" />
                {RUG_SERVICES['on-site'].duration}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-black text-[#51A432]">No Hauling Needed</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. VALUE & QUALITY PROMISES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 shadow-sm">
          <div className="p-2.5 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide mb-0.5">Deep Extraction</h5>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              High-pressure hot extraction lifts ground-in dirt, pet odors, and allergen dust from deep pile.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 shadow-sm">
          <div className="p-2.5 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide mb-0.5">Color & Fiber Safe</h5>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              Safe for Persian, wool, silk, shag, sisal, and synthetic rugs without color bleeding or fiber stiffness.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 shadow-sm">
          <div className="p-2.5 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0">
            <Info size={18} />
          </div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide mb-0.5">Transparent Pricing</h5>
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              Flat ₦15,000 per rug with zero hidden fees, zero size surcharges, and free pickup and return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
