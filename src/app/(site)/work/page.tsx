"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { works, CATEGORIES, type Category } from "@/shared/constants/works";
import styles from "./page.module.scss";

const colClasses = [styles["col--1"], styles["col--2"], styles["col--3"]];

export default function WorkPage() {
  const [active, setActive] = useState<Category>("All works");

  const filtered =
    active === "All works"
      ? works
      : works.filter((w) => w.category === active);

  const cols = [
    filtered.filter((_, i) => i % 3 === 0),
    filtered.filter((_, i) => i % 3 === 1),
    filtered.filter((_, i) => i % 3 === 2),
  ];

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

        <div className={styles.grid}>
          {cols.map((col, ci) => (
            <div key={ci} className={`${styles.col} ${colClasses[ci]}`}>
              {col.map((work) => (
                <Link key={work.slug} href={`/work/${work.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
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
