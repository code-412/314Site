import { LegalPage } from "@/shared/ui/LegalPage";
import { LEGAL_LAST_UPDATED } from "@/shared/constants/legal";

export const metadata = {
  title: "Privacy Policy — code 412",
};

const sections = [
  {
    blocks: [
      {
        type: "p" as const,
        content:
          'This Privacy Policy explains what personal data Code412 ("we", "us", or "our") collects, how we use it, and how we protect it when you use our website or submit a request through our contact form.',
      },
    ],
  },
  {
    title: "1. What Data We Collect",
    blocks: [
      {
        type: "p" as const,
        content:
          "We collect personal data that you voluntarily provide through our contact forms, including:",
      },
      {
        type: "ul" as const,
        items: [
          "Full Name",
          "Phone number",
          "Email address",
          "Project details and any information you choose to share",
        ],
      },
      {
        type: "p" as const,
        content:
          "We may also collect certain technical information automatically, including:",
      },
      {
        type: "ul" as const,
        items: [
          "IP address",
          "Browser type and version",
          "Device information",
          "Usage data",
          "Cookie-related data, where applicable",
        ],
      },
    ],
  },
  {
    title: "2. Cookies",
    blocks: [
      {
        type: "p" as const,
        content:
          "Our website may use cookies and similar technologies to ensure the website functions properly, improve user experience, and analyze website traffic.",
      },
      {
        type: "p" as const,
        content:
          "Some cookies may be strictly necessary for the operation of the website, while others, such as analytics or marketing cookies, may be used only with your consent where required by applicable law.",
      },
      {
        type: "p" as const,
        content:
          "You can manage your cookie preferences through our cookie banner or through your browser settings.",
      },
    ],
  },
  {
    title: "3. How We Use Your Data",
    blocks: [
      {
        type: "p" as const,
        content: "We use your personal data for the following purposes:",
      },
      {
        type: "ul" as const,
        items: [
          "To review and respond to your request",
          "To communicate with you regarding potential services",
          "To improve our website and services",
          "To ensure the security of our website and prevent abuse",
        ],
      },
      {
        type: "p" as const,
        content: "We do not sell your personal data.",
      },
    ],
  },
  {
    title: "4. Legal Basis for Processing (GDPR)",
    blocks: [
      {
        type: "p" as const,
        content:
          "If you are located in the European Economic Area (EEA), we process your personal data based on:",
      },
      {
        type: "ul" as const,
        items: [
          "Your consent (when you submit a request or accept cookies)",
          "Our legitimate interest (to respond to your request and communicate with you about it)",
        ],
      },
    ],
  },
  {
    title: "5. Data Sharing",
    blocks: [
      {
        type: "p" as const,
        content:
          "We may share your personal data with trusted third-party service providers (such as hosting providers, analytics services, or CRM tools) only as necessary to operate our website and manage user requests.",
      },
      {
        type: "p" as const,
        content:
          "These third parties are obligated to process your data only on our behalf and in accordance with applicable data protection laws.",
      },
      {
        type: "p" as const,
        content:
          "We may also disclose your data if required to do so by law or to protect our legal rights.",
      },
    ],
  },
  {
    title: "6. Data Retention",
    blocks: [
      {
        type: "p" as const,
        content:
          "We retain your personal data only for as long as necessary to:",
      },
      {
        type: "ul" as const,
        items: [
          "Respond to your request",
          "Communicate with you regarding potential services",
          "Comply with legal obligations",
        ],
      },
    ],
  },
  {
    title: "7. Your Rights",
    blocks: [
      {
        type: "p" as const,
        content:
          "If you are located in the European Economic Area (EEA), you have the following rights regarding your personal data:",
      },
      {
        type: "ul" as const,
        items: [
          "The right to access your personal data",
          "The right to request correction of inaccurate or incomplete data",
          "The right to request deletion of your personal data",
          "The right to withdraw your consent at any time",
          "The right to object to the processing of your personal data",
        ],
      },
      {
        type: "p" as const,
        content: (
          <>
            To make a request regarding your personal data, please contact us
            at:{" "}
            <a href="mailto:info@code412.com">info@code412.com</a>
          </>
        ),
      },
      {
        type: "p" as const,
        content:
          "We may request verification of your identity before processing your request.",
      },
    ],
  },
  {
    title: "8. Data Security",
    blocks: [
      {
        type: "p" as const,
        content:
          "We take appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
      },
    ],
  },
  {
    title: "9. Third-Party Links",
    blocks: [
      {
        type: "p" as const,
        content:
          "Our website may contain links to third-party websites or services. We are not responsible for the content or privacy practices of those third parties. We encourage you to review their privacy policies before providing any personal data.",
      },
    ],
  },
  {
    title: "10. Changes to This Policy",
    blocks: [
      {
        type: "p" as const,
        content:
          'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.',
      },
    ],
  },
  {
    title: "11. Contact",
    blocks: [
      {
        type: "p" as const,
        content: (
          <>
            If you have any questions about this Privacy Policy or how your
            personal data is handled, you can contact us at:{" "}
            <a href="mailto:info@code412.com">info@code412.com</a>
          </>
        ),
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
