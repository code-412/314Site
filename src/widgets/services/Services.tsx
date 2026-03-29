"use client";

import { useEffect, useRef } from "react";
import s from "./Services.module.scss";

type ServiceCol = {
  title: string;
  description: string;
  items: string[];
};

const columns: ServiceCol[] = [
  {
    title: "BRANDING",
    description:
      "Lorem ipsum dolor sit amet consectetur. Habitant adipiscing cursus parturient dignissim ornare urna aliquam. Ac elementum risus sagittis.",
    items: ["IDENTITY", "STRATEGY", "COPYWRITING", "DIRECTION"],
  },
  {
    title: "DEVELOPMENT",
    description:
      "Lorem ipsum dolor sit amet consectetur. Habitant adipiscing cursus parturient dignissim ornare urna aliquam. Ac elementum risus sagittis.",
    items: ["AI", "FRONT-END", "BACK-END", "SOFTWARE", "WEB", "TELEGRAM"],
  },
  {
    title: "DIGITAL",
    description:
      "Lorem ipsum dolor sit amet consectetur. Habitant adipiscing cursus parturient dignissim ornare urna aliquam. Ac elementum risus sagittis.",
    items: ["WEB DESIGN", "UI/UX DESIGN", "BRAND DESIGN", "USER FLOW"],
  },
];

const delays = [0, 200, 400];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const colRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          colRefs.current.forEach((col, i) => {
            if (col) setTimeout(() => col.classList.add(s["col--visible"]), delays[i]);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={s.services} id="services" ref={sectionRef}>
      <div className="container">
        <div className={s.grid}>
          {columns.map((col, i) => (
            <div
              key={col.title}
              className={s.col}
              ref={(el) => { colRefs.current[i] = el; }}
            >
              <h3 className={s.title}>{col.title}</h3>
              <p className={s.desc}>{col.description}</p>
              <ul className={s.list}>
                {col.items.map((item) => (
                  <li key={item} className={s.item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
