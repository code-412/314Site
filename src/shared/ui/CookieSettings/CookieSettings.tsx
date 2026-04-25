"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./CookieSettings.module.scss";

type Category = {
  id: string;
  label: string;
  alwaysActive?: boolean;
};

const CATEGORIES: Category[] = [
  { id: "necessary", label: "Strictly Necessary Cookies", alwaysActive: true },
  { id: "analytics", label: "Analytics Cookies" },
  { id: "marketing", label: "Marketing Cookies" },
  { id: "functional", label: "Functional Cookies" },
];

type Props = {
  onConfirm: (prefs: Record<string, boolean>) => void;
  onClose: () => void;
};

export function CookieSettings({ onConfirm, onClose }: Props) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    analytics: false,
    marketing: true,
    functional: false,
  });

  const toggle = (id: string) =>
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={s.overlay} onClick={onClose} aria-modal="true" role="dialog">
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        <p className={s.title}>COOKIES SETTINGS</p>
        <p className={s.desc}>
          We use cookies to ensure the website functions properly and to analyze traffic so
          we can improve our services. Some cookies are strictly necessary, while others
          help us understand how visitors use the site. You can accept or reject
          non-essential cookies and manage your preferences at any time. For more
          information, please see our <Link href="/privacy-policy" className={s.descLink}>Privacy Policy</Link>.
        </p>

        <p className={s.sectionTitle}>MANAGE CONSENT PREFERENCES</p>

        <ul className={s.list}>
          {CATEGORIES.map((cat) => (
            <li key={cat.id} className={s.row}>
              <span className={s.label}>{cat.label}</span>
              {cat.alwaysActive ? (
                <span className={s.alwaysActive}>Always Active</span>
              ) : (
                <button
                  className={`${s.toggle} ${prefs[cat.id] ? s.toggleOn : ""}`}
                  onClick={() => toggle(cat.id)}
                  role="switch"
                  aria-checked={prefs[cat.id]}
                  aria-label={cat.label}
                >
                  <span className={s.thumb} />
                </button>
              )}
            </li>
          ))}
        </ul>

        <button className={s.confirm} onClick={() => onConfirm(prefs)}>
          Confirm
        </button>
      </div>
    </div>
  );
}
