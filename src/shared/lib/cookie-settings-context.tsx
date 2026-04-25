"use client";

import { createContext, useContext, useState } from "react";

type ContextValue = {
  open: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieSettingsContext = createContext<ContextValue>({
  open: false,
  openSettings: () => {},
  closeSettings: () => {},
});

export function CookieSettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <CookieSettingsContext.Provider
      value={{ open, openSettings: () => setOpen(true), closeSettings: () => setOpen(false) }}
    >
      {children}
    </CookieSettingsContext.Provider>
  );
}

export const useCookieSettings = () => useContext(CookieSettingsContext);
