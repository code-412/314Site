"use client";

import { useEffect, useState } from "react";
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

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }

function getError(field: keyof Touched, form: FormData): string | null {
  if (field === "name")  return form.name.trim().length < 2 ? "Enter your name" : null;
  if (field === "email") return !isValidEmail(form.email) ? "Invalid email address" : null;
  if (field === "message") return form.message.trim().length < 2 ? "Enter your message" : null;
  return null;
}

export function ContactDrawer() {
  const { open, closeDrawer } = useContactDrawer();
  const [form, setForm] = useState<FormData>(empty);
  const [touched, setTouched] = useState<Touched>(emptyTouched);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
        setSending(false);
        setSubmitError("");
      }, 400);
    }
  }, [open]);

  const onBlur = (field: keyof Touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onCheck = () =>
    setForm((prev) => ({ ...prev, consent: !prev.consent }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError("");
    setTouched({ name: true, phone: true, email: true, message: true });
    const hasError = (["name", "phone", "email", "message"] as (keyof Touched)[]).some(
      (f) => getError(f, form)
    );
    if (hasError || !form.consent) return;
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Contact drawer" }),
      });

      if (!response.ok) {
        setSubmitError("Could not send the request. Please try again.");
        return;
      }

      setSent(true);
    } finally {
      setSending(false);
    }
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
              <p className={s.thanksText}>We&apos;ll get back to you within a day or two.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className={s.form} noValidate suppressHydrationWarning>
              <div className={s.field}>
                <input name="name" className={ic("name")} placeholder="Full Name"
                  value={form.name} onChange={onChange} onBlur={() => onBlur("name")} autoComplete="name" />
                {fieldError("name") && <span className={s.errorMsg}>{fieldError("name")}</span>}
              </div>

              <div className={s.field}>
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

              <div className={s.field}>
                <input name="email" type="email" inputMode="email" className={ic("email")}
                  placeholder="E-mail Address" value={form.email} onChange={onChange}
                  onBlur={() => onBlur("email")} autoComplete="email" suppressHydrationWarning />
                {fieldError("email") && <span className={s.errorMsg}>{fieldError("email")}</span>}
              </div>

              <div className={s.field}>
                <textarea name="message" className={s.textarea} placeholder="Commentary"
                  value={form.message} onChange={(e) => { onChange(e); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  onBlur={() => onBlur("message")} rows={1} />
                {fieldError("message") && <span className={s.errorMsg}>{fieldError("message")}</span>}
              </div>

              <div
                className={`${s.checkLabel}${submitted && !form.consent ? ` ${s.checkLabelError}` : ""}`}
                onClick={onCheck}
                role="checkbox"
                aria-checked={form.consent}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && (e.preventDefault(), onCheck())}
              >
                <span className={s.checkBox} data-checked={form.consent}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path className={s.checkMark} d="M1 4l3 3 5-6" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>I give my consent to the processing of personal data</span>
              </div>

              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="paint-drip" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="turbulence" baseFrequency="0.04 0.08" numOctaves="4" seed="5" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G"/>
                  </filter>
                </defs>
              </svg>

              {submitError && <span className={s.errorMsg}>{submitError}</span>}

              <button type="submit" className={s.submit} disabled={sending}>
                <span>{sending ? "Sending..." : "Send Request"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
