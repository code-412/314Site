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

const T_DOT1         = 0.02;
const T_BLOCK1       = 0.06;
const T_BORDER_START = 0.62;
const T_BORDER_END   = 0.68;
const T_CONTENT      = 0.71;

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function AdvantagesSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const lineRef       = useRef<HTMLDivElement>(null);
  const lineTrackRef  = useRef<HTMLDivElement>(null);
  const dot2ElRef     = useRef<HTMLDivElement>(null);
  const dot3ElRef     = useRef<HTMLDivElement>(null);
  const dot2FracRef   = useRef(0.33);
  const dot3FracRef   = useRef(0.67);
  const borderRef      = useRef<SVGPathElement>(null);
  const borderRef2     = useRef<SVGPathElement>(null);
  const svgRef         = useRef<SVGSVGElement>(null);
  const lenRef         = useRef(0);
  const rafRef        = useRef<number>(0);

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
    const measure = () => {
      const track = lineTrackRef.current;
      const d2    = dot2ElRef.current;
      const d3    = dot3ElRef.current;
      if (!track || !d2 || !d3) return;
      const tR  = track.getBoundingClientRect();
      const d2R = d2.getBoundingClientRect();
      const d3R = d3.getBoundingClientRect();
      dot2FracRef.current = (d2R.top + d2R.height / 2 - tR.top) / tR.height;
      dot3FracRef.current = (d3R.top + d3R.height / 2 - tR.top) / tR.height;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const measure = () => {
      const svg = svgRef.current;
      const el  = borderRef.current;
      const el2 = borderRef2.current;
      if (!svg || !el || !el2) return;
      const W = svg.clientWidth;
      const H = svg.clientHeight;
      const hw = W / 2;
      el.setAttribute("d",  `M ${hw} 0 H ${W} V ${H} H 0 V 0 H ${hw}`);
      el2.setAttribute("d", `M ${hw} 0 H 0 V ${H} H ${W} V 0 H ${hw}`);
      const len = el.getTotalLength();
      lenRef.current = len;
      el.style.strokeDasharray  = String(len);
      el.style.strokeDashoffset = String(len);
      el2.style.strokeDasharray  = String(len);
      el2.style.strokeDashoffset = String(len);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

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

        const lineProgress = clamp(p / T_BORDER_START, 0, 1);
        if (lineRef.current) {
          lineRef.current.style.transform = `scaleY(${lineProgress})`;
        }

        if (lenRef.current > 0) {
          const borderProgress = clamp((p - T_BORDER_START) / (T_BORDER_END - T_BORDER_START), 0, 1);
          const offset = lenRef.current * (1 - borderProgress);
          if (borderRef.current)  borderRef.current.style.strokeDashoffset  = String(offset);
          if (borderRef2.current) borderRef2.current.style.strokeDashoffset = String(offset);
        }

        setDot1(p >= T_DOT1);
        setVis1(p >= T_BLOCK1);
        setDot2(lineProgress >= dot2FracRef.current);
        setVis2(lineProgress >= dot2FracRef.current + 0.04);
        setDot3(lineProgress >= dot3FracRef.current);
        setVis3(lineProgress >= dot3FracRef.current + 0.04);
        setVisForm(p >= T_CONTENT);
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

  const onCheck = () =>
    setForm((prev) => ({ ...prev, consent: !prev.consent }));

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
            <div ref={lineTrackRef} className={s.lineTrack}>
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
              <div ref={dot2ElRef} className={`${s.dot} ${dot2 ? s.dotFilled : ""}`} />
              <div className={`${s.block} ${vis2 ? s.blockVisible : ""}`}>
                <span className={s.num}>{ADVANTAGES[1].num}</span>
                <h3 className={s.blockTitle}>{ADVANTAGES[1].title}</h3>
                <p className={s.blockText}>{ADVANTAGES[1].text}</p>
              </div>
            </div>

            <div className={s.step}>
              <div ref={dot3ElRef} className={`${s.dot} ${dot3 ? s.dotFilled : ""}`} />
              <div className={`${s.block} ${vis3 ? s.blockVisible : ""}`}>
                <span className={s.num}>{ADVANTAGES[2].num}</span>
                <h3 className={s.blockTitle}>{ADVANTAGES[2].title}</h3>
                <p className={s.blockText}>{ADVANTAGES[2].text}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={s.formRect}>
          <svg
            ref={svgRef}
            className={s.formBorderSvg}
            aria-hidden="true"
          >
            <path
              ref={borderRef}
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={borderRef2}
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className={`${s.formContent} ${visForm ? s.formContentVisible : ""}`}>
            {sent ? (
              <div className={s.thanks}>
                <p className={s.thanksTitle}>Got it.</p>
                <p className={s.thanksText}>We&apos;ll get back to you within a day or two.</p>
              </div>
            ) : (
              <div className={s.formLayout}>
                <div className={s.formLeft}>
                  <p className={s.formHeading}>Do you have a task?<br />Let&apos;s discuss it!</p>
                  <form onSubmit={onSubmit} noValidate>
                    <div className={s.field}>
                      <input suppressHydrationWarning name="name" className={ic("name")} placeholder="Full Name"
                        value={form.name} onChange={onChange} onBlur={() => onBlur("name")} autoComplete="name" />
                      {fieldErr("name") && <span className={s.errMsg}>{fieldErr("name")}</span>}
                    </div>
                    <div className={s.field}>
                      <input suppressHydrationWarning name="phone" type="tel" inputMode="tel" className={ic("phone")} placeholder="Phone Number"
                        value={form.phone} onChange={onChange} onBlur={() => onBlur("phone")} autoComplete="tel" />
                      {fieldErr("phone") && <span className={s.errMsg}>{fieldErr("phone")}</span>}
                    </div>
                    <div className={s.field}>
                      <input suppressHydrationWarning name="email" type="email" inputMode="email" className={ic("email")} placeholder="E-mail Address"
                        value={form.email} onChange={onChange} onBlur={() => onBlur("email")} autoComplete="email" />
                      {fieldErr("email") && <span className={s.errMsg}>{fieldErr("email")}</span>}
                    </div>
                    <div className={s.field}>
                      <textarea name="message" className={s.textarea} placeholder="Commentary"
                        value={form.message}
                        onChange={(e) => { onChange(e); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                        onBlur={() => onBlur("message")} rows={2} />
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
                    <button type="submit" className={s.submit}>Send Request</button>
                  </form>
                </div>

                <div className={s.formRight}>
                  <p className={s.contactPhone}>+375 666 66 66</p>
                  <p className={s.contactEmail}>info@code412.com</p>
                  <div className={s.socials}>
                    <a href="#" className={s.socialBtn} aria-label="Telegram">
                      <TelegramIcon size={28} />
                    </a>
                    <a href="#" className={s.socialBtn} aria-label="Instagram">
                      <InstagramIcon size={28} />
                    </a>
                    <a href="#" className={s.socialBtn} aria-label="LinkedIn">
                      <LinkedInIcon size={28} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
