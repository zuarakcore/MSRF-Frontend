"use client";

import { useEffect, useState } from "react";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("mcfc-theme", dark ? "dark" : "light");
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next = !dark;
        setDark(next);
        apply(next);
      }}
      className="glass relative h-9 w-16 shrink-0 rounded-full p-1 transition-colors duration-500 hover:border-accent"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: dark ? "translateX(28px)" : "translateX(0)" }}
      >
        {dark ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M21 12.8A8.5 8.5 0 1111.2 3a7 7 0 009.8 9.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
          </svg>
        )}
      </span>
    </button>
  );
}
