"use client";

import { createContext, useContext, useState } from "react";

type ContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const ContactDrawerContext = createContext<ContextValue>({
  open: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function ContactDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ContactDrawerContext.Provider
      value={{ open, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false) }}
    >
      {children}
    </ContactDrawerContext.Provider>
  );
}

export const useContactDrawer = () => useContext(ContactDrawerContext);
