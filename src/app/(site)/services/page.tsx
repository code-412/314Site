import type { Metadata } from "next";
import { AdvantagesSection } from "./AdvantagesSection";
import { AnimatedHero, AnimatedPassion } from "./AnimatedSections";
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
      <AnimatedHero />
      <AnimatedPassion />

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
