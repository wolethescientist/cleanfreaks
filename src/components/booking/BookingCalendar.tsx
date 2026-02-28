"use client";

import { useState } from "react";
import { format, addMonths, startOfToday, isBefore, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft } from "lucide-react";

type BookingCalendarProps = {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelect: (date: Date, time: string) => void;
};

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"
];

export default function BookingCalendar({ selectedDate, selectedTime, onSelect }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || undefined);
  const [time, setTime] = useState<string | null>(selectedTime);
  const today = startOfToday();

  const handleTimeSelect = (t: string) => {
    setTime(t);
    if (date) {
      onSelect(date, t);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-light text-brand-primary rounded-2xl">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
              <p className="text-sm text-gray-500 font-medium italic">Choose your first session date</p>
            </div>
          </div>
          
          <div className="calendar-container border rounded-2xl p-4 border-gray-100 bg-gray-50/30">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              modifiersStyles={{
                selected: { backgroundColor: '#2D5A27', color: 'white' },
                today: { color: '#4CAF50', fontWeight: 'bold' }
              }}
              className="mx-auto"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-light text-brand-primary rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Select Time Slot</h3>
              <p className="text-sm text-gray-500 font-medium italic">Standard 3-hour session window</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                onClick={() => handleTimeSelect(t)}
                disabled={!date}
                className={`py-4 px-4 rounded-xl font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                  time === t
                    ? "bg-brand-primary text-white border-brand-primary shadow-md"
                    : !date 
                    ? "bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-100 hover:border-brand-secondary hover:text-brand-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          
          {!date && (
            <p className="text-sm text-gray-500 mt-4 italic text-center animate-pulse">
              Please select a date first to view available times
            </p>
          )}

          {date && time && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-4 bg-brand-light rounded-xl border border-brand-secondary/20 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">Selected Schedule:</p>
                <p className="text-sm font-bold text-gray-800">
                  {format(date, "MMMM d, yyyy")} at {time}
                </p>
              </div>
              <div className="bg-brand-primary text-white p-2 rounded-lg">
                 <ChevronRight size={20} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
