"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Plan } from "@/types/booking";
import type { AvailabilityData } from "@/app/api/availability/route";

const MAX_PER_SLOT = 10;

type BookingCalendarProps = {
  selectedDates: Date[];
  selectedTime: string | null;
  plan: Plan | null;
  onSelect: (dates: Date[], time: string) => void;
};

const TIME_SLOTS = [
  "09:00 AM", "01:00 PM"
];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function countWeekends(dates: Date[]) {
  return dates.filter(isWeekend).length;
}

function countWeekendsInMonth(dates: Date[], year: number, month: number) {
  return dates.filter(d => isWeekend(d) && d.getFullYear() === year && d.getMonth() === month).length;
}

export default function BookingCalendar({ selectedDates, selectedTime, plan, onSelect }: BookingCalendarProps) {
  const [dates, setDates] = useState<Date[]>(selectedDates || []);
  const [time, setTime] = useState<string | null>(selectedTime);
  const [weekendWarning, setWeekendWarning] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const aprilStart = new Date(2026, 3, 1); // April 1, 2026

  useEffect(() => {
    fetch('/api/availability')
      .then(r => r.json())
      .then((data: AvailabilityData & { success: boolean }) => {
        if (data.success) setAvailability(data);
      })
      .catch(() => {}); // fail silently — calendar still works, just no capacity data
  }, []);

  const maxDates = plan?.maxSessions || 12;
  const maxWeekendDays = plan?.maxWeekendDays ?? null;
  const perMonth = plan?.weekendLimitPerMonth ?? false;

  // Returns the minimum remaining slots for a given time slot across all selected dates
  const getSlotRemaining = (slot: string): number => {
    if (!availability || dates.length === 0) return MAX_PER_SLOT;
    return dates.reduce((min, date) => {
      const dateStr = format(date, 'MMMM d, yyyy');
      const count = availability.slotCounts[dateStr]?.[slot] ?? 0;
      return Math.min(min, MAX_PER_SLOT - count);
    }, MAX_PER_SLOT);
  };

  const currentWeekendCount = countWeekends(dates);
  const weekendLimitReached = !perMonth && maxWeekendDays !== null && currentWeekendCount >= maxWeekendDays;

  const isWeekendLimitReachedForDate = (date: Date) => {
    if (maxWeekendDays === null) return false;
    if (perMonth) {
      return countWeekendsInMonth(dates, date.getFullYear(), date.getMonth()) >= maxWeekendDays;
    }
    return currentWeekendCount >= maxWeekendDays;
  };

  const handleDaySelect = (newDates: Date[] | undefined) => {
    if (!newDates) {
      setDates([]);
      setWeekendWarning(false);
      return;
    }

    if (maxWeekendDays !== null && newDates.length > dates.length) {
      const addedDate = newDates[newDates.length - 1];
      if (isWeekend(addedDate) && isWeekendLimitReachedForDate(addedDate)) {
        setWeekendWarning(true);
        return;
      }
    }

    setWeekendWarning(false);
    setDates(newDates);
  };

  const handleTimeSelect = (t: string) => {
    setTime(t);
  };

  const handleProceed = () => {
    if (dates.length > 0 && time) {
      onSelect(dates, time);
    }
  };

  const isDisabled = (date: Date) => {
    if (date < aprilStart) return true;
    // Disable fully booked dates
    if (availability) {
      const dateStr = format(date, 'MMMM d, yyyy');
      if (availability.fullDates.includes(dateStr)) return true;
    }
    // Disable weekend days that would exceed the per-plan limit
    if (maxWeekendDays !== null && isWeekend(date)) {
      const alreadySelected = dates.some(d => d.toDateString() === date.toDateString());
      if (!alreadySelected && isWeekendLimitReachedForDate(date)) return true;
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 md:py-12 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 bg-white p-4 sm:p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50"
      >
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 md:p-4 bg-brand-light text-brand-secondary rounded-2xl shadow-sm shrink-0">
              <CalendarIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-xl font-bold text-gray-900">Select Dates</h3>
              <p className="text-sm text-gray-500 font-medium italic">
                {dates.length === maxDates
                  ? "All sessions selected — you're good to go!"
                  : `${maxDates - dates.length} session${maxDates - dates.length !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
            <div className={`shrink-0 text-right ${dates.length === maxDates ? 'text-[#51A432]' : 'text-gray-400'}`}>
              <span className="text-xl md:text-2xl font-black">{dates.length}</span>
              <span className="text-xs md:text-sm font-bold">/{maxDates}</span>
            </div>
          </div>

          {/* Session progress bar */}
          <div className="mb-5">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${dates.length === maxDates ? 'bg-[#51A432]' : 'bg-[#51A432]/70'}`}
                initial={{ width: 0 }}
                animate={{ width: `${(dates.length / maxDates) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {/* All sessions selected banner */}
          <AnimatePresence>
            {dates.length === maxDates && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 px-4 py-3 rounded-2xl bg-[#E7F5E4] border border-[#51A432]/30 flex items-center gap-3"
              >
                <CheckCircle2 size={16} className="text-[#51A432] shrink-0" />
                <p className="text-xs font-bold text-[#00774D]">
                  All {maxDates} sessions selected! Now pick a time slot to continue.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekend limit info banner */}
          {maxWeekendDays !== null && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-0.5">Weekend Day Limit</p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  Max <span className="font-black">{maxWeekendDays} weekend days {perMonth ? "per month" : "total"}</span> allowed for this plan.
                  {!perMonth && (
                    <> <span className="font-semibold">{currentWeekendCount} of {maxWeekendDays} used</span>
                    {weekendLimitReached && <span className="font-black text-amber-800"> — limit reached</span>}</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Weekend warning toast */}
          <AnimatePresence>
            {weekendWarning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-3 text-xs text-gray-400 italic text-center"
              >
                Weekend limit reached — please pick a weekday instead.
              </motion.p>
            )}
          </AnimatePresence>

          <div className="calendar-container overflow-hidden w-full flex items-center justify-center">
            <DayPicker
              mode="multiple"
              max={maxDates}
              selected={dates}
              onSelect={handleDaySelect}
              disabled={isDisabled}
              defaultMonth={aprilStart}
              modifiersStyles={{
                selected: { backgroundColor: '#51A432', color: 'white', borderRadius: '14px', fontWeight: 'bold' },
                today: { color: '#00774D', fontWeight: '900', borderBottom: '3px solid #E7F5E4' }
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

        <div>
          <div className="flex items-center gap-3 mb-5 md:mb-8 mt-2 lg:mt-0">
            <div className="p-3 md:p-4 bg-brand-light text-brand-secondary rounded-2xl shadow-sm shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Select Time Slot</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {TIME_SLOTS.map((t) => {
              const remaining = getSlotRemaining(t);
              const slotFull = dates.length > 0 && remaining <= 0;
              const isDisabledSlot = dates.length === 0 || slotFull;
              return (
                <button
                  key={t}
                  onClick={() => !slotFull && handleTimeSelect(t)}
                  disabled={isDisabledSlot}
                  className={`py-3 md:py-4 px-2 md:px-4 rounded-xl md:rounded-2xl font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 text-sm md:text-base ${
                    slotFull
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : time === t
                        ? "bg-brand-primary text-white border-brand-primary shadow-[0_4px_14px_rgba(81,164,50,0.4)] scale-105 z-10"
                        : dates.length === 0
                          ? "bg-gray-50/50 text-gray-300 border-gray-50 cursor-not-allowed"
                          : "bg-white text-gray-600 border-gray-100 hover:border-brand-primary/40 hover:text-brand-primary hover:bg-brand-light/30 shadow-sm"
                  }`}
                >
                  <span>{t}</span>
                  {dates.length > 0 && availability && (
                    <span className={`text-[10px] font-semibold ${
                      slotFull ? "text-red-400" : time === t ? "text-white/80" : "text-gray-400"
                    }`}>
                      {slotFull ? "Full" : `${remaining} spot${remaining !== 1 ? 's' : ''} left`}
                    </span>
                  )}
                </button>
              );
            })}
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
              className="mt-5 md:mt-10 flex flex-col gap-3 md:gap-4"
            >
              <div className="p-5 bg-[#E7F5E4]/50 rounded-2xl border-2 border-[#51A432]/20 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black text-[#00774D] uppercase tracking-[0.2em] mb-1">Schedule Summary:</p>
                  <p className="text-sm font-black text-gray-800 tracking-tight">
                    {dates.length} Session{dates.length !== 1 ? 's' : ''} Selected <span className="text-[#51A432] px-1">•</span> {time}
                  </p>
                  {maxWeekendDays !== null && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {currentWeekendCount} weekend day{currentWeekendCount !== 1 ? 's' : ''} selected (max {maxWeekendDays})
                    </p>
                  )}
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
