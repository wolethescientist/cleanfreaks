"use client";

import { useState, useMemo, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronRight, Truck, Home, CheckCircle2 } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { RugServiceType } from "@/types/booking";
import type { AvailabilityData } from "@/lib/availability";
import { MAX_PER_SLOT } from "@/constants/schedule";

type RugBookingCalendarProps = {
  selectedDate: Date | null;
  selectedTime: string | null;
  serviceType: RugServiceType;
  onSelect: (date: Date, time: string) => void;
};

const TIME_SLOTS = ["09:00 AM", "01:00 PM"];

export default function RugBookingCalendar({
  selectedDate,
  selectedTime,
  serviceType,
  onSelect,
}: RugBookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || undefined);
  const [time, setTime] = useState<string | null>(selectedTime);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data: AvailabilityData & { success: boolean }) => {
        if (data.success) setAvailability(data);
      })
      .catch(() => {});
  }, []);

  const getSlotRemaining = (slot: string): number => {
    if (!availability || !date) return MAX_PER_SLOT;
    const dateStr = format(date, 'MMMM d, yyyy');
    const count = availability.slotCounts[dateStr]?.[slot] ?? 0;
    return Math.max(0, MAX_PER_SLOT - count);
  };

  const isDisabled = (d: Date) => {
    if (d < today) return true;
    if (availability) {
      const dateStr = format(d, 'MMMM d, yyyy');
      if (availability.fullDates.includes(dateStr)) return true;
    }
    return false;
  };

  const handleProceed = () => {
    if (date && time) {
      onSelect(date, time);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 bg-white p-5 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
      >
        {/* Calendar Picker */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-[#E7F5E4] text-[#00774D] rounded-2xl shrink-0">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                {serviceType === 'pickup' ? 'Select Pickup Date' : 'Select Cleaning Date'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {serviceType === 'pickup'
                  ? 'When should we collect your rugs?'
                  : 'When should our technicians arrive?'}
              </p>
            </div>
          </div>

          <div className="calendar-container overflow-hidden w-full flex items-center justify-center">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDisabled}
              defaultMonth={today}
              startMonth={today}
              modifiersStyles={{
                selected: { backgroundColor: '#51A432', color: 'white', borderRadius: '14px', fontWeight: 'bold' },
                today: { color: '#00774D', fontWeight: '900', borderBottom: '3px solid #E7F5E4' },
              }}
              styles={{
                root: { width: '100%', display: 'flex', justifyContent: 'center' },
                month: { width: '100%' },
                caption: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                table: { width: '100%' },
                head_cell: { textAlign: 'center' },
                cell: { textAlign: 'center' },
              }}
              className="font-sans"
            />
          </div>
        </div>

        {/* Time Slot Selection & Schedule Summary */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5 mt-2 lg:mt-0">
              <div className="p-3 bg-[#E7F5E4] text-[#00774D] rounded-2xl shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Select Time Window
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Choose a preferred service slot
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {TIME_SLOTS.map((t) => {
                const remaining = getSlotRemaining(t);
                const slotFull = date && remaining <= 0;
                const isSelected = time === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => !slotFull && setTime(t)}
                    disabled={!date || slotFull}
                    className={`py-4 px-3 rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                      slotFull
                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#51A432] text-white border-[#51A432] shadow-[0_6px_20px_rgba(81,164,50,0.35)] scale-105 z-10'
                        : !date
                        ? 'bg-gray-50/50 text-gray-300 border-gray-100 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-[#51A432]/40 hover:text-[#51A432] hover:bg-[#E7F5E4]/30 shadow-sm'
                    }`}
                  >
                    <span className="text-sm sm:text-base">{t}</span>
                    {date && availability && (
                      <span
                        className={`text-[10px] font-semibold ${
                          slotFull ? 'text-red-400' : isSelected ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        {slotFull ? 'Full' : `${remaining} slot${remaining !== 1 ? 's' : ''} left`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!date && (
              <p className="text-xs sm:text-sm text-gray-400 italic text-center p-4 bg-gray-50 rounded-2xl">
                Please select a date on the calendar first to view available time slots.
              </p>
            )}

            {/* Service-specific notice */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3 mt-4">
              <div className="p-2 bg-[#E7F5E4] rounded-xl text-[#00774D] shrink-0 mt-0.5">
                {serviceType === 'pickup' ? <Truck size={16} /> : <Home size={16} />}
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {serviceType === 'pickup' ? (
                  <>
                    <strong className="text-gray-900 block mb-0.5">Complimentary Doorstep Pickup</strong>
                    Our courier team will tag and collect your rugs within the selected time window. They will be washed, sanitized, heat-chamber dried, and returned within <strong>48–72 hours</strong>.
                  </>
                ) : (
                  <>
                    <strong className="text-gray-900 block mb-0.5">On-Site Cleaning Visit</strong>
                    Our technician team will arrive with professional extraction equipment to treat and clean your rugs directly in your home.
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Summary & Proceed */}
          <AnimatePresence>
            {date && time && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col gap-3"
              >
                <div className="p-4 bg-[#E7F5E4] rounded-2xl border border-[#51A432]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00774D]">
                      Confirmed Window
                    </span>
                    <p className="text-sm font-black text-gray-900">
                      {format(date, 'EEEE, MMMM d, yyyy')} • {time}
                    </p>
                  </div>
                  <CheckCircle2 size={20} className="text-[#51A432]" />
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full bg-[#51A432] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(81,164,50,0.3)] transition-all"
                >
                  Confirm Schedule
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
