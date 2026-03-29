import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.scss";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "314 Studio — Design",
    template: "%s | 314 Studio",
  },
  description:
    "Freelance design studio focused on brand identity, web design, and print.",
  metadataBase: new URL("https://314.studio"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.className}>
      <body>{children}</body>
    </html>
  );
}
