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
};

export type ContactFormData = {
  name: string;
  email: string;
  budget: string;
  message: string;
};
