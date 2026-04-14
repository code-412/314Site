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
      "We create brands that are clear, distinctive, and built to grow. From strategy and identity to copywriting and creative direction, every element works together as one system. We transform ideas into structured brand languages that speak consistently, connect with audiences, and shape how people see and remember a company.",
    items: ["IDENTITY", "STRATEGY", "COPYWRITING", "DIRECTION"],
  },
  {
    title: "DEVELOPMENT",
    description:
      "We build reliable digital products with clean architecture and scalable code. From front-end interfaces to powerful back-end systems, every solution is engineered for performance and stability. Our development approach combines modern technologies, thoughtful structure, and code that supports long-term growth.",
    items: ["AI", "FRONT-END", "BACK-END", "SOFTWARE", "WEB", "TELEGRAM"],
  },
  {
    title: "DIGITAL",
    description:
      "We design digital experiences that feel intuitive and visually strong. Through web design, UI/UX systems, and thoughtful user flows, we create products that are easy to navigate and enjoyable to use. The result is digital interfaces that look sharp, work smoothly, and guide users naturally.",
    items: ["WEB DESIGN", "UI/UX DESIGN", "BRAND DESIGN", "USER FLOW"],
  },
];

const COL_STAGGER = 420;

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const colRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          colRefs.current.forEach((col, i) => {
            if (col) setTimeout(() => col.classList.add(s["col--visible"]), i * COL_STAGGER);
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
              <div className={s.divider}>
                <span className={s.dot} />
                <span className={s.line} />
              </div>
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
