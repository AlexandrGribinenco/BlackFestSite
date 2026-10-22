"use client";

import { useEffect, useState } from "react";

type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const UNITS: Array<[keyof CountdownParts, string]> = [
  ["days", "days"],
  ["hours", "hours"],
  ["minutes", "min"],
  ["seconds", "sec"],
];

// Shown on the server render and until the timer starts in the browser
const PLACEHOLDER: CountdownParts = { days: "120", hours: "08", minutes: "45", seconds: "12" };

const pad = (n: number) => String(n).padStart(2, "0");

function partsUntil(target: number): CountdownParts {
  const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: String(Math.floor(left / 86400)),
    hours: pad(Math.floor((left % 86400) / 3600)),
    minutes: pad(Math.floor((left % 3600) / 60)),
    seconds: pad(left % 60),
  };
}

type CountdownProps = {
  /** ISO date-time the festival starts, e.g. "2027-06-12T18:00:00+03:00" */
  target: string;
};

export function Countdown({ target }: CountdownProps) {
  const [parts, setParts] = useState(PLACEHOLDER);

  useEffect(() => {
    const targetTime = new Date(target).getTime();
    if (Number.isNaN(targetTime)) return;

    const tick = () => {
      setParts(partsUntil(targetTime));
      return targetTime > Date.now();
    };
    if (!tick()) return;

    const timer = setInterval(() => {
      if (!tick()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="countdown" role="timer" aria-label="Time until the festival">
      {UNITS.map(([unit, label]) => (
        <div className="countdown__item" key={unit}>
          <span className="countdown__value">{parts[unit]}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
