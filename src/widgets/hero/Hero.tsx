"use client";

import { useEffect, useRef } from "react";
import s from "./Hero.module.scss";

export function Hero() {
  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (img1Ref.current) img1Ref.current.style.transform = `translateY(${y * 0.15}px)`;
        if (img2Ref.current) img2Ref.current.style.transform = `translateY(${y * 0.10}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className={s.hero}>
      <div className={`${s.inner} container`}>
        <h1 className={s.heading}>
          <span className={s.row}>
            <span className={s.pre}>YO</span>
            <span className={s.slot} data-ch="U" />
            <span className={s.letterR}>R</span>
            <span className={s.post}>&nbsp;ViSiON</span>
          </span>

          <span className={s.row}>
            <span className={`${s.pre} ${s["pre--indent"]}`}>O</span>
            <span className={s.slot} data-ch="U" />
            <span className={s.slot} data-ch="R" />
            <span className={s.post}>&nbsp;CREATiON</span>
          </span>

          <span className={s.row}>
            <span className={`${s.pre} ${s["pre--indent"]}`}>P</span>
            <span className={s.letterU}>U</span>
            <span className={s.slot} data-ch="R" />
            <span className={s.post}>E&nbsp;MAGiC</span>
          </span>
        </h1>

        <div className={s.img2Wrap}>
          <img ref={img2Ref} src="/bottomimage.jpg" alt="" className={s.img2} />
        </div>

        <div className={s.img1Wrap}>
          <img ref={img1Ref} src="/topimage.jpg" alt="" className={s.img1} />
        </div>

        <p className={s.description}>
          Lorem ipsum dolor sit amet consectetur. Magna offerunt varius aenean
          dignissim eget ut et arcu felis. Parturient curabitur ipsum dolor a
          augue nunc vulputate. Fermentum sed ut et pellentesque parturient
          faucibus feugiat.
        </p>
      </div>
    </section>
  );
}
