import type { Metadata } from "next";
import Image from "next/image";
import { AdvantagesSection } from "./AdvantagesSection";
import s from "./page.module.scss";

export const metadata: Metadata = {
  title: "Services — 412",
  description: "Brand identity, web design, development and marketing.",
};

const EXPERT_ROLES = [
  "Designers",
  "Developers",
  "SMM",
  "QA Specialists",
  "Designers",
  "Developers",
  "SMM",
  "QA Specialists",
];

export default function ServicesPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={`${s.heroTop} container`}>
          <h1 className={s.heroTitle}>
            Our Services —<br />
            <span >
              Our Solutions for Business
            </span>
          </h1>
          <p className={s.heroSub}>
            Lorem ipsum dolor sit amet consectetur. Nequa ut connectet laoreet
            duis in dignissim in lacus semper. Aliquet velit vel enim consequat
            amet. Tincidunt velit enim tincidunt nulla lobortis sed neque erat
            vulputate duis.
          </p>
        </div>
        <div className={s.heroImgWrap}>
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

      {/* ── PASSION ──────────────────────────────────────────────────── */}
      <section className={s.passion}>
        <div className={`${s.passionInner} container`}>
          <div className={s.passionLeft}>
            <h2 className={s.passionTitle}>Digital is<br />our passion</h2>
          </div>
          <div className={s.passionRight}>
            <p className={s.passionLead}>
              We are excellent at making projects of any type, but we are
              especially good at product design.
            </p>

            <div className={s.listBlock}>
              <p className={s.listLabel}>Our Experience</p>
              <ul className={s.list}>
                <li>E-Commerce</li>
                <li>Finance</li>
                <li>Foodtech</li>
                <li>Startups</li>
              </ul>
            </div>

            <div className={s.listBlock}>
              <p className={s.listLabel}>What Can We Do?</p>
              <ul className={s.list}>
                <li>UI / UX design</li>
                <li>Web design</li>
                <li>Identity</li>
                <li>Research</li>
                <li>Full development</li>
                <li>Mobile application</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERTS ──────────────────────────────────────────────────── */}
      <section className={s.experts}>
        <div className={`container`}>
          <h2 className={s.expertsHeading}>
            Experts from different fields<br />are responsible for the result:
          </h2>
          <div className={s.expertsGrid}>
            {EXPERT_ROLES.map((role, i) => (
              <div key={i} className={s.expertCell}>{role}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────────────────────── */}
      <AdvantagesSection />
    </>
  );
}
