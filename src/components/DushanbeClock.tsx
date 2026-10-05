"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";

const formatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 5_000);
  return () => window.clearInterval(timer);
};

const getSnapshot = () => formatter.format(Date.now());
const getServerSnapshot = () => "--:--";

/** Live local time in Dushanbe; renders a neutral placeholder on the server. */
export function DushanbeClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hours, minutes] = time.split(":");

  return (
    <time className="clock">
      {hours}
      <span className="clock-colon">:</span>
      {minutes}
    </time>
  );
}
