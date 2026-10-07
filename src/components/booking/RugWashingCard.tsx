"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, Truck } from "lucide-react";
import { RUG_WASHING } from "@/constants/plans";
import { buildBookingPlan } from "@/lib/booking";
import { formatNaira } from "@/lib/utils";
import type { Plan } from "@/types/booking";
import AnimatedPrice from "./AnimatedPrice";

type RugWashingCardProps = {
  selectedPlan: Plan | null;
  initialQuantity: number;
  onSelect: (plan: Plan, quantity: number) => void;
};

export default function RugWashingCard({ selectedPlan, initialQuantity, onSelect }: RugWashingCardProps) {
  const [quantity, setQuantity] = useState(selectedPlan?.id === RUG_WASHING.id ? initialQuantity : 1);
  const max = RUG_WASHING.maxQuantity ?? 20;
  const total = RUG_WASHING.price * quantity;
  const isSelected = selectedPlan?.id === RUG_WASHING.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className={`relative max-w-4xl mx-auto p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ${
        isSelected
          ? "bg-[#E7F5E4]/80 shadow-[0_12px_40px_rgba(81,164,50,0.15)] border border-[#51A432]/20"
          : "bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div>
        <div className="inline-flex items-center gap-2 bg-brand-light text-brand-secondary px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">
          <Truck size={14} /> Pickup Service
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-[#373A3C] tracking-tight mb-2">{RUG_WASHING.name}</h3>
        <p className="text-gray-500 font-semibold text-sm mb-6">
          <span className="text-brand-primary font-black">{formatNaira(RUG_WASHING.price)}</span> {RUG_WASHING.period}
        </p>

        <div className="space-y-3">
          {RUG_WASHING.includes.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="mt-0.5 bg-brand-primary/10 p-1 rounded-full text-brand-primary shrink-0">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="text-[#373A3C]/80 text-[13px] md:text-sm font-semibold leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 bg-gray-50/70 rounded-3xl p-6 border border-gray-100">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">How many rugs?</p>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Remove one rug"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-600 flex items-center justify-center transition-all hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <Minus size={20} strokeWidth={3} />
            </button>
            <span className="text-5xl font-black text-[#373A3C] w-16 text-center tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Add one rug"
              onClick={() => setQuantity((q) => Math.min(max, q + 1))}
              disabled={quantity >= max}
              className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center transition-all hover:bg-brand-secondary hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
          {quantity >= max && (
            <p className="text-center text-xs text-gray-400 italic mt-3">Maximum of {max} rugs per booking.</p>
          )}
        </div>

        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total</p>
          <AnimatedPrice value={total} className="block text-4xl md:text-5xl font-black text-brand-primary tracking-tighter tabular-nums" />
          <p className="text-gray-400 font-bold text-xs mt-1">
            {quantity} × {formatNaira(RUG_WASHING.price)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(buildBookingPlan(RUG_WASHING, quantity), quantity)}
          className="w-full py-5 rounded-2xl font-black tracking-widest uppercase text-sm flex items-center justify-center gap-3 transition-all duration-300 bg-brand-primary text-white shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)] hover:-translate-y-1"
        >
          Book Pickup
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
