export type AdminProjectStatus = "draft" | "published" | "review";

export type AdminTextBlock = {
  id: string;
  type: "text";
  title: string;
  heading: string;
  layout: "default" | "split";
  paragraphs: string[];
  hidden?: boolean;
};

export type AdminWideImageBlock = {
  id: string;
  type: "wide";
  title: string;
  image: string;
  fullWidth: boolean;
  objectFit: "cover" | "contain";
  background: string;
  hidden?: boolean;
};

export type AdminGalleryBlock = {
  id: string;
  type: "gallery";
  title: string;
  columns: 2 | 3;
  images: string[];
  hidden?: boolean;
};

export type AdminDarkBlock = {
  id: string;
  type: "dark";
  title: string;
  heading: string;
  images: string[];
  hidden?: boolean;
};

export type AdminProjectBlock =
  | AdminTextBlock
  | AdminWideImageBlock
  | AdminGalleryBlock
  | AdminDarkBlock;

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  status: AdminProjectStatus;
  category: string;
  year: number;
  client: string;
  date: string;
  description: string;
  projectUrl: string;
  coverImage: string;
  featured: boolean;
  tags: string[];
  services: string[];
  updatedAt: string;
  blocks: AdminProjectBlock[];
};

export type AdminRequestStatus = "new" | "inProgress" | "closed";

export type AdminRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  source: string;
  status: AdminRequestStatus;
  createdAt: string;
};

export const adminProjects: AdminProject[] = [
  {
    id: "prj-mh-padel",
    slug: "mh-padel-club",
    title: "MH Padel Club",
    status: "published",
    category: "Website",
    year: 2024,
    client: "MH Padel Club",
    date: "05 Mar 2026",
    description:
      "Full-stack website for a premium padel club with booking system and brand identity.",
    projectUrl: "https://mhpadelclub.com",
    coverImage: "/works/mh-padel-club/club-interior.jpg",
    featured: true,
    tags: ["Web Design", "Full Stack Development", "Brand Design"],
    services: ["Logo Design", "Web Design", "UI / UX Design", "Marketing"],
    updatedAt: "26 Apr 2026, 12:18",
    blocks: [
      {
        id: "block-context",
        type: "text",
        title: "Context",
        heading: "Context",
        layout: "split",
        paragraphs: [
          "MH Padel is a premium padel club and lifestyle brand focused on combining sport, wellness, and community within a refined club environment.",
          "The project positions padel as a contemporary social ritual, with design decisions built around energy, precision, and hospitality.",
        ],
      },
      {
        id: "block-interior",
        type: "wide",
        title: "Club interior",
        image: "/works/mh-padel-club/club-interior.jpg",
        fullWidth: false,
        objectFit: "cover",
        background: "#f0f0f0",
      },
      {
        id: "block-logo",
        type: "text",
        title: "Logo Description",
        heading: "Logo Description",
        layout: "split",
        paragraphs: [
          "The logo combines classical symbolism with contemporary minimalism, expressing the brand identity through a balanced and recognizable emblem.",
          "The restrained monochrome palette enhances elegance, clarity, and timeless character across physical and digital touchpoints.",
        ],
      },
      {
        id: "block-gallery",
        type: "gallery",
        title: "Website mockups",
        columns: 2,
        images: [
          "/works/mh-padel-club/mockup-laptops.jpg",
          "/works/mh-padel-club/mockup-phone.jpg",
          "/works/mh-padel-club/mockup-laptop-pool.jpg",
          "/works/mh-padel-club/mockup-laptop-dark.jpg",
        ],
      },
    ],
  },
  {
    id: "prj-gpu-service",
    slug: "gpu-service",
    title: "GPU Service",
    status: "draft",
    category: "Turnkey Website",
    year: 2024,
    client: "Mike Stevens",
    date: "20 Feb 2026",
    description: "Turnkey e-commerce website for a GPU repair and sales service.",
    projectUrl: "",
    coverImage: "/bottomimage.jpg",
    featured: true,
    tags: ["Website", "E-commerce"],
    services: ["Web Design", "E-commerce", "Full Stack Development"],
    updatedAt: "26 Apr 2026, 09:40",
    blocks: [
      {
        id: "block-about",
        type: "text",
        title: "About project",
        heading: "About project",
        layout: "default",
        paragraphs: [
          "A clean commerce experience with a strong product structure, repair request flow, and fast customer navigation.",
        ],
      },
      {
        id: "block-wide",
        type: "wide",
        title: "Product hero",
        image: "/bottomimage.jpg",
        fullWidth: false,
        objectFit: "cover",
        background: "#f5f5f5",
      },
    ],
  },
  {
    id: "prj-nova-brand",
    slug: "nova-brand",
    title: "Nova Brand",
    status: "review",
    category: "Branding",
    year: 2024,
    client: "Sara Bell",
    date: "02 Mar 2026",
    description: "Brand identity and visual language for a luxury lifestyle label.",
    projectUrl: "",
    coverImage: "/topimage.jpg",
    featured: false,
    tags: ["Branding", "Logo & Identity"],
    services: ["Logo Design", "Branding", "Visual Identity", "Typography"],
    updatedAt: "25 Apr 2026, 18:04",
    blocks: [
      {
        id: "block-brand",
        type: "dark",
        title: "Brand assets",
        heading: "Visual system",
        images: ["/topimage.jpg", "/backgrounImage.png"],
      },
    ],
  },
];

export const adminRequests: AdminRequest[] = [
  {
    id: "req-1042",
    name: "Alex Carter",
    phone: "+375 29 104 42 12",
    email: "alex@northline.co",
    message:
      "We need a brand identity and a landing page for a new digital product. Launch target is late May.",
    consent: true,
    source: "/contact",
    status: "new",
    createdAt: "26 Apr 2026, 13:22",
  },
  {
    id: "req-1041",
    name: "Nina Black",
    phone: "+371 24 880 410",
    email: "nina@printwave.lv",
    message:
      "Looking for a redesign of an editorial website with a lightweight publishing workflow.",
    consent: true,
    source: "Contact drawer",
    status: "inProgress",
    createdAt: "26 Apr 2026, 10:15",
  },
  {
    id: "req-1040",
    name: "Daniel Frost",
    phone: "+44 7700 900 210",
    email: "daniel@saasfield.io",
    message:
      "Can you estimate a dashboard UI project with design system and front-end implementation?",
    consent: true,
    source: "/contact",
    status: "closed",
    createdAt: "25 Apr 2026, 17:48",
  },
];

export const projectCategories = [
  "Branding",
  "Website",
  "Interface",
  "Graphic Design",
  "Application",
  "Marketing",
  "Logo & Identity",
  "Turnkey Website",
];

export function getAdminProject(id: string) {
  return adminProjects.find((project) => project.id === id) ?? adminProjects[0];
}

export function createBlankAdminProject(): AdminProject {
  return {
    id: "new-project",
    slug: "",
    title: "",
    status: "draft",
    category: "",
    year: 2026,
    client: "",
    date: "",
    description: "",
    projectUrl: "",
    coverImage: "",
    featured: false,
    tags: [],
    services: [],
    updatedAt: "Draft",
    blocks: [],
  };
}
