import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

const roobert = localFont({
  src: "../../public/fonts/roobert-font-family/RoobertTRIALVF-BF67243fd545701.ttf",
  display: "swap",
  variable: "--font-roobert",
});

export const metadata: Metadata = {
  title: {
    default: "Code 412",
    template: "%s | 412",
  },
  description:
    "Freelance design studio focused on brand identity, web design, and print.",
  metadataBase: new URL("https://412.studio"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roobert.className}>
      <body>{children}</body>
    </html>
  );
}
