"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { works } from "@/shared/constants/works";
import s from "./Works.module.scss";

const slides = works.filter((w) => w.featured);

type FlipState = { from: number; to: number; dir: "down" | "up" } | null;

export function Works() {
  const [cur, setCur]         = useState(0);
  const [flip, setFlip]       = useState<FlipState>(null);

  const busyRef  = useRef(false);
  const curRef   = useRef(0);
  const hoverRef = useRef(false);
  const accRef   = useRef(0);
  const wrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || slides.length < 2) return;

    const go = (dir: "down" | "up") => {
      if (busyRef.current) return;
      busyRef.current = true;
      const to = dir === "down"
        ? (curRef.current + 1) % slides.length
        : (curRef.current - 1 + slides.length) % slides.length;

      setFlip({ from: curRef.current, to, dir });

      setTimeout(() => {
        curRef.current = to;
        setCur(to);
        setFlip(null);
        busyRef.current = false;
        accRef.current  = 0;
      }, 680);
    };

    const onWheel = (e: WheelEvent) => {
      if (!hoverRef.current) return;
      e.preventDefault();
      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= 60) {
        go(accRef.current > 0 ? "down" : "up");
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const shown = flip ? slides[flip.from] : slides[cur];
  const next  = flip ? slides[flip.to]   : null;

  return (
    <section className={s.works} id="works">
      <div className="container">
        <h2 className={s.heading}>OUR WORKS</h2>

        <div
          className={s.cardWrap}
          ref={wrapRef}
          onMouseEnter={() => { hoverRef.current = true; }}
          onMouseLeave={() => { hoverRef.current = false; accRef.current = 0; }}
        >
          <div className={`${s.scene}${flip ? ` ${s.scenePulse}` : ""}`}>
            {!flip && (
              <div className={s.face}>
                <img src={slides[cur].image} alt={slides[cur].title} className={s.cardBg} />
                <div className={s.cardOverlay} />
              </div>
            )}
            {flip && (
              <>
                <div className={`${s.face} ${flip.dir === "down" ? s.faceExitDown : s.faceExitUp}`}>
                  <img src={slides[flip.from].image} alt="" className={s.cardBg} />
                  <div className={s.cardOverlay} />
                </div>
                <div className={`${s.face} ${flip.dir === "down" ? s.faceEnterDown : s.faceEnterUp}`}>
                  <img src={slides[flip.to].image} alt="" className={s.cardBg} />
                  <div className={s.cardOverlay} />
                </div>
              </>
            )}
          </div>

          <div className={`${s.titleBlock} ${flip ? (flip.dir === "down" ? s.textExitDown : s.textExitUp) : ""}`}>
            <h3 className={s.cardTitle}>
              {shown.category} for<br />{shown.title}
            </h3>
            <div className={s.tagsWrap}>
              {shown.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}
            </div>
          </div>

          {flip && next && (
            <div className={`${s.titleBlock} ${flip.dir === "down" ? s.textEnterDown : s.textEnterUp}`}>
              <h3 className={s.cardTitle}>
                {next.category} for<br />{next.title}
              </h3>
              <div className={s.tagsWrap}>
                {next.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className={s.exploreWrap}>
          <Link href="/works" className={s.exploreBtn}>
            <span>Explore More Projects &lt;/&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
