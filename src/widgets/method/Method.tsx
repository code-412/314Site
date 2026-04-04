"use client";

import { useEffect, useRef } from "react";
import s from "./Method.module.scss";

export function Method() {
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const lines = [
      { el: line1Ref.current, delay: 0 },
      { el: line2Ref.current, delay: 300 },
      { el: line3Ref.current, delay: 600 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          lines.forEach(({ el, delay }) => {
            if (el) setTimeout(() => el.classList.add(s["line--visible"]), delay);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const section = line1Ref.current?.closest("section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={s.method}>
      <div className={`${s.inner} container`}>
        <p className={s.line} ref={line1Ref}>
          &lt; / &gt; 314 — The 3-1-4 Method of Building Brands:
        </p>
        <p className={s.line} ref={line2Ref}>
          Three Directions, One Vision, Four Disciplines — Design and Technology.
        </p>
        <p className={`${s.line} ${s["line--accent"]}`} ref={line3Ref}>
          Precision in Design. Power in Code.
        </p>
      </div>
    </section>
  );
}
