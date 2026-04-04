"use client";

import { useEffect, useRef, useState } from "react";
import s from "./AdvantagesSection.module.scss";
import { TelegramIcon, InstagramIcon, LinkedInIcon } from "@/shared/icons/SocialIcons";

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
                    <TelegramIcon size={18} />
                  </a>
                  <a href="#" className={s.socialBtn} aria-label="Instagram">
                    <InstagramIcon size={18} />
                  </a>
                  <a href="#" className={s.socialBtn} aria-label="LinkedIn">
                    <LinkedInIcon size={18} />
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
