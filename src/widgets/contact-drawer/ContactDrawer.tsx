"use client";

import { useEffect, useRef, useState } from "react";
import { useContactDrawer } from "@/shared/lib/contact-drawer-context";
import s from "./ContactDrawer.module.scss";

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

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
function isValidPhone(v: string) { return v.replace(/\D/g, "").length >= 7; }

function getError(field: keyof Touched, form: FormData): string | null {
  if (field === "name")  return form.name.trim().length < 2 ? "Enter your name" : null;
  if (field === "phone") return form.phone && !isValidPhone(form.phone) ? "Invalid phone number" : null;
  if (field === "email") return !isValidEmail(form.email) ? "Invalid email address" : null;
  return null;
}

export function ContactDrawer() {
  const { open, closeDrawer } = useContactDrawer();
  const [form, setForm] = useState<FormData>(empty);
  const [touched, setTouched] = useState<Touched>(emptyTouched);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm(empty);
        setTouched(emptyTouched);
        setSubmitted(false);
        setSent(false);
      }, 400);
    }
  }, [open]);

  const onBlur = (field: keyof Touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? applyPhoneMask(value) : value,
    }));
  };

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, consent: e.target.checked }));

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
    touched[field] || submitted ? getError(field, form) : null;

  const ic = (field: keyof Touched) =>
    [s.input, fieldError(field) ? s.inputError : ""].filter(Boolean).join(" ");

  return (
    <>
      <div
        className={`${s.overlay}${open ? ` ${s.overlayVisible}` : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div
        className={`${s.drawer}${open ? ` ${s.drawerOpen}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Contact us"
      >
        <div className={s.drawerInner}>
          <div className={s.drawerHead}>
            <h2 className={s.drawerTitle}>Contact us</h2>
            <button className={s.closeBtn} onClick={closeDrawer} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {sent ? (
            <div className={s.thanks}>
              <p className={s.thanksTitle}>Got it.</p>
              <p className={s.thanksText}>We'll get back to you within a day or two.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className={s.form} noValidate>
              <div className={s.field}>
                <input
                  name="name"
                  className={ic("name")}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={onChange}
                  onBlur={() => onBlur("name")}
                  autoComplete="name"
                />
                {fieldError("name") && <span className={s.errorMsg}>{fieldError("name")}</span>}
              </div>

              <div className={s.field}>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  className={ic("phone")}
                  placeholder="+___ ___ __ __"
                  value={form.phone}
                  onChange={onChange}
                  onBlur={() => onBlur("phone")}
                  autoComplete="tel"
                />
                {fieldError("phone") && <span className={s.errorMsg}>{fieldError("phone")}</span>}
              </div>

              <div className={s.field}>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  className={ic("email")}
                  placeholder="E-mail Address"
                  value={form.email}
                  onChange={onChange}
                  onBlur={() => onBlur("email")}
                  autoComplete="email"
                />
                {fieldError("email") && <span className={s.errorMsg}>{fieldError("email")}</span>}
              </div>

              <div className={s.field}>
                <textarea
                  name="message"
                  className={s.textarea}
                  placeholder="Commentary"
                  value={form.message}
                  onChange={(e) => {
                    onChange(e);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onBlur={() => onBlur("message")}
                  rows={1}
                />
              </div>

              <label className={`${s.checkLabel}${submitted && !form.consent ? ` ${s.checkLabelError}` : ""}`}>
                <input
                  type="checkbox"
                  className={s.checkbox}
                  checked={form.consent}
                  onChange={onCheck}
                />
                <span>I give my consent to the processing of personal data</span>
              </label>

              <button type="submit" className={s.submit}>Send Request</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
