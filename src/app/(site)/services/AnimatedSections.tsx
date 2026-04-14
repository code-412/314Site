"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import s from "./page.module.scss";

function useScrollReveal(selector: string, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = Array.from(container.querySelectorAll<HTMLElement>(`[data-anim]`));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [containerRef, selector]);
}

export function AnimatedHero() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal("", ref);

  return (
    <section ref={ref} className={s.hero}>
      <div className={`${s.heroTop} container`}>
        <h1
          data-anim
          className={`${s.heroTitle} ${s.fadeUp}`}
        >
          Our Services —<br />
          <span>Our Solutions for Business</span>
        </h1>
        <p
          data-anim
          className={`${s.heroSub} ${s.fadeUp} ${s.delay1}`}
        >
          We provide a full range of digital services built around the balance of design and code. Our team combines strategy, brand identity, UX thinking, and engineering precision to create products that are visually refined and technically powerful. From digital interfaces to complex platforms and long-term product support, every solution is built with clear design, clean code, and modern technologies, helping businesses grow and scale in a fast-changing digital landscape.
        </p>
      </div>
      <div
        data-anim
        className={`${s.heroImgWrap} ${s.fadeUp} ${s.delay2}`}
      >
        <Image
          src="/ServiceBackGround.jpg"
          alt="Services background"
          fill
          priority
          className={s.heroImg}
          sizes="100vw"
        />
      </div>
    </section>
  );
}

export function AnimatedPassion() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal("", ref);

  return (
    <section ref={ref} className={s.passion}>
      <div className={`${s.passionInner} container`}>
        <div
          data-anim
          className={`${s.passionLeft} ${s.fadeLeft}`}
        >
          <h2 className={s.passionTitle}>Digital is<br />our passion</h2>
        </div>
        <div
          data-anim
          className={`${s.passionRight} ${s.fadeUp} ${s.delay1}`}
        >
          <p className={s.passionLead}>
            We are excellent at making projects of any type, but we are especially good at product design.
          </p>

          <div className={s.listBlock}>
            <p className={s.listLabel}>Our Experience</p>
            <ul className={s.list}>
              {["E-Commerce","Finance","Foodtech","Startups"].map((item, i) => (
                <li key={item} data-anim className={s.fadeUp} style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={s.listBlock}>
            <p className={s.listLabel}>What Can We Do?</p>
            <ul className={s.list}>
              {["UI / UX design","Web design","Identity","Research","Full development","Mobile application"].map((item, i) => (
                <li key={item} data-anim className={s.fadeUp} style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
