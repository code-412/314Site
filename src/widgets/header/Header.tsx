"use client";

import Link from "next/link";
import { useState } from "react";
import s from "./Header.module.scss";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Work",     href: "/work"     },
  { label: "Contact",  href: "/contact"  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={s.header}>
      <nav className={`${s.nav} container`}>
        <Link href="/" className={s.logo} onClick={close}>
          &lt;/&gt; 314
        </Link>

        <button
          className={`${s.burger}${open ? ` ${s["burger--active"]}` : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`${s.burgerBar} ${s["burgerBar--top"]}`} />
          <span className={`${s.burgerBar} ${s["burgerBar--mid"]}`} />
          <span className={`${s.burgerBar} ${s["burgerBar--bot"]}`} />
        </button>

        <div className={`${s.menu}${open ? ` ${s["menu--hidden"]}` : ""}`}>
          <ul className={s.list}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={s.link}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className={s.ctaLink}>Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav>

      {open && (
        <div className={s.mobileOverlay}>
          <ul className={s.mobileList}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={s.mobileLink} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className={s.mobileCtaLink} onClick={close}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
