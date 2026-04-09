"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContactDrawer } from "@/shared/lib/contact-drawer-context";
import s from "./Header.module.scss";

const NAV = [
  { label: "Home",     href: "/"         },
  { label: "Services", href: "/services" },
  { label: "Works",    href: "/works"    },
  { label: "Contact",  href: "/contact"  },
];

const isProjectPage = (pathname: string) =>
  /^\/works\/.+/.test(pathname);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const darkPage = isProjectPage(pathname);

  useEffect(() => {
    const check = () => setScrolled(darkPage ? window.scrollY > 60 : false);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [darkPage]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const { openDrawer } = useContactDrawer();
  const close = () => setOpen(false);
  const dark = darkPage && !scrolled;

  return (
    <header className={`${s.header}${dark ? ` ${s.headerDark}` : ""}`}>
      <nav className={`${s.nav} container`}>
        <Link href="/" className={s.logo} onClick={close}>
          &lt;/&gt; 412
        </Link>
ы
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
            {NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={s.link}>{item.label}</Link>
              </li>
            ))}
            <li>
              <button className={s.ctaLink} onClick={openDrawer}>
                <span>Contact Us</span>
              </button>
            </li>
          </ul>
        </div>

        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="header-paint-drip" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="turbulence" baseFrequency="0.04 0.08" numOctaves="4" seed="5" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>
        </svg>
      </nav>

      <div className={`${s.mobileOverlay}${open ? ` ${s["mobileOverlay--open"]}` : ""}`}>
        <div className={`${s.mobileInner} container`}>
          <ul className={s.mobileList}>
            {NAV.map((item) => (
              <li key={item.href} className={s.mobileItem}>
                <Link href={item.href} className={s.mobileLink} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button className={s.mobileCtaLink} onClick={() => { close(); openDrawer(); }}>
            Contact Us
          </button>
        </div>
      </div>
    </header>
  );
}
