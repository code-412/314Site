import Link from "next/link";
import s from "./Footer.module.scss";

const legal = [
  "Privacy Policy",
  "Cookie Policy",
  "Terms & Conditions",
  "Copyright Notifications",
];

const nav = [
  { label: "Home",     href: "/"         },
  { label: "Services", href: "/services" },
  { label: "Works",    href: "/works"    },
  { label: "Contact",  href: "/contact"  },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.inner}>

          <div className={s.left}>
            <Link href="/" className={s.logo}>&lt;/&gt;&nbsp; code 412</Link>
            <p className={s.desc}>
              Lorem ipsum dolor sit amet consectetur. Eu enim dignissim orci
              pellentesque in nascetur eu diam. Lorem nibh cursus eleifend sed
              nunc cursus vivamus.
            </p>
            <a href="mailto:info@code412.com" className={s.email}>
              info@code412.com
            </a>
            <div className={s.socials}>
              <a href="#" className={s.socialLink} aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 5L2 12.5l7 1M21 5l-5 15-7-6.5M21 5 9 13.5m0 0V19l3.5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className={s.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className={s.socialLink} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M7 10v7M7 7v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M11 17v-3.5A2.5 2.5 0 0 1 16 13.5V17M11 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={s.right}>
            <ul className={s.col}>
              {legal.map((item) => (
                <li key={item}>
                  <a href="#" className={s.link}>{item}</a>
                </li>
              ))}
            </ul>

            <ul className={s.col}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={s.link}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
