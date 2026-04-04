"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.scss";

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
  const rightRef = useRef<HTMLDivElement>(null);

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
      <div className={styles.left}>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>We are</span>
          <span className={styles.titleLine}>ready to</span>
          <span className={styles.wordWrap}>
            <span className={styles.wordDiscuss}>discuss</span>
            <span className={styles.wordHear}>hear</span>
          </span>
          <span className={styles.titleLine}>your</span>
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.5 7.833 13 2.5l-3 11-3-4.5-2 1.5 1-4.5L13 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Behance">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h4c1.1 0 2 .9 2 2s-.9 2-2 2H2V4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M2 8h4.5C7.88 8 9 9.12 9 10.5S7.88 13 6.5 13H2V8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M11 9h4c0-1.1-.9-2-2-2s-2 .9-2 2v1.5C11 11.9 11.9 13 13 13c.83 0 1.54-.5 1.85-1.22M10 5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
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
                    onBlur={() => onBlur("phone")} autoComplete="tel" />
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
