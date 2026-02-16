import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate?: string;
}

const CountdownTimer = ({ targetDate = "2026-03-31T23:59:59" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const blocks = [
    { value: timeLeft.days, label: "দিন" },
    { value: timeLeft.hours, label: "ঘন্টা" },
    { value: timeLeft.minutes, label: "মিনিট" },
    { value: timeLeft.seconds, label: "সেকেন্ড" },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center bg-card border border-border rounded-xl px-4 py-3 min-w-[70px]">
          <span className="text-2xl sm:text-3xl font-bold gradient-text font-english">{String(b.value).padStart(2, "0")}</span>
          <span className="text-xs text-muted-foreground mt-1">{b.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
