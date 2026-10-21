"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRICE_PER_RUG, RUG_INCLUDES } from "@/constants/rugs";
import { RugServiceType } from "@/types/booking";
import { Truck, Home, Check, ArrowRight, Minus, Plus, ShieldCheck } from "lucide-react";
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
  const [type, setType] = useState<RugServiceType>(initialType || "pickup");

  const totalPrice = count * PRICE_PER_RUG;

  const handleIncrement = () => {
    setCount((prev) => Math.min(prev + 1, 30));
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-4">
      {/* Single CleanFreaks-Style Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white border-2 border-[#51A432]/40 shadow-[0_12px_45px_rgba(81,164,50,0.18)] flex flex-col transition-all duration-500"
      >
        {/* Most Popular / Flat Rate Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#51A432] text-white text-[10px] md:text-xs font-black px-5 py-1.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap border-2 border-white z-20">
          Flat Rate • All Sizes
        </div>

        {/* Top Price Section - Exact CleanFreaks Typography */}
        <div className="mb-6 mt-2">
          <div className="flex items-baseline gap-2 mb-2">
            <AnimatedPrice
              value={totalPrice}
              className="text-4xl sm:text-5xl font-black text-[#373A3C] tracking-tighter"
            />
            <span className="text-gray-400 font-bold text-xs sm:text-sm">
              {count === 1 ? "/ per rug" : `total for ${count} rugs`}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-black text-[#00774D] tracking-[0.15em] uppercase mb-3">
            Specialized Rug Cleaning & Restoration
          </h3>

          {/* Info Badges matching CleanFreaks style */}
          <div className="mb-2.5 flex items-center gap-2 bg-[#51A432]/5 p-2.5 rounded-xl border border-[#51A432]/10">
            <Truck size={15} className="text-[#51A432] shrink-0" strokeWidth={3} />
            <span className="text-xs font-black text-[#373A3C] tracking-wide">
              {type === "pickup"
                ? "Free Doorstep Pickup & Return Delivery Included"
                : "Professional On-Site Steam Cleaning Visit"}
            </span>
          </div>

          <div className="bg-white/80 inline-block px-3.5 py-2 rounded-xl border border-[#51A432]/10 shadow-sm w-full">
            <p className="text-[#51A432] font-black text-xs sm:text-sm tracking-wide">
              Any Rug Size or Texture
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs font-semibold mt-0.5">
              Persian, Wool, Shag, Turkish, Area Rugs & Runners
            </p>
          </div>
        </div>

        {/* Interactive Selection 1: Rug Quantity */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-gray-700">
              Select Number of Rugs:
            </span>
            <span className="text-xs font-black text-[#51A432]">
              ₦15,000 / rug
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Quick-number chips */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                    count === num
                      ? "bg-[#51A432] text-white shadow-md shadow-[#51A432]/30 scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#51A432]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Stepper counter */}
            <div className="inline-flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={count <= 1}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#E7F5E4] disabled:opacity-30 flex items-center justify-center font-black text-xs text-gray-700 transition-colors"
                aria-label="Decrease"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-8 text-center font-black text-sm text-gray-900">
                {count}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-[#51A432] hover:bg-[#00774D] flex items-center justify-center font-black text-xs text-white transition-colors"
                aria-label="Increase"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Selection 2: Service Method */}
        <div className="mb-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5">
            Choose Service Method:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setType("pickup")}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                type === "pickup"
                  ? "border-[#51A432] bg-[#E7F5E4]/60 shadow-sm ring-1 ring-[#51A432]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Truck
                size={18}
                className={`shrink-0 mt-0.5 ${type === "pickup" ? "text-[#51A432]" : "text-gray-400"}`}
              />
              <div>
                <p className="text-xs font-black text-gray-900">Facility Deep Wash</p>
                <p className="text-[10px] text-gray-500 font-medium">Free Doorstep Pickup & Return</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType("on-site")}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                type === "on-site"
                  ? "border-[#51A432] bg-[#E7F5E4]/60 shadow-sm ring-1 ring-[#51A432]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Home
                size={18}
                className={`shrink-0 mt-0.5 ${type === "on-site" ? "text-[#51A432]" : "text-gray-400"}`}
              />
              <div>
                <p className="text-xs font-black text-gray-900">On-Site Steam Clean</p>
                <p className="text-[10px] text-gray-500 font-medium">Done at your home or office</p>
              </div>
            </button>
          </div>
        </div>

        {/* What's Included - Exact CleanFreaks Checklist Style */}
        <div className="space-y-3 mb-6 flex-grow">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            What&apos;s Included:
          </p>
          {RUG_INCLUDES.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 bg-[#51A432]/10 p-1 rounded-full text-[#51A432] shrink-0 shadow-sm">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="text-[#373A3C]/80 text-[13px] font-semibold leading-relaxed">
                {item}
              </span>
            </div>
          ))}

          {/* Service specific extra highlight */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-[#51A432] p-1 rounded-full text-white shrink-0 shadow-sm">
              <Check size={12} strokeWidth={4} />
            </div>
            <span className="text-[#373A3C] text-[13px] font-black leading-relaxed">
              {type === "pickup"
                ? "Full immersion bath, centrifuge extraction & heat-chamber drying (Delivered 48–72h)"
                : "High-power on-site steam extraction with fast 2–4 hour drying turnaround"}
            </span>
          </div>
        </div>

        {/* Best For Section */}
        <div className="mt-auto border-t border-gray-100 pt-5 mb-6">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5">
            Best For:
          </p>
          <p className="text-[13px] text-[#373A3C]/90 font-medium leading-relaxed">
            &quot;Restoring Persian, Wool, Shag, Turkish, and high-traffic home rugs to spotless showroom freshness.&quot;
          </p>
        </div>

        {/* Proceed Button - Exact CleanFreaks Style */}
        <button
          type="button"
          onClick={() => onProceed(count, type)}
          className="w-full py-5 rounded-2xl font-black tracking-widest uppercase text-sm flex items-center justify-center gap-3 bg-[#51A432] text-white shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)] hover:-translate-y-1 transition-all duration-300"
        >
          Proceed to Schedule
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
