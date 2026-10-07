"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { formatNaira } from "@/lib/utils";

// Counts up or down to the new amount whenever `value` changes, like a running meter.
export default function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const amount = useMotionValue(value);
  const text = useTransform(amount, (v) => formatNaira(Math.round(v)));

  useEffect(() => {
    const controls = animate(amount, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, amount]);

  return <motion.span className={className}>{text}</motion.span>;
}
