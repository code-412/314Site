"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.scss";
import { TelegramIcon, InstagramIcon, LinkedInIcon } from "@/shared/icons/SocialIcons";
import { getLenis } from "@/shared/providers/SmoothScroll";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
};

type Touched = Record<keyof Omit<FormData, "consent">, boolean>;

const empty: FormData = { name: "", phone: "", email: "", message: "", consent: false };
const emptyTouched: Touched = { name: false, phone: false, email: false, message: false };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function getError(field: keyof Omit<FormData, "consent">, form: FormData): string | null {
  switch (field) {
    case "name":    return form.name.trim().length < 2 ? "Enter your name" : null;
    case "phone":   return null;
    case "email":   return !isValidEmail(form.email) ? "Invalid email address" : null;
    case "message": return null;
  }
}

export default function ContactPage() {
  const [form, setForm]           = useState<FormData>(empty);
  const [touched, setTouched]     = useState<Touched>(emptyTouched);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent]           = useState(false);
  const [dark, setDark]           = useState(false);
  const rightRef    = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const formSectRef = useRef<HTMLElement>(null);
  const wordWrapRef = useRef<HTMLSpanElement>(null);
  const discussRef  = useRef<HTMLSpanElement>(null);
  const hearRef     = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => getLenis()?.stop(), 0);
    return () => {
      clearTimeout(timer);
      getLenis()?.start();
    };
  }, []);

  useEffect(() => {
    const wrap = wordWrapRef.current;
    const discuss = discussRef.current;
    if (!wrap || !discuss) return;
    wrap.style.width = `${discuss.offsetWidth}px`;
  }, []);

  useEffect(() => {
    const wrap = wordWrapRef.current;
    const active = dark ? hearRef.current : discussRef.current;
    if (!wrap || !active) return;
    wrap.style.width = `${active.offsetWidth}px`;
  }, [dark]);

  useEffect(() => {
    const el = rightRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrolled = el.scrollTop;
      const half     = el.clientHeight;
      setDark(scrolled > half * 0.5);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = formSectRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setDark(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const right = rightRef.current;
    if (!right) return;

    if (window.innerWidth <= 900) return;

    let section = 0;
    let locked  = false;

    const goTo = (index: number) => {
      section = index;
      right.scrollTo({ top: index * right.clientHeight, behavior: "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      if (section === 2) {
        if (e.deltaY < 0 && !locked) {
          e.preventDefault();
          locked = true;
          section = 1;
          getLenis()?.stop();
          window.scrollTo(0, 0);
          setTimeout(() => { locked = false; }, 1000);
        }
        return;
      }

      e.preventDefault();
      if (locked) return;

      if (e.deltaY > 0 && section === 0) {
        locked = true;
        goTo(1);
        setTimeout(() => { locked = false; }, 1000);
      } else if (e.deltaY > 0 && section === 1) {
        locked = true;
        section = 2;
        const lenis = getLenis();
        lenis?.start();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        lenis?.scrollTo(maxScroll, { duration: 1.0 });
        setTimeout(() => { locked = false; }, 1200);
      } else if (e.deltaY < 0 && section === 1) {
        locked = true;
        goTo(0);
        setTimeout(() => { locked = false; }, 1000);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const onBlur = (field: keyof Touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onCheck = () =>
    setForm((prev) => ({ ...prev, consent: !prev.consent }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ name: true, phone: true, email: true, message: true });
    const hasError = (["name", "phone", "email", "message"] as (keyof Touched)[]).some(
      (f) => getError(f, form)
    );
    if (hasError || !form.consent) return;
    console.log("Contact form:", form);
    setSent(true);
  };

  const fieldError = (field: keyof Touched) =>
    (touched[field] || submitted) ? getError(field, form) : null;

  const ic = (field: keyof Touched) =>
    [styles.input, fieldError(field) ? styles.inputError : ""].filter(Boolean).join(" ");

  return (
    <div className={`${styles.page}${dark ? ` ${styles.pageDark}` : ""}`}>
      <div className={styles.left} ref={leftRef}>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>We are</span>
          <span className={styles.titleLine}>ready to</span>
          <span className={styles.titleLineRow}>
            <span className={styles.wordWrap} ref={wordWrapRef}>
              <span className={styles.wordDiscuss} ref={discussRef}>discuss</span>
              <span className={styles.wordHear} ref={hearRef}>hear</span>
            </span>
            <span className={styles.yourWord}>&nbsp;your</span>
          </span>
          <span className={styles.titleLine}>future</span>
          <span className={styles.titleLine}>project</span>
        </h1>
      </div>

      <div className={styles.right} ref={rightRef}>
        <section className={styles.contactsSection}>
          <div className={styles.contactsInner}>
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>Email</span>
              <a href="mailto:info@code412.com" className={styles.contactValue}>
                info@code412.com
              </a>
            </div>
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>Phone number</span>
              <a href="tel:+375666666" className={styles.contactValue}>
                +375 666 66 66
              </a>
            </div>
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>Social network</span>
              <div className={styles.socials}>
                <a href="#" className={styles.socialBtn} aria-label="Telegram">
                  <TelegramIcon size={44} />
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">
                  <InstagramIcon size={44} />
                </a>
                <a href="#" className={styles.socialBtn} aria-label="LinkedIn">
                  <LinkedInIcon size={44} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.formSection} ref={formSectRef}>
          <div className={styles.formInner}>
            {sent ? (
              <div className={styles.thanks}>
                <p className={styles.thanksTitle}>Got it.</p>
                <p className={styles.thanksText}>We'll get back to you within a day or two.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className={styles.form} noValidate suppressHydrationWarning>
                <div className={styles.field}>
                  <input name="name" className={ic("name")} placeholder="Full Name"
                    value={form.name} onChange={onChange} onBlur={() => onBlur("name")} autoComplete="name" />
                  {fieldError("name") && <span className={styles.errorMsg}>{fieldError("name")}</span>}
                </div>

                <div className={styles.field}>
                  <input name="phone" type="tel" inputMode="tel" className={ic("phone")}
                    placeholder="Phone Number" value={form.phone} onChange={onChange}
                    onBlur={() => onBlur("phone")} autoComplete="tel"
                    maxLength={16}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey || e.altKey) return;
                      if (["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"].includes(e.key)) return;
                      if (e.key === "+" && form.phone === "") return;
                      if (!/^\d$/.test(e.key)) e.preventDefault();
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <input name="email" type="email" inputMode="email" className={ic("email")}
                    placeholder="E-mail Address" value={form.email} onChange={onChange}
                    onBlur={() => onBlur("email")} autoComplete="email" suppressHydrationWarning />
                  {fieldError("email") && <span className={styles.errorMsg}>{fieldError("email")}</span>}
                </div>

                <div className={styles.field}>
                  <textarea name="message" className={styles.textarea} placeholder="Commentary"
                    value={form.message} onChange={onChange} onBlur={() => onBlur("message")} />
                </div>

                <div
                  className={`${styles.checkLabel}${submitted && !form.consent ? ` ${styles.checkLabelError}` : ""}`}
                  onClick={onCheck}
                  role="checkbox"
                  aria-checked={form.consent}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === " " && (e.preventDefault(), onCheck())}
                >
                  <span className={styles.checkBox} data-checked={form.consent}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path className={styles.checkMark} d="M1 4l3 3 5-6" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>I give my consent to the processing of personal data</span>
                </div>

                <button type="submit" className={styles.submit}>Send Request</button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
