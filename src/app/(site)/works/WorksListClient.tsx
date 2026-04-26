"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, type Category } from "@/shared/constants/works";
import { type Work } from "@/shared/types";
import styles from "./page.module.scss";

const INITIAL_Y   = [0, 60, 120];
const RESTAGGER   = [80, 0, -80];
const EASE_IN_PX  = 500;   // длина входа (лесенка при появлении)
const EASE_OUT_PX = 1800;  // длина расхождения (пока скроллишь)

function getNumCols() {
  if (typeof window === "undefined") return 3;
  return window.innerWidth <= 1024 && window.innerWidth > 540 ? 2 : 3;
}

export function WorksListClient({ works }: { works: Work[] }) {
  const [active,  setActive]  = useState<Category>("All works");
  const [numCols, setNumCols] = useState(3);

  const gridRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const update = () => setNumCols(getNumCols());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const colRefs = [col1Ref, col2Ref, col3Ref];

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const gridTop = grid.getBoundingClientRect().top;
        const vh      = window.innerHeight;
        const pivot   = vh * 0.15;

        colRefs.forEach((ref, i) => {
          if (!ref.current) return;
          let y: number;

          if (gridTop > pivot) {
            const t = Math.max(0, 1 - (gridTop - pivot) / EASE_IN_PX);
            y = INITIAL_Y[i] * (1 - t);
          } else {
            const past = pivot - gridTop;
            const t    = Math.min(1, past / EASE_OUT_PX);
            y = RESTAGGER[i] * t;
          }

          ref.current.style.transform = `translateY(${y}px)`;
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

  const filtered =
    active === "All works"
      ? works
      : works.filter((w) => w.category === active);

  const cols = numCols === 2
    ? [
        filtered.filter((_, i) => i % 2 === 0),
        filtered.filter((_, i) => i % 2 === 1),
      ]
    : [
        filtered.filter((_, i) => i % 3 === 0),
        filtered.filter((_, i) => i % 3 === 1),
        filtered.filter((_, i) => i % 3 === 2),
      ];

  const colRefs = [col1Ref, col2Ref, col3Ref];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.intro}>
          <h1 className={styles.heading}>WORKS</h1>

          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn}${active === cat ? ` ${styles["filterBtn--active"]}` : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className={styles.grid} data-cols={numCols}>
          {cols.map((col, ci) => (
            <div key={ci} ref={colRefs[ci]} className={styles.col}>
              {col.map((work) => (
                <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h2 className={styles.cardTitle}>{work.title}</h2>
                    <p className={styles.cardCategory}>{work.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
