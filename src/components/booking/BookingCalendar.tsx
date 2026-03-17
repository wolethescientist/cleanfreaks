"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react";
import { Plan } from "@/types/booking";

type BookingCalendarProps = {
  selectedDates: Date[];
  selectedTime: string | null;
  plan: Plan | null;
  onSelect: (dates: Date[], time: string) => void;
};

const TIME_SLOTS = [
  "09:00 AM", "12:00 PM", "03:00 PM"
];

export default function BookingCalendar({ selectedDates, selectedTime, plan, onSelect }: BookingCalendarProps) {
  const [dates, setDates] = useState<Date[]>(selectedDates || []);
  const [time, setTime] = useState<string | null>(selectedTime);
  const aprilStart = new Date(2026, 3, 1); // April 1, 2026

  const maxDates = plan?.maxSessions || 12;

  const handleTimeSelect = (t: string) => {
    setTime(t);
  };

  const handleProceed = () => {
    if (dates.length > 0 && time) {
      onSelect(dates, time);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50"
      >
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-brand-light text-brand-secondary rounded-2xl shadow-sm">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Select Dates</h3>
              <p className="text-sm text-gray-500 font-medium italic">Choose up to {maxDates} dates for your first month</p>
            </div>
          </div>
          <div className="calendar-container overflow-hidden w-full flex items-center justify-center">
            <DayPicker
              mode="multiple"
              max={maxDates}
              selected={dates}
              onSelect={(d) => setDates(d as Date[])}
              disabled={{ before: aprilStart }}
              defaultMonth={aprilStart}
              modifiersStyles={{
                selected: { backgroundColor: '#51A432', color: 'white', borderRadius: '14px', fontWeight: 'bold' },
                today: { color: '#00774D', fontWeight: '900', borderBottom: '3px solid #E7F5E4' }
              }}
              className="mx-auto font-sans w-full max-w-full"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-brand-light text-brand-secondary rounded-2xl shadow-sm">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Time Slot</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                onClick={() => handleTimeSelect(t)}
                disabled={dates.length === 0}
                className={`py-4 px-4 rounded-2xl font-bold transition-all border-2 flex items-center justify-center gap-2 ${time === t
                  ? "bg-brand-primary text-white border-brand-primary shadow-[0_4px_14px_rgba(81,164,50,0.4)] scale-105 z-10"
                  : dates.length === 0
                    ? "bg-gray-50/50 text-gray-300 border-gray-50 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-100 hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-light/30 shadow-sm"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {dates.length === 0 && (
            <p className="text-sm text-gray-500 mt-4 italic text-center animate-pulse">
              Please select at least one date first to view available times
            </p>
          )}

          {dates.length > 0 && time && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-10 flex flex-col gap-4"
            >
              <div className="p-5 bg-[#E7F5E4]/50 rounded-2xl border-2 border-[#51A432]/20 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black text-[#00774D] uppercase tracking-[0.2em] mb-1">Schedule Summary:</p>
                  <p className="text-sm font-black text-gray-800 tracking-tight">
                    {dates.length} Session{dates.length !== 1 ? 's' : ''} Selected <span className="text-[#51A432] px-1">•</span> {time}
                  </p>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-[#51A432] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(81,164,50,0.3)] transition-all"
              >
                Confirm Schedule
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
