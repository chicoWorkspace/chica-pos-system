"use client";

import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(getCurrentTime(now));
    };

    update(); // 初始化
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return <div>{time}</div>;
}

function getCurrentTime(now: Date): string {
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
export default Clock;
