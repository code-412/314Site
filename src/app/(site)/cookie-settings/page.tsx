import { LegalPage } from "@/shared/ui/LegalPage";
import Link from "next/link";

export const metadata = {
  title: "Cookie Settings — code 412",
};

const sections = [
  {
    blocks: [
      {
        type: "p" as const,
        content:
          "This page explains how code 412 uses cookies and similar technologies on our website, and how you can manage your preferences.",
      },
    ],
  },
  {
    title: "1. What Are Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.",
      },
    ],
  },
  {
    title: "2. Strictly Necessary Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "These cookies are essential for the website to function properly. They enable core functionality such as security and accessibility. You cannot opt out of these cookies.",
      },
    ],
  },
  {
    title: "3. Analytics Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "We use analytics cookies to understand how visitors interact with our website. This helps us improve the site's structure, content, and performance. All data collected is aggregated and anonymous.",
      },
    ],
  },
  {
    title: "4. Marketing Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user. We do not sell this data to third parties.",
      },
    ],
  },
  {
    title: "5. Functional Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "These cookies allow the website to remember choices you make and provide enhanced, more personal features.",
      },
    ],
  },
  {
    title: "6. Managing Your Preferences",
    blocks: [
      {
        type: "p" as const,
        content: (
          <>
            You can update your cookie preferences at any time using the cookie
            settings panel available on our website. You can also control cookies
            through your browser settings — most browsers allow you to refuse or
            delete cookies.
          </>
        ),
      },
      {
        type: "p" as const,
        content: (
          <>
            For more information about how we handle your personal data, please
            see our <Link href="/privacy-policy">Privacy Policy</Link>.
          </>
        ),
      },
    ],
  },
];

export default function CookieSettingsPage() {
  return <LegalPage title="Cookie Settings" sections={sections} />;
}
