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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-12 px-4">
      {PLANS.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col ${
            selectedPlan?.id === plan.id
              ? "border-brand-primary bg-brand-light shadow-xl scale-105 z-10"
              : "border-gray-100 bg-white hover:border-brand-secondary hover:shadow-lg"
          }`}
        >
          {selectedPlan?.id === plan.id && (
            <div className="absolute top-4 right-4 bg-brand-primary text-white p-1 rounded-full">
              <Check size={20} />
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-bold text-brand-primary tracking-widest uppercase mb-2">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">{plan.priceFormatted}</span>
              <span className="text-gray-500 font-medium">/ 3 Months</span>
            </div>
            <p className="text-brand-secondary font-bold mt-2">{plan.sessions}</p>
            <p className="text-gray-600 text-sm">{plan.visits}</p>
          </div>

          <div className="space-y-4 mb-8 flex-grow">
            <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider">What&apos;s Included:</p>
            {plan.includes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 bg-brand-light p-0.5 rounded-full text-brand-primary shrink-0">
                  <Check size={14} />
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t pt-6">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">Best For:</p>
            <p className="text-sm text-gray-700 font-medium mb-6 italic">&quot;{plan.bestFor}&quot;</p>
            
            <button
              onClick={() => onSelect(plan)}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedPlan?.id === plan.id
                  ? "bg-brand-primary text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-brand-primary hover:text-white"
              }`}
            >
              Select Plan
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
