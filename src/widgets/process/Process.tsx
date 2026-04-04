"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Process.module.scss";

const PATH =
  "M365.314 24C365.025 24.5 350.314 267 485.314 267C620.314 267 554.314 178 502.314 182C450.314 186 282.314 257 383.814 423C485.314 589 204.814 669.5 209.314 817C213.814 964.5 370.814 1174 524.814 1199C678.814 1224 715.814 1091.5 634.814 1091.5C553.814 1091.5 532.814 1322 595.314 1394.5C657.814 1467 363.314 1654 246.814 1558.5C130.314 1463 -131.186 1745 84.814 1849C300.814 1953 365.314 1886 365.314 1990C355.045 2072.79 369.907 2217.94 511.5 2136.19C688.492 2034 825.128 2191 634.814 2281.5C444.5 2372 418 2372 418 2479C418 2564.6 418 2549.5 418 2578";

const DOTS = [
  { cx: 366, cy: 12,   r: 12, type: "cap"     },
  { cx: 372, cy: 403,  r: 12, type: "glow"    },
  { cx: 232, cy: 739,  r: 11, type: "regular" },
  { cx: 452, cy: 1174, r: 11, type: "regular" },
  { cx: 506, cy: 1529, r: 11, type: "regular" },
  { cx: 237, cy: 1905, r: 11, type: "regular" },
  { cx: 721, cy: 2151, r: 11, type: "regular" },
  { cx: 418, cy: 2585, r: 12, type: "cap"     },
] as const;

const CHECKPOINTS = DOTS.map((d) => d.cy / 2597);

const MOBILE_CHECKPOINTS = [0, 0.12, 0.26, 0.40, 0.54, 0.68, 0.82, 0.96];

const STEPS = [
  { title: "Research",            description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "right" as const, dotIndex: 1 },
  { title: "UX / Prototype",      description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "left"  as const, dotIndex: 2 },
  { title: "UI Design",           description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "right" as const, dotIndex: 3 },
  { title: "Development",         description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "right" as const, dotIndex: 4 },
  { title: "Testing & Launching", description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "left"  as const, dotIndex: 5 },
  { title: "Maintenance",         description: "Lorem ipsum dolor sit amet consectetur. Accumsan cras fringilla aliquet dolor convallis. Sed pulvinar facilisis scelerisque auismod est etiam moda.", side: "right" as const, dotIndex: 6 },
];

const SVG_W = 420;
const SVG_H = Math.round(SVG_W * (2597 / 733));

export function Process() {
  const sectionRef     = useRef<HTMLElement>(null);
  const pathRef        = useRef<SVGPathElement>(null);
  const mobileFillRef  = useRef<HTMLDivElement>(null);
  const rafRef         = useRef<number>(0);
  const [active,       setActive]       = useState<boolean[]>(new Array(DOTS.length).fill(false));
  const [mobileActive, setMobileActive] = useState<boolean[]>(new Array(DOTS.length).fill(false));

  useEffect(() => {
    const path    = pathRef.current;
    const section = sectionRef.current;
    if (!section) return;

    let len = 0;
    if (path) {
      len = path.getTotalLength();
      path.style.strokeDasharray  = String(len);
      path.style.strokeDashoffset = String(len);
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const scrolled = window.innerHeight * 0.5 - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / rect.height));

        if (path) path.style.strokeDashoffset = String(len * (1 - progress));

        if (mobileFillRef.current) {
          mobileFillRef.current.style.transform = `scaleY(${progress})`;
        }

        setActive(CHECKPOINTS.map((cp) => progress >= cp));
        setMobileActive(MOBILE_CHECKPOINTS.map((cp) => progress >= cp));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className={s.process} ref={sectionRef}>
      <div className="container">

        {/* ── DESKTOP ── */}
        <div className={s.wrap} style={{ height: SVG_H + 80 }}>
          <div className={s.svgCol}>
            <svg width={SVG_W} height={SVG_H} viewBox="0 0 733 2597" fill="none" overflow="visible">
              <path d={PATH} stroke="#000" strokeOpacity="0.12" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path ref={pathRef} d={PATH} stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
              {DOTS.map((dot, i) => {
                const on = active[i];
                if (dot.type === "glow") return (
                  <g key={i}>
                    <circle cx={dot.cx} cy={dot.cy} r={17} fill={on ? "#111" : "#ccc"} fillOpacity={0.3} style={{ transition: "fill 0.35s ease" }} />
                    <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={on ? "#111" : "#ccc"} style={{ transition: "fill 0.35s ease" }} />
                  </g>
                );
                if (dot.type === "regular") return (
                  <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={on ? "#111" : "none"} stroke={on ? "#111" : "#ccc"} strokeWidth={2} style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }} />
                );
                return (
                  <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={on ? "#111" : "#ccc"} style={{ transition: "fill 0.35s ease" }} />
                );
              })}
            </svg>
          </div>

          <div className={s.heading} style={{ top: `${(DOTS[0].cy / 2597) * 100}%` }}>
            Process
          </div>

          {STEPS.map((step) => (
            <div
              key={step.title}
              className={`${s.step} ${s[`step--${step.side}`]}`}
              style={{ top: `${(DOTS[step.dotIndex].cy / 2597) * 100}%` }}
            >
              <div className={`${s.stepInner}${active[step.dotIndex] ? ` ${s["stepInner--visible"]}` : ""}`}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}

          <div
            className={`${s.finish}${active[7] ? ` ${s["finish--visible"]}` : ""}`}
            style={{ top: `${(DOTS[7].cy / 2597) * SVG_H / (SVG_H + 80) * 100}%` }}
          >
            Finish
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className={s.mobileWrap}>
          <div className={s.mobileRail}>
            <div className={s.mobileRailBg} />
            <div className={s.mobileRailFill} ref={mobileFillRef} />
          </div>

          <div className={s.mobileRow}>
            <div className={`${s.mobileDot} ${s["mobileDot--cap"]}${mobileActive[0] ? ` ${s["mobileDot--on"]}` : ""}`} />
            <span className={s.mobileHeadingLabel}>Process</span>
          </div>

          {STEPS.map((step, i) => {
            const isLastActive = mobileActive[i + 1] && !mobileActive[i + 2];
            return (
            <div key={step.title} className={s.mobileRow}>
              <div className={[
                s.mobileDot,
                mobileActive[i + 1] ? s["mobileDot--on"] : "",
                isLastActive ? s["mobileDot--glow"] : "",
              ].filter(Boolean).join(" ")} />
              <div className={`${s.mobileStepInner}${mobileActive[i + 1] ? ` ${s["mobileStepInner--visible"]}` : ""}`}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.description}</p>
              </div>
            </div>
            );
          })}

          <div className={s.mobileRow}>
            <div className={`${s.mobileDot} ${s["mobileDot--cap"]}${mobileActive[7] ? ` ${s["mobileDot--on"]}` : ""}`} />
            <span className={`${s.mobileFinishLabel}${mobileActive[7] ? ` ${s["mobileFinishLabel--visible"]}` : ""}`}>Finish</span>
          </div>
        </div>

      </div>
    </section>
  );
}
