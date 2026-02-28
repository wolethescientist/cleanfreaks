"use client";

import { cn } from "@/lib/utils";

type StepProgressProps = {
  currentStep: number;
  steps: string[];
};

export default function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                index <= currentStep
                  ? "bg-brand-primary text-white border-4 border-white ring-2 ring-brand-primary"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "absolute top-12 whitespace-nowrap text-xs font-medium uppercase tracking-wider transition-all duration-300",
                index <= currentStep ? "text-brand-primary" : "text-gray-400"
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
