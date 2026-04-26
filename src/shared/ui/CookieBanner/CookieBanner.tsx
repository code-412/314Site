"use client";

import { useState } from "react";
import Link from "next/link";
import { CookieSettings } from "@/shared/ui/CookieSettings";
import { useCookieSettings } from "@/shared/lib/cookie-settings-context";
import s from "./CookieBanner.module.scss";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)
  );
  const { open, openSettings, closeSettings } = useCookieSettings();

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  const handleConfirm = (prefs: Record<string, boolean>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    closeSettings();
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className={s.banner} role="dialog" aria-label="Cookie settings">
          <div className={s.content}>
            <p className={s.title}>COOKIES SETTINGS</p>
            <p className={s.text}>
              We use cookies to ensure the website functions properly and to analyze traffic so
              we can improve our services. Some cookies are strictly necessary, while others
              help us understand how visitors use the site. You can accept or reject
              non-essential cookies and manage your preferences at any time.
            </p>
            <p className={`${s.text} ${s.textNote}`}>
              For more information, please see our{" "}
              <Link href="/privacy-policy" className={s.link}>Privacy Policy</Link>.
            </p>
          </div>
          <div className={s.actions}>
            <button className={s.btn} onClick={accept}>Apply</button>
            <button className={s.btn} onClick={openSettings}>Settings</button>
            <button className={s.btn} onClick={decline}>Decline</button>
          </div>
        </div>
      )}

      {open && (
        <CookieSettings
          onConfirm={handleConfirm}
          onClose={closeSettings}
        />
      )}
    </>
  );
}
