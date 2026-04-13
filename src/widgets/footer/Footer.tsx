import s from "./Footer.module.scss";
import { NavLink } from "@/shared/ui/NavLink";
import { TelegramIcon, InstagramIcon, LinkedInIcon } from "@/shared/icons/SocialIcons";

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
            <NavLink href="/" className={s.logo}>&lt;/&gt;&nbsp; code 412</NavLink>
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
                <li key={item}>
                  <a href="#" className={s.link}>{item}</a>
                </li>
              ))}
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
