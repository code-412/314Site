"use client";

import { useEffect, useRef } from "react";
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

const MOBILE_CP = [0, 0.12, 0.26, 0.40, 0.54, 0.68, 0.82, 0.96];

const STEPS = [
  { title: "Research",            description: "We begin by exploring the idea, market, and user needs behind the product. Through analysis and discovery, we define goals, understand the audience, and gather insights that guide every design and development decision that follows.", side: "right" as const, dotIndex: 1 },
  { title: "UX / Prototype",      description: "At this stage we shape the structure and logic of the product. User flows, wireframes, and interactive prototypes help us test ideas early, refine usability, and ensure that the experience feels clear, intuitive, and meaningful.", side: "left"  as const, dotIndex: 2 },
  { title: "UI Design",           description: "Here we transform structure into visual language. Typography, color, layout, and motion are carefully crafted to create a consistent interface that communicates the brand, supports usability, and makes every interaction clear and engaging.", side: "left" as const, dotIndex: 3 },
  { title: "Development",         description: "Design becomes a functional product through clean, structured code. Front-end and back-end systems are built with performance and scalability in mind, ensuring that the product works smoothly across devices and platforms.", side: "right" as const, dotIndex: 4 },
  { title: "Testing & Launching", description: "Before release we carefully test the product to ensure stability, performance, and usability. Once everything works as intended, we prepare the final deployment and launch the product into the real digital environment.", side: "left"  as const, dotIndex: 5 },
  { title: "Maintenance",         description: "After launch we continue supporting and improving the product. Updates, performance monitoring, and new features keep the system stable, secure, and ready to grow together with the needs of users and the business.", side: "right" as const, dotIndex: 6 },
];

const SVG_W = 420;
const SVG_H = Math.round(SVG_W * (2597 / 733));

// Find how many pixels along the path each dot sits — 80 samples per dot (~1ms total)
function computeDotLengths(path: SVGPathElement): number[] {
  const total = path.getTotalLength();
  return DOTS.map((dot) => {
    let minDist = Infinity;
    let best = 0;
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * total;
      const p = path.getPointAtLength(t);
      const d = Math.hypot(p.x - dot.cx, p.y - dot.cy);
      if (d < minDist) { minDist = d; best = t; }
    }
    return best;
  });
}

export function Process() {
  const sectionRef    = useRef<HTMLElement>(null);
  const pathRef       = useRef<SVGPathElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);
  const dotEls        = useRef<(SVGElement | null)[]>([]);
  const stepEls       = useRef<(HTMLDivElement | null)[]>([]);
  const mobileDotEls  = useRef<(HTMLDivElement | null)[]>([]);
  const mobileStepEls = useRef<(HTMLDivElement | null)[]>([]);
  const finishEl      = useRef<HTMLDivElement>(null);
  const mobileFinEl   = useRef<HTMLSpanElement>(null);
  const rafRef        = useRef<number>(0);
  const dotLengths    = useRef<number[]>([]);       // absolute px along path per dot
  const totalLen      = useRef<number>(0);
  const prevActive    = useRef<boolean[]>(new Array(DOTS.length).fill(false));
  const prevMob       = useRef<boolean[]>(new Array(DOTS.length).fill(false));

  useEffect(() => {
    const path    = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const len = path.getTotalLength();
    totalLen.current = len;
    path.style.strokeDasharray  = String(len);
    path.style.strokeDashoffset = String(len);

    // Compute after two paint frames — page is fully rendered, no animation jank
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dotLengths.current = computeDotLengths(path);
      });
    });

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        const progress = Math.max(0, Math.min(1, (scrolled / (rect.height + window.innerHeight)) * 1.25));
        const drawn    = len * progress;

        path.style.strokeDashoffset = String(len - drawn);

        if (mobileFillRef.current) {
          mobileFillRef.current.style.transform = `scaleY(${progress})`;
        }

        // Use accurate dot lengths if ready, otherwise cy-based fallback
        const ready = dotLengths.current.length === DOTS.length;

        DOTS.forEach((dot, i) => {
          const threshold = ready
            ? dotLengths.current[i]
            : (dot.cy / 2597) * len;
          const on = drawn >= threshold;

          if (on === prevActive.current[i]) return;
          prevActive.current[i] = on;

          const el = dotEls.current[i];
          if (el) {
            if (dot.type === "glow") {
              const circles = el.querySelectorAll("circle");
              circles[0].setAttribute("fill", on ? "#111" : "none");
              circles[1].setAttribute("fill", on ? "#111" : "none");
              circles[1].setAttribute("stroke", on ? "#111" : "#ccc");
            } else if (dot.type === "regular") {
              el.setAttribute("fill",   on ? "#111" : "none");
              el.setAttribute("stroke", on ? "#111" : "#ccc");
            } else {
              el.setAttribute("fill", on ? "#111" : "#ccc");
            }
          }

          const stepIdx = STEPS.findIndex(st => st.dotIndex === i);
          if (stepIdx !== -1) stepEls.current[stepIdx]?.classList.toggle(s["stepInner--visible"], on);
        });

        const lastThreshold = ready ? dotLengths.current[7] : (DOTS[7].cy / 2597) * len;
        finishEl.current?.classList.toggle(s["finish--visible"], drawn >= lastThreshold);

        MOBILE_CP.forEach((cp, i) => {
          const on = progress >= cp;
          if (on === prevMob.current[i]) return;
          prevMob.current[i] = on;
          mobileDotEls.current[i]?.classList.toggle(s["mobileDot--on"], on);
          if (i >= 1 && i <= 6) mobileStepEls.current[i - 1]?.classList.toggle(s["mobileStepInner--visible"], on);
          if (i === 7) mobileFinEl.current?.classList.toggle(s["mobileFinishLabel--visible"], on);
        });
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

        <div className={s.wrap} style={{ height: SVG_H + 80 }}>
          <div className={s.svgCol}>
            <svg width={SVG_W} height={SVG_H} viewBox="0 0 733 2597" fill="none" overflow="visible">
              <path d={PATH} stroke="#000" strokeOpacity="0.12" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path ref={pathRef} d={PATH} stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
              {DOTS.map((dot, i) => {
                if (dot.type === "glow") return (
                  <g key={i} ref={(el) => { dotEls.current[i] = el; }}>
                    <circle cx={dot.cx} cy={dot.cy} r={17} fill="none" fillOpacity={0.3} style={{ transition: "fill 0.35s ease" }} />
                    <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="none" stroke="#ccc" strokeWidth={2} style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }} />
                  </g>
                );
                if (dot.type === "regular") return (
                  <circle key={i} ref={(el) => { dotEls.current[i] = el; }} cx={dot.cx} cy={dot.cy} r={dot.r} fill="none" stroke="#ccc" strokeWidth={2} style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }} />
                );
                return (
                  <circle key={i} ref={(el) => { dotEls.current[i] = el; }} cx={dot.cx} cy={dot.cy} r={dot.r} fill={i === 0 ? "#111" : "#ccc"} style={{ transition: "fill 0.35s ease" }} />
                );
              })}
            </svg>
          </div>

          <div className={s.heading} style={{ top: `${(DOTS[0].cy / 2597) * 100}%` }}>
            Process
          </div>

          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className={`${s.step} ${s[`step--${step.side}`]}`}
              style={{ top: `${(DOTS[step.dotIndex].cy / 2597) * 100}%` }}
            >
              <div ref={(el) => { stepEls.current[idx] = el; }} className={s.stepInner}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}

          <div
            ref={finishEl}
            className={s.finish}
            style={{ top: `${(DOTS[7].cy / 2597) * SVG_H / (SVG_H + 80) * 100}%` }}
          >
            Finish
          </div>
        </div>

        <div className={s.mobileWrap}>
          <div className={s.mobileRail}>
            <div className={s.mobileRailBg} />
            <div className={s.mobileRailFill} ref={mobileFillRef} />
          </div>

          <div className={s.mobileRow}>
            <div ref={(el) => { mobileDotEls.current[0] = el; }} className={`${s.mobileDot} ${s["mobileDot--cap"]} ${s["mobileDot--on"]}`} />
            <span className={s.mobileHeadingLabel}>Process</span>
          </div>

          {STEPS.map((step, i) => (
            <div key={step.title} className={s.mobileRow}>
              <div ref={(el) => { mobileDotEls.current[i + 1] = el; }} className={s.mobileDot} />
              <div ref={(el) => { mobileStepEls.current[i] = el; }} className={s.mobileStepInner}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}

          <div className={s.mobileRow}>
            <div ref={(el) => { mobileDotEls.current[7] = el; }} className={`${s.mobileDot} ${s["mobileDot--cap"]}`} />
            <span ref={mobileFinEl} className={s.mobileFinishLabel}>Finish</span>
          </div>
        </div>

      </div>
    </section>
  );
}
