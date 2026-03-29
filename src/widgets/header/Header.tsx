"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./Header.module.scss";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Work",     href: "/work"     },
  { label: "Contact",  href: "/contact"  },
];

const isProjectPage = (pathname: string) =>
  /^\/work\/.+/.test(pathname);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const darkPage = isProjectPage(pathname);

  useEffect(() => {
    if (!darkPage) {
      setScrolled(false);
      return;
    }
    const check = () => setScrolled(window.scrollY > 60);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [darkPage]);

  const close = () => setOpen(false);
  const dark = darkPage && !scrolled;

  return (
    <header className={`${s.header}${dark ? ` ${s.headerDark}` : ""}`}>
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
