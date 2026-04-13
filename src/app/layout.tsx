import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SmoothScroll } from "@/shared/providers/SmoothScroll";
import "./globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
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
    <html lang="en" className={poppins.className}>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
