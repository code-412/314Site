export type TextBlock     = { type: 'text';    heading: string; paragraphs: string[]; layout?: 'split' };
export type GalleryBlock  = { type: 'gallery'; images: string[]; columns?: 2 | 3 };
export type WideBlock     = { type: 'wide';    src: string; fullWidth?: boolean; objectFit?: 'cover' | 'contain'; bg?: string };
export type DarkBlock     = { type: 'dark';    images: string[]; heading?: string };
export type ContentBlock  = TextBlock | GalleryBlock | WideBlock | DarkBlock;

export type NavItem = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  features: string[];
};

export type Work = {
  slug: string;
  title: string;
  category: string;
  year: number;
  description: string;
  tags: string[];
  image: string;
  featured: boolean;
  client?: string;
  date?: string;
  services?: string[];
  projectUrl?: string;
  about?: string;
  gallery?: string[];
  approach?: string;
  approachImage?: string;
  blocks?: ContentBlock[];
};

export type ContactFormData = {
  name: string;
  email: string;
  budget: string;
  message: string;
};
