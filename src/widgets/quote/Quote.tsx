"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Quote.module.scss";

const LINES = [
  "The code412 approach connects vision, design ,  ",
  "thinking and engineering into one structured workflow. ",
  "Ideas evolve step by step into precise interfaces and reliable  ",
  "digital products, where creativity and technology work together",
  "to shape clear, scalable, and meaningful digital experiences.",
];

const CHAR_DELAY  = 55;
const WORDS_AHEAD = 4;

export function Quote() {
  const [typed, setTyped] = useState(LINES.map(() => ""));
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef     = useRef<number>(0);
  const started    = useRef(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 900;

    const startTimes: number[] = [];
    let t = 0;
    LINES.forEach((text) => {
      startTimes.push(t);
      if (isMobile) {
        t += text.length * CHAR_DELAY;
      } else {
        const triggerChars = text.split(" ").slice(0, WORDS_AHEAD).join(" ").length + 1;
        t += triggerChars * CHAR_DELAY;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;

        const origin = performance.now();

        const tick = (now: number) => {
          const elapsed = now - origin;
          let allDone = true;

          setTyped(LINES.map((text, i) => {
            if (elapsed < startTimes[i]) { allDone = false; return ""; }
            const chars = Math.min(
              Math.floor((elapsed - startTimes[i]) / CHAR_DELAY) + 1,
              text.length
            );
            if (chars < text.length) allDone = false;
            return text.slice(0, chars);
          }));

          if (!allDone) rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className={s.quote} ref={sectionRef}>
      <div className={`${s.inner} container`}>
        <p className={s.text}>
          {LINES.map((text, i) => (
            <span key={i} className={s.line}>
              <span className={s.placeholder}>{text}</span>
              <span className={s.typed}>
                {typed[i]}
                {typed[i].length > 0 && typed[i].length < text.length && (
                  <span className={s.cursor}>|</span>
                )}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
