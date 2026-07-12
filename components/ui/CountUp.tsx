"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.6,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, motionValue]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
