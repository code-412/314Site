"use client";

import { useEffect, useRef, useState } from "react";
import s from "./AdvantagesSection.module.scss";

function applyPhoneMask(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 12);
  if (!d) return "";
  let r = "+";
  if (d.length > 0)  r += d.slice(0, 3);
  if (d.length > 3)  r += " " + d.slice(3, 6);
  if (d.length > 6)  r += " " + d.slice(6, 8);
  if (d.length > 8)  r += " " + d.slice(8, 10);
  if (d.length > 10) r += " " + d.slice(10, 12);
  return r;
}

type FD = { name: string; phone: string; email: string; message: string; consent: boolean };
type Touched = { name: boolean; phone: boolean; email: boolean; message: boolean };

const emptyFD: FD = { name: "", phone: "", email: "", message: "", consent: false };
const emptyT: Touched = { name: false, phone: false, email: false, message: false };

function getErr(field: keyof Touched, f: FD): string | null {
  if (field === "name")  return f.name.trim().length < 2 ? "Enter your name" : null;
  if (field === "phone") return f.phone && f.phone.replace(/\D/g, "").length < 7 ? "Invalid phone" : null;
  if (field === "email") return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()) ? "Invalid email" : null;
  return null;
}

const ADVANTAGES = [
  {
    num: "01",
    title: "Individual Approach",
    text: "Lorem ipsum dolor sit amet consectetur. Aenean ut magna justo libero risus neque at felis donec. Sit pulvinar cursus tempus ullamcorper facilisis elementum id velit convallis. Ac nulla suspendisse velit sit mattis vulputate aenean. Nunc in pretium in velit enim ut pulvinar dis. Est viverra mattis id sed neque erat vulputate duis.",
  },
  {
    num: "02",
    title: "Full Cycle Production",
    text: "Lorem ipsum dolor sit amet consectetur. Aenean ut magna justo libero risus neque at felis donec. Sit pulvinar cursus tempus ullamcorper facilisis elementum id velit convallis. Ac nulla suspendisse velit sit mattis vulputate aenean. Nunc in pretium in velit enim ut pulvinar dis. Est viverra mattis id sed neque erat vulputate duis.",
  },
  {
    num: "03",
    title: "Measurable Results",
    text: "Lorem ipsum dolor sit amet consectetur. Aenean ut magna justo libero risus neque at felis donec. Sit pulvinar cursus tempus ullamcorper facilisis elementum id velit convallis. Ac nulla suspendisse velit sit mattis vulputate aenean. Nunc in pretium in velit enim ut pulvinar dis. Est viverra mattis id sed neque erat vulputate duis.",
  },
];

const T_DOT1   = 0.02;
const T_BLOCK1 = 0.06;
const T_DOT2   = 0.28;
const T_BLOCK2 = 0.33;
const T_DOT3   = 0.54;
const T_BLOCK3 = 0.59;
const T_FORM   = 0.62;

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function AdvantagesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);

  const [dot1, setDot1]       = useState(false);
  const [dot2, setDot2]       = useState(false);
  const [dot3, setDot3]       = useState(false);
  const [vis1, setVis1]       = useState(false);
  const [vis2, setVis2]       = useState(false);
  const [vis3, setVis3]       = useState(false);
  const [visForm, setVisForm] = useState(false);

  const [form, setForm]           = useState<FD>(emptyFD);
  const [touched, setTouched]     = useState<Touched>(emptyT);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent]           = useState(false);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const sec = sectionRef.current;
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const vh   = window.innerHeight;

        const scrolled = vh * 0.5 - rect.top;
        const p        = Math.max(0, Math.min(1, scrolled / rect.height));

        if (lineRef.current) {
          lineRef.current.style.transform = `scaleY(${clamp(p / T_FORM, 0, 1)})`;
        }

        setDot1(p >= T_DOT1);
        setVis1(p >= T_BLOCK1);
        setDot2(p >= T_DOT2);
        setVis2(p >= T_BLOCK2);
        setDot3(p >= T_DOT3);
        setVis3(p >= T_BLOCK3);
        setVisForm(p >= T_FORM);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
    const hasErr = (["name", "phone", "email", "message"] as (keyof Touched)[]).some(
      (f) => getErr(f, form),
    );
    if (hasErr || !form.consent) return;
    setSent(true);
  };

  const fieldErr = (field: keyof Touched) =>
    touched[field] || submitted ? getErr(field, form) : null;

  const ic = (field: keyof Touched) =>
    [s.input, fieldErr(field) ? s.inputError : ""].filter(Boolean).join(" ");

  return (
    <section ref={sectionRef} className={s.section}>
      <div className="container">

        <h2 className={s.heading}>Advantages<br />of the Company</h2>

        <div className={s.layout}>
          <div />

          <div className={s.timeline}>
            <div className={s.lineTrack}>
              <div ref={lineRef} className={s.lineFill} />
            </div>

            <div className={s.step}>
              <div className={`${s.dot} ${dot1 ? s.dotFilled : ""}`} />
              <div className={`${s.block} ${vis1 ? s.blockVisible : ""}`}>
                <span className={s.num}>{ADVANTAGES[0].num}</span>
                <h3 className={s.blockTitle}>{ADVANTAGES[0].title}</h3>
                <p className={s.blockText}>{ADVANTAGES[0].text}</p>
              </div>
            </div>

            <div className={s.step}>
              <div className={`${s.dot} ${dot2 ? s.dotFilled : ""}`} />
              <div className={`${s.block} ${vis2 ? s.blockVisible : ""}`}>
                <span className={s.num}>{ADVANTAGES[1].num}</span>
                <h3 className={s.blockTitle}>{ADVANTAGES[1].title}</h3>
                <p className={s.blockText}>{ADVANTAGES[1].text}</p>
              </div>
            </div>

            <div className={s.step}>
              <div className={`${s.dot} ${dot3 ? s.dotFilled : ""}`} />
              <div className={`${s.block} ${vis3 ? s.blockVisible : ""}`}>
                <span className={s.num}>{ADVANTAGES[2].num}</span>
                <h3 className={s.blockTitle}>{ADVANTAGES[2].title}</h3>
                <p className={s.blockText}>{ADVANTAGES[2].text}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${s.formRect} ${visForm ? s.formRectVisible : ""}`}>
          {sent ? (
            <div className={s.thanks}>
              <p className={s.thanksTitle}>Got it.</p>
              <p className={s.thanksText}>We&apos;ll get back to you within a day or two.</p>
            </div>
          ) : (
            <div className={s.formLayout}>
              <div className={s.formLeft}>
                <p className={s.formHeadingLight}>Do you have a task?</p>
                <p className={s.formHeadingBold}>Let&apos;s discuss it!</p>
                <form onSubmit={onSubmit} noValidate>
                  <div className={s.field}>
                    <input name="name" className={ic("name")} placeholder="Full Name"
                      value={form.name} onChange={onChange} onBlur={() => onBlur("name")} autoComplete="name" />
                    {fieldErr("name") && <span className={s.errMsg}>{fieldErr("name")}</span>}
                  </div>
                  <div className={s.field}>
                    <input name="phone" type="tel" inputMode="tel" className={ic("phone")} placeholder="Phone Number"
                      value={form.phone} onChange={onChange} onBlur={() => onBlur("phone")} autoComplete="tel" />
                    {fieldErr("phone") && <span className={s.errMsg}>{fieldErr("phone")}</span>}
                  </div>
                  <div className={s.field}>
                    <input name="email" type="email" inputMode="email" className={ic("email")} placeholder="E-mail Address"
                      value={form.email} onChange={onChange} onBlur={() => onBlur("email")} autoComplete="email" />
                    {fieldErr("email") && <span className={s.errMsg}>{fieldErr("email")}</span>}
                  </div>
                  <div className={s.field}>
                    <textarea name="message" className={s.textarea} placeholder="Commentary"
                      value={form.message}
                      onChange={(e) => { onChange(e); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                      onBlur={() => onBlur("message")} rows={2} />
                  </div>
                  <label className={`${s.checkLabel}${submitted && !form.consent ? ` ${s.checkLabelError}` : ""}`}>
                    <input type="checkbox" className={s.checkbox} checked={form.consent} onChange={onCheck} />
                    <span>I give my consent to the processing of personal data</span>
                  </label>
                  <button type="submit" className={s.submit}>Send Request</button>
                </form>
              </div>

              <div className={s.formRight}>
                <p className={s.contactPhone}>+375 666 66 66</p>
                <p className={s.contactEmail}>info@code412.com</p>
                <div className={s.socials}>
                  <a href="#" className={s.socialBtn} aria-label="Telegram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  <a href="#" className={s.socialBtn} aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a href="#" className={s.socialBtn} aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
