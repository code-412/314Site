import type { Service } from "@/shared/types";

export const services: Service[] = [
  {
    id: "branding",
    title: "Brand Identity",
    description: "Logo, typography, colour palette — a complete identity system that holds together across every touchpoint.",
    features: ["Logo design", "Brand guidelines", "Colour & type systems", "Business collateral"],
  },
  {
    id: "web-design",
    title: "Web Design",
    description: "Clean, purposeful interfaces built for real users. From wireframe to pixel-perfect handoff to developers.",
    features: ["UX wireframing", "UI design", "Responsive layouts", "Figma handoff"],
  },
  {
    id: "print",
    title: "Print & Packaging",
    description: "Packaging, posters, editorial — designed to look right on paper and hold up in production.",
    features: ["Packaging design", "Poster & editorial", "Pre-press prep", "Print supervision"],
  },
  {
    id: "motion",
    title: "Motion & Digital",
    description: "Short animated loops, social content, and interactive prototypes that bring the brand to life.",
    features: ["Logo animation", "Social content", "Interactive prototypes", "Motion guidelines"],
  },
];
