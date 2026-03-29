import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects in branding, web design, packaging, and motion.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
