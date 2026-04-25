import { LegalPage } from "@/shared/ui/LegalPage";
import { LEGAL_LAST_UPDATED } from "@/shared/constants/legal";

export const metadata = {
  title: "Terms of Use — code 412",
};

const sections = [
  {
    blocks: [
      {
        type: "p" as const,
        content: "By using the Code412 website, you agree to these Terms of Use.",
      },
    ],
  },
  {
    title: "1. No Offer or Contract",
    blocks: [
      {
        type: "p" as const,
        content: "Submitting a request through this website:",
      },
      {
        type: "ul" as const,
        items: [
          "does not create a contractual relationship",
          "does not guarantee a response",
          "does not guarantee that any services will be provided",
        ],
      },
      {
        type: "p" as const,
        content:
          "Any services will be subject to a separate written agreement.",
      },
    ],
  },
  {
    title: "2. No Obligation to Respond",
    blocks: [
      {
        type: "p" as const,
        content:
          "We reserve the right to respond to or ignore any request at our sole discretion, without explanation.",
      },
    ],
  },
  {
    title: "3. User Responsibilities",
    blocks: [
      {
        type: "p" as const,
        content: "By using this website, you agree:",
      },
      {
        type: "ul" as const,
        items: [
          "to provide accurate and truthful information",
          "not to submit unlawful, harmful, or misleading content",
          "not to attempt to interfere with the operation of the website",
        ],
      },
    ],
  },
  {
    title: "4. Use of Submitted Information",
    blocks: [
      {
        type: "p" as const,
        content:
          "By submitting a request, you grant us permission to review and use the information provided solely for the purpose of evaluating your request.",
      },
      {
        type: "p" as const,
        content:
          "Submission of information does not create any obligation of confidentiality or constitute a non-disclosure agreement (NDA).",
      },
    ],
  },
  {
    title: "5. Intellectual Property",
    blocks: [
      {
        type: "p" as const,
        content:
          "All content on this website, including text, design, branding, and materials, is owned by Code412 and may not be copied, reproduced, or used without prior permission.",
      },
    ],
  },
  {
    title: "6. Limitation of Liability",
    blocks: [
      {
        type: "p" as const,
        content:
          "To the maximum extent permitted by law, Code412 shall not be liable for:",
      },
      {
        type: "ul" as const,
        items: [
          "any indirect, incidental, or consequential damages",
          "loss of business, revenue, or data",
          "any decisions made based on the information provided on this website",
        ],
      },
    ],
  },
  {
    title: "7. Website Availability",
    blocks: [
      {
        type: "p" as const,
        content:
          "We do not guarantee that the website will be available at all times or free from errors.",
      },
    ],
  },
  {
    title: "8. Third-Party Services",
    blocks: [
      {
        type: "p" as const,
        content:
          "We may use third-party tools or services on this website. We are not responsible for their functionality or behavior.",
      },
    ],
  },
  {
    title: "9. Governing Law",
    blocks: [
      {
        type: "p" as const,
        content:
          "These Terms of Use are governed by the laws of Estonia.",
      },
    ],
  },
  {
    title: "10. Changes",
    blocks: [
      {
        type: "p" as const,
        content:
          "We may update these Terms at any time. Continued use of the website constitutes acceptance of the updated Terms.",
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
            If you have any questions about these Terms, you can contact us at:{" "}
            <a href="mailto:info@code412.com">info@code412.com</a>
          </>
        ),
      },
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
