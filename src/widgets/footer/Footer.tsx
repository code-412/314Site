import Link from "next/link";
import s from "./Footer.module.scss";

const legal = ["Privacy Policy", "Cookie Policy", "Terms of Service", "Copyright"];

const nav = [
  { label: "Home",     href: "/"         },
  { label: "Services", href: "/services" },
  { label: "Works",    href: "/works"    },
  { label: "Contact",  href: "/contact"  },
];

export function Footer() {
  return (
    <footer className={s.footer} id="contact">
      <div className="container">
        <div className={s.top}>
          <div className={s.left}>
            <Link href="/" className={s.logo}>&lt;/&gt; 314</Link>
            <p className={s.desc}>
              Lorem ipsum dolor sit amet consectetur. Aenean orci aliquam urna
              nulla. Ultrices habitasse cras lorem ipsum dolor sit amet.
            </p>
            <a href="mailto:hello@412.studio" className={s.email}>
              hello@412.studio
            </a>
            <div className={s.socials}>
              <a href="#" className={s.socialLink} aria-label="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className={s.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div className={s.right}>
            <div className={s.col}>
              <h4 className={s.colTitle}>Legal</h4>
              <ul className={s.colList}>
                {legal.map((item) => (
                  <li key={item}>
                    <a href="#" className={s.colLink}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.col}>
              <h4 className={s.colTitle}>Navigation</h4>
              <ul className={s.colList}>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={s.colLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.copy}>
            &copy; {new Date().getFullYear()} 412. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
