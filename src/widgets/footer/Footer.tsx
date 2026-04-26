"use client";

import s from "./Footer.module.scss";
import { NavLink } from "@/shared/ui/NavLink";
import { LogoIcon } from "@/shared/icons/LogoIcon";
import { TelegramIcon, InstagramIcon, LinkedInIcon } from "@/shared/icons/SocialIcons";
import { useCookieSettings } from "@/shared/lib/cookie-settings-context";

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use",   href: "/terms-of-use"   },
];

const nav = [
  { label: "Home",     href: "/"         },
  { label: "Services", href: "/services" },
  { label: "Works",    href: "/works"    },
  { label: "Contact",  href: "/contact"  },
];

export function Footer() {
  const { openSettings } = useCookieSettings();

  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.inner}>

          <div className={s.left}>
            <NavLink href="/" className={s.logo}><LogoIcon /></NavLink>
            <p className={s.desc}>
              We don&apos;t just write code – we craft digital products where design and engineering work together, turning vision into meaningful digital experiences.
            </p>
            <a href="mailto:info@code412.com" className={s.email}>
              info@code412.com
            </a>
            <div className={s.socials}>
              <a href="#" className={s.socialLink} aria-label="Telegram">
                <TelegramIcon size={18} />
              </a>
              <a href="#" className={s.socialLink} aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="#" className={s.socialLink} aria-label="LinkedIn">
                <LinkedInIcon size={18} />
              </a>
            </div>
          </div>

          <div className={s.right}>
            <ul className={s.col}>
              {legal.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={s.link}>{item.label}</NavLink>
                </li>
              ))}
              <li>
                <button className={s.link} onClick={openSettings}>Cookie Settings</button>
              </li>
            </ul>

            <ul className={s.col}>
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className={s.link}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
