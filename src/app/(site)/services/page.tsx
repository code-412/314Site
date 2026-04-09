import type { Metadata } from "next";
import { AdvantagesSection } from "./AdvantagesSection";
import { AnimatedHero, AnimatedPassion } from "./AnimatedSections";
import { ExpertsSection } from "./ExpertsSection";

export const metadata: Metadata = {
  title: "Services — 412",
  description: "Brand identity, web design, development and marketing.",
};

export default function ServicesPage() {
  return (
    <>
      <AnimatedHero />
      <AnimatedPassion />
      <ExpertsSection />
      <AdvantagesSection />
    </>
  );
}
