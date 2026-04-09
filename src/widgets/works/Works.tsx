"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { works } from "@/shared/constants/works";
import s from "./Works.module.scss";

const slides = works.filter((w) => w.featured);

type Dir = "down" | "up" | "left" | "right";
type FlipState = { from: number; to: number; dir: Dir } | null;

export function Works() {
  const [cur, setCur]   = useState(0);
  const [flip, setFlip] = useState<FlipState>(null);
  const [mobile, setMobile] = useState(false);

  const busyRef  = useRef(false);
  const curRef   = useRef(0);
  const hoverRef = useRef(false);
  const accRef   = useRef(0);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const touchX   = useRef(0);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const go = (dir: Dir) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const to = (dir === "down" || dir === "left")
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || slides.length < 2 || mobile) return;

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
  }, [mobile]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || slides.length < 2 || !mobile) return;

    const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dx = touchX.current - e.changedTouches[0].clientX;
      if (Math.abs(dx) < 40) return;
      go(dx > 0 ? "left" : "right");
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, [mobile]);

  const shown = flip ? slides[flip.from] : slides[cur];
  const next  = flip ? slides[flip.to]   : null;

  const exitClass  = (dir: Dir) => dir === "down" ? s.faceExitDown  : dir === "up" ? s.faceExitUp  : dir === "left" ? s.faceExitLeft  : s.faceExitRight;
  const enterClass = (dir: Dir) => dir === "down" ? s.faceEnterDown : dir === "up" ? s.faceEnterUp : dir === "left" ? s.faceEnterLeft : s.faceEnterRight;
  const textExitClass  = (dir: Dir) => dir === "down" ? s.textExitDown  : dir === "up" ? s.textExitUp  : dir === "left" ? s.textExitLeft  : s.textExitRight;
  const textEnterClass = (dir: Dir) => dir === "down" ? s.textEnterDown : dir === "up" ? s.textEnterUp : dir === "left" ? s.textEnterLeft : s.textEnterRight;

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
                <div className={`${s.face} ${exitClass(flip.dir)}`}>
                  <img src={slides[flip.from].image} alt="" className={s.cardBg} />
                  <div className={s.cardOverlay} />
                </div>
                <div className={`${s.face} ${enterClass(flip.dir)}`}>
                  <img src={slides[flip.to].image} alt="" className={s.cardBg} />
                  <div className={s.cardOverlay} />
                </div>
              </>
            )}
          </div>

          <div className={`${s.titleBlock} ${flip ? textExitClass(flip.dir) : ""}`}>
            <h3 className={s.cardTitle}>
              {shown.category} for<br />{shown.title}
            </h3>
            <div className={s.tagsWrap}>
              {shown.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}
            </div>
          </div>

          {flip && next && (
            <div className={`${s.titleBlock} ${textEnterClass(flip.dir)}`}>
              <h3 className={s.cardTitle}>
                {next.category} for<br />{next.title}
              </h3>
              <div className={s.tagsWrap}>
                {next.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}
              </div>
            </div>
          )}
        </div>

        {mobile && (
          <div className={s.progressBar}>
            <div
              className={s.progressFill}
              style={{ width: `${((cur + 1) / slides.length) * 100}%` }}
            />
          </div>
        )}

        <div className={s.exploreWrap}>
          <Link href="/works" className={s.exploreBtn}>
            <span>Explore More Projects &lt;/&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
