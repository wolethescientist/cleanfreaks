"use client";

import { PLANS } from "@/constants/plans";
import { Plan } from "@/types/booking";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type PlanSelectionProps = {
  selectedPlan: Plan | null;
  onSelect: (plan: Plan) => void;
};

export default function PlanSelection({ selectedPlan, onSelect }: PlanSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-6 sm:py-10 md:py-12 px-4">
      {PLANS.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`relative p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 flex flex-col ${selectedPlan?.id === plan.id
            ? "bg-[#E7F5E4]/80 shadow-[0_12px_40px_rgba(81,164,50,0.15)] md:scale-105 z-10 border border-[#51A432]/20"
            : "bg-white border hover:border-transparent border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] md:hover:-translate-y-2"
            }`}
        >
          {selectedPlan?.id === plan.id && (
            <div className="absolute top-4 right-4 bg-brand-primary text-white p-1 rounded-full">
              <Check size={20} />
            </div>
          )}

          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] md:text-xs font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap border-2 border-white z-20">
              Most Popular
            </div>
          )}

          <div className="mb-6 md:mb-8 mt-2">
            <h3 className="text-sm font-black text-brand-secondary tracking-[0.2em] uppercase mb-4 min-h-[40px]">
              {plan.name}
            </h3>
            <div className="flex flex-col mb-4">
              <span className="text-4xl md:text-5xl font-black text-[#373A3C] tracking-tighter">{plan.priceFormatted}</span>
              <span className="text-gray-400 font-bold text-sm md:text-lg mt-1">{plan.period}</span>
            </div>
            <div className="bg-white/80 inline-block px-4 py-2 rounded-xl border border-brand-primary/10 shadow-sm">
              <p className="text-brand-primary font-black text-sm tracking-wide">{plan.sessions}</p>
              <p className="text-gray-500 text-[11px] md:text-xs font-semibold mt-0.5">{plan.visits}</p>
              {plan.pricePerSession && (
                <p className="text-[#00774D] text-[11px] md:text-xs font-black mt-1 tracking-wide">{plan.pricePerSession}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-10 flex-grow">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">What&apos;s Included:</p>
            {plan.includes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-0.5 bg-brand-primary/10 p-1 rounded-full text-brand-primary shrink-0 shadow-sm">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-[#373A3C]/80 text-[13px] md:text-sm font-semibold leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-100/60 pt-6">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Best For:</p>
            <p className="text-[13px] text-[#373A3C]/90 font-medium mb-8 leading-relaxed">&quot;{plan.bestFor}&quot;</p>

            <button
              onClick={() => onSelect(plan)}
              className={`w-full py-5 rounded-2xl font-black tracking-widest uppercase text-sm flex items-center justify-center gap-3 transition-all duration-300 ${selectedPlan?.id === plan.id
                ? "bg-brand-primary text-white shadow-[0_8px_20px_rgba(81,164,50,0.3)] hover:shadow-[0_12px_25px_rgba(81,164,50,0.4)] hover:-translate-y-1"
                : "bg-gray-50 text-gray-600 hover:bg-brand-primary hover:text-white hover:shadow-[0_8px_20px_rgba(81,164,50,0.2)] hover:-translate-y-1"
                }`}
            >
              Proceed
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
