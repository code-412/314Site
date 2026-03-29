"use client";

import { useState, useRef } from "react";
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

function applyPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  if (!digits) return "";
  let result = "+";
  if (digits.length > 0)  result += digits.slice(0, 3);
  if (digits.length > 3)  result += " " + digits.slice(3, 6);
  if (digits.length > 6)  result += " " + digits.slice(6, 8);
  if (digits.length > 8)  result += " " + digits.slice(8, 10);
  if (digits.length > 10) result += " " + digits.slice(10, 12);
  return result;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

function getError(field: keyof Omit<FormData, "consent">, form: FormData): string | null {
  switch (field) {
    case "name":
      return form.name.trim().length < 2 ? "Enter your name" : null;
    case "phone":
      return form.phone && !isValidPhone(form.phone) ? "Invalid phone number" : null;
    case "email":
      return !isValidEmail(form.email) ? "Invalid email address" : null;
    case "message":
      return null;
  }
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(empty);
  const [touched, setTouched] = useState<Touched>(emptyTouched);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onBlur = (field: keyof Touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: applyPhoneMask(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ name: true, phone: true, email: true, message: true });

    const fields: (keyof Touched)[] = ["name", "phone", "email", "message"];
    const hasError = fields.some((f) => getError(f, form));
    if (hasError || !form.consent) return;

    console.log("Contact form:", form);
    setSent(true);
  };

  const fieldError = (field: keyof Touched) =>
    (touched[field] || submitted) ? getError(field, form) : null;

  const inputClass = (field: keyof Touched) =>
    [styles.input, fieldError(field) ? styles.inputError : ""].join(" ").trim();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <h1 className={styles.heroTitle}>
            We are<br />ready to<br />discuss your<br />future<br />project
          </h1>

          <div className={styles.heroContacts}>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialBtn} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" className={styles.socialBtn} aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={`${styles.formInner} container`}>
          <h2 className={styles.formTitle}>
            We are<br />ready to<br />hear your<br />future<br />project
          </h2>

          <div className={styles.formWrap}>
            {sent ? (
              <div className={styles.thanks}>
                <p className={styles.thanksTitle}>Got it.</p>
                <p className={styles.thanksText}>
                  We'll get back to you within a day or two.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} className={styles.form} noValidate>
                <div className={styles.field}>
                  <input
                    name="name"
                    className={inputClass("name")}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={onChange}
                    onBlur={() => onBlur("name")}
                    autoComplete="name"
                  />
                  {fieldError("name") && (
                    <span className={styles.errorMsg}>{fieldError("name")}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    className={inputClass("phone")}
                    placeholder="+___ ___ __ __"
                    value={form.phone}
                    onChange={onChange}
                    onBlur={() => onBlur("phone")}
                    autoComplete="tel"
                  />
                  {fieldError("phone") && (
                    <span className={styles.errorMsg}>{fieldError("phone")}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    className={inputClass("email")}
                    placeholder="E-mail Address"
                    value={form.email}
                    onChange={onChange}
                    onBlur={() => onBlur("email")}
                    autoComplete="email"
                  />
                  {fieldError("email") && (
                    <span className={styles.errorMsg}>{fieldError("email")}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <textarea
                    name="message"
                    className={styles.textarea}
                    placeholder="Commentary"
                    value={form.message}
                    onChange={onChange}
                    onBlur={() => onBlur("message")}
                  />
                </div>

                <label className={`${styles.checkLabel}${submitted && !form.consent ? ` ${styles.checkLabelError}` : ""}`}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={form.consent}
                    onChange={onCheck}
                  />
                  <span>I give my consent to the processing of personal data</span>
                </label>

                <button type="submit" className={styles.submit}>
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
