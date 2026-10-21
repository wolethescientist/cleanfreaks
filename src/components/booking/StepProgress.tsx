"use client";

import { cn } from "@/lib/utils";

type StepProgressProps = {
  currentStep: number;
  steps: string[];
};

export default function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#51A432] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all duration-300",
                index <= currentStep
                  ? "bg-[#51A432] text-white border-2 sm:border-4 border-white ring-2 ring-[#51A432] shadow-sm"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "absolute top-9 sm:top-12 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300",
                index <= currentStep ? "text-[#00774D]" : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
