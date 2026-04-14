"use client";

import { useEffect, useRef, useState } from "react";
import s from "./page.module.scss";
import { getLenis } from "@/shared/providers/SmoothScroll";

const EXPERTS = [
  "Designers",
  "Developers",
  "SMM",
  "QA Specialists",
  "Designers",
  "Developers",
  "SMM",
  "QA Specialists",
];

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const EASE_SMOOTH = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_CELL   = "cubic-bezier(0.34, 1.4, 0.64, 1)";
const STAGGER     = 65;
const CELL_DUR    = 480;

function setCellHidden(cell: HTMLElement) {
  cell.style.transition  = "none";
  cell.style.opacity     = "0";
  cell.style.filter      = "blur(6px)";
  cell.style.transform   = "translateY(-10px)";
}

function setCellVisible(cell: HTMLElement, delay: number) {
  cell.style.transition  = `opacity ${CELL_DUR}ms ${EASE_CELL} ${delay}ms, filter ${CELL_DUR}ms ${EASE_CELL} ${delay}ms, transform ${CELL_DUR}ms ${EASE_CELL} ${delay}ms`;
  cell.style.opacity     = "1";
  cell.style.filter      = "blur(0px)";
  cell.style.transform   = "translateY(0)";
}

export function ExpertsSection() {
  const [cols, setCols] = useState(4);
  const sectionRef    = useRef<HTMLElement>(null);
  const wrapRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const revealedRef   = useRef(1);
  const animatingRef  = useRef(false);
  const totalRowsRef  = useRef(1);
  const lockedRef     = useRef(false);

  useEffect(() => {
    const update = () => setCols(window.innerWidth <= 900 ? 2 : 4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rows = chunk(EXPERTS, cols);
  useEffect(() => { totalRowsRef.current = rows.length; });

  useEffect(() => {
    revealedRef.current = 1;
    lockedRef.current   = false;

    wrapRefs.current.forEach((wrap, i) => {
      if (!wrap) return;
      wrap.style.transition = "none";
      if (i === 0) {
        wrap.style.height   = "auto";
        wrap.style.overflow = "visible";
      } else {
        wrap.style.height   = "0px";
        wrap.style.overflow = "hidden";
      }
      void wrap.offsetHeight;
      if (i > 0) wrap.style.transition = `height 0.55s ${EASE_SMOOTH}`;
    });

    innerRefs.current.forEach((inner, i) => {
      if (!inner) return;
      inner.style.transition = "none";
      inner.style.transform  = i === 0 ? "translateY(0)" : "translateY(-100%)";
      void inner.offsetHeight;
      if (i > 0) inner.style.transition = `transform 0.55s ${EASE_SMOOTH}`;

      const cells = Array.from(inner.children) as HTMLElement[];
      if (i === 0) {
        cells.forEach((c) => { c.style.opacity = "1"; c.style.filter = ""; c.style.transform = ""; });
      } else {
        cells.forEach(setCellHidden);
      }
    });
  }, [cols]);

  const unlock = () => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    getLenis()?.start();
  };

  const revealNext = () => {
    if (animatingRef.current) return;
    const next = revealedRef.current;
    if (next >= totalRowsRef.current) {
      // все строки показаны — разблокируем скролл
      unlock();
      return;
    }

    const wrap  = wrapRefs.current[next];
    const inner = innerRefs.current[next];
    if (!wrap || !inner) return;

    animatingRef.current = true;

    const h = inner.offsetHeight;
    wrap.style.height     = h + "px";
    inner.style.transform = "translateY(0)";

    const cells = Array.from(inner.children) as HTMLElement[];
    cells.forEach((cell, i) => {
      void (cell as HTMLElement).offsetHeight;
      setTimeout(() => setCellVisible(cell as HTMLElement, 0), 80 + i * STAGGER);
    });

    revealedRef.current = next + 1;
    const totalDuration = 80 + (cells.length - 1) * STAGGER + CELL_DUR + 60;
    setTimeout(() => {
      animatingRef.current = false;
      // если все открыты — разблокируем
      if (revealedRef.current >= totalRowsRef.current) {
        unlock();
      }
    }, totalDuration);
  };

  useEffect(() => {
    // Следим за позицией секции: как только первая строка поднимается выше 60% вьюпорта — стопим Lenis
    const onScroll = () => {
      const firstWrap = wrapRefs.current[0];
      if (!firstWrap) return;
      const rect = firstWrap.getBoundingClientRect();
      const inZone = rect.top < window.innerHeight * 0.6 && revealedRef.current < totalRowsRef.current;

      if (inZone && !lockedRef.current) {
        lockedRef.current = true;
        getLenis()?.stop();
      } else if (!inZone && lockedRef.current && revealedRef.current >= totalRowsRef.current) {
        unlock();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Lenis сам двигает scroll, но emit-ит нативный scroll — это поймаем
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      revealNext();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        revealNext();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      const delta = touchStartY - e.touches[0].clientY;
      if (delta < 25) return;
      e.preventDefault();
      touchStartY = e.touches[0].clientY;
      revealNext();
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("keydown",    onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("keydown",    onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.experts}>
      <div className="container">
        <h2 className={s.expertsHeading}>
          Experts from different fields<br />are responsible for the result:
        </h2>
        <div className={s.expertRows} key={cols}>
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              ref={(el) => { wrapRefs.current[rowIdx] = el; }}
              className={s.rowWrap}
            >
              <div
                ref={(el) => { innerRefs.current[rowIdx] = el; }}
                className={s.rowInner}
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              >
                {row.map((item, i) => (
                  <div key={i} className={s.expertCell}>{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
