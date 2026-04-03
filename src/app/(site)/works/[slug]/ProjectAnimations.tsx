"use client";

import { useEffect, useRef } from "react";
import s from "./ProjectAnimations.module.scss";

export function ProjectAnimations() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroBg    = document.querySelector<HTMLElement>("[data-hero-bg] img");
    const heroText  = document.querySelector<HTMLElement>("[data-hero-text]");
    const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]");
    const reveals   = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const raf = { id: 0 };

    const onScroll = () => {
      cancelAnimationFrame(raf.id);
      raf.id = requestAnimationFrame(() => {
        const sy  = window.scrollY;
        const vh  = window.innerHeight;
        const doc = document.documentElement.scrollHeight - vh;

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${Math.min(1, sy / doc)})`;
        }

        if (heroBg) {
          heroBg.style.transform = `scale(1.18) translateY(${sy * 0.28}px)`;
        }

        if (heroText) {
          const opacity = Math.max(0, 1 - sy / (vh * 0.7));
          heroText.style.opacity   = String(opacity);
          heroText.style.transform = `translateY(${sy * 0.12}px)`;
        }

        parallaxEls.forEach((el) => {
          const factor = Number(el.dataset.parallax ?? 0.08);
          const rect   = el.getBoundingClientRect();
          const offset = (rect.top + rect.height / 2 - vh / 2) * factor;
          el.style.transform = `translateY(${offset}px)`;
        });
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -56px 0px" }
    );

    reveals.forEach((el) => io.observe(el));

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.id);
      io.disconnect();
    };
  }, []);

  return <div ref={progressRef} className={s.progress} />;
}
