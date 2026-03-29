"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Quote.module.scss";

const FULL_TEXT =
  "Lorem ipsum dolor sit amet consectetur. Facilisi fusce gravida metus orci ac cursus varius. Eleifend aliquam commodo blandit egestas rhoncus. Pulvinar volutpat tincidunt morbi malesuada nisl. Integer tristique lorem quisque massa. Ac suspendisse elementum laoreet risus a id magna sagittis cras.";

const SPEED = 15;

export function Quote() {
  const [displayed, setDisplayed] = useState("");
  const [started,   setStarted]   = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i >= FULL_TEXT.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, SPEED);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started]);

  return (
    <section className={s.quote} ref={sectionRef}>
      <div className={`${s.inner} container`}>
        <p className={s.text}>
          {displayed}
          {displayed.length < FULL_TEXT.length && (
            <span className={s.cursor}>|</span>
          )}
        </p>
      </div>
    </section>
  );
}
