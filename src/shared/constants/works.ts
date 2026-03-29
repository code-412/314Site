import type { Work } from "@/shared/types";

export const works: Work[] = [
  {
    slug: "mh-padel-club",
    title: "MH Padel Club",
    category: "Website",
    year: 2024,
    description: "Full-stack website for a padel sports club with booking system and brand identity.",
    tags: ["Web Design", "Full Stack", "Brand Design"],
    image: "/backgrounImage.png",
    featured: true,
  },
  {
    slug: "mobi-scambank",
    title: "Mobi Scambank",
    category: "Marketing",
    year: 2024,
    description: "Marketing campaign and digital presence for a fintech startup.",
    tags: ["Marketing", "Branding"],
    image: "/topimage.jpg",
    featured: true,
  },
  {
    slug: "gpu-service",
    title: "GPU Service",
    category: "Turnkey Website",
    year: 2024,
    description: "Turnkey e-commerce website for a GPU repair and sales service.",
    tags: ["Website", "E-commerce"],
    image: "/bottomimage.jpg",
    featured: true,
  },
  {
    slug: "brand-identity-co",
    title: "Brand Identity Co.",
    category: "Branding",
    year: 2023,
    description: "Complete brand identity system for a design consultancy.",
    tags: ["Branding", "Logo & Identity"],
    image: "/bottomimage.jpg",
    featured: false,
  },
  {
    slug: "interface-lab",
    title: "Interface Lab",
    category: "Interface",
    year: 2023,
    description: "UI/UX design for a SaaS dashboard with complex data visualisation.",
    tags: ["Interface", "UI/UX"],
    image: "/topimage.jpg",
    featured: false,
  },
  {
    slug: "sport-app",
    title: "Sport App",
    category: "Application",
    year: 2023,
    description: "Mobile application for sports event management and team coordination.",
    tags: ["Application", "Mobile"],
    image: "/backgrounImage.png",
    featured: false,
  },
  {
    slug: "logo-studio",
    title: "Logo Studio",
    category: "Logo & Identity",
    year: 2023,
    description: "Logomark and identity system for a creative studio.",
    tags: ["Logo & Identity", "Branding"],
    image: "/topimage.jpg",
    featured: false,
  },
  {
    slug: "graphic-press",
    title: "Graphic Press",
    category: "Graphic Design",
    year: 2023,
    description: "Editorial and print design for an independent magazine.",
    tags: ["Graphic Design", "Print"],
    image: "/bottomimage.jpg",
    featured: false,
  },
  {
    slug: "turnkey-shop",
    title: "Turnkey Shop",
    category: "Turnkey Website",
    year: 2022,
    description: "Ready-to-launch e-commerce solution for a fashion retailer.",
    tags: ["Turnkey Website", "E-commerce"],
    image: "/backgrounImage.png",
    featured: false,
  },
  {
    slug: "padel-arena",
    title: "Padel Arena",
    category: "Website",
    year: 2022,
    description: "Website and booking platform for an indoor padel complex.",
    tags: ["Website", "UI/UX"],
    image: "/backgrounImage.png",
    featured: false,
  },
  {
    slug: "market-wave",
    title: "Market Wave",
    category: "Marketing",
    year: 2022,
    description: "Digital marketing strategy and campaign visuals for a retail brand.",
    tags: ["Marketing", "Graphic Design"],
    image: "/topimage.jpg",
    featured: false,
  },
  {
    slug: "core-interface",
    title: "Core Interface",
    category: "Interface",
    year: 2022,
    description: "Product interface design for a B2B analytics platform.",
    tags: ["Interface", "UI/UX"],
    image: "/bottomimage.jpg",
    featured: false,
  },
];

export const CATEGORIES = [
  "All works",
  "Branding",
  "Website",
  "Interface",
  "Graphic Design",
  "Application",
  "Marketing",
  "Logo & Identity",
  "Turnkey Website",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export function getFeaturedWorks(): Work[] {
  return works.filter((w) => w.featured);
}
