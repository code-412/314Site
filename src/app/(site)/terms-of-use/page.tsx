import { LegalPage } from "@/shared/ui/LegalPage";

export const metadata = {
  title: "Terms of Use — code 412",
};

const sections = [
  {
    blocks: [
      {
        type: "p" as const,
        content:
          "By accessing and using this website, you accept and agree to be bound by the following terms and conditions. If you do not agree to these terms, please do not use this website.",
      },
    ],
  },
  {
    title: "1. Use of the Website",
    blocks: [
      {
        type: "p" as const,
        content:
          "This website is provided for informational purposes. You agree to use it only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the site.",
      },
      {
        type: "p" as const,
        content:
          "Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.",
      },
    ],
  },
  {
    title: "2. Intellectual Property",
    blocks: [
      {
        type: "p" as const,
        content:
          "All content on this website, including but not limited to text, graphics, logos, and images, is the property of code 412 and is protected by applicable intellectual property laws.",
      },
      {
        type: "p" as const,
        content:
          "You may not reproduce, distribute, or create derivative works without our prior written consent.",
      },
    ],
  },
  {
    title: "3. Disclaimers",
    blocks: [
      {
        type: "p" as const,
        content:
          'The content on this website is provided on an "as is" basis. code 412 makes no warranties, express or implied, regarding the accuracy, completeness, or fitness for a particular purpose of the content.',
      },
      {
        type: "p" as const,
        content:
          "We reserve the right to modify or discontinue the website at any time without notice.",
      },
    ],
  },
  {
    title: "4. Limitation of Liability",
    blocks: [
      {
        type: "p" as const,
        content:
          "code 412 shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on any information provided herein.",
      },
    ],
  },
  {
    title: "5. External Links",
    blocks: [
      {
        type: "p" as const,
        content:
          "This website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them.",
      },
    ],
  },
  {
    title: "6. Changes to These Terms",
    blocks: [
      {
        type: "p" as const,
        content:
          "We may revise these terms at any time. By continuing to use this website after any changes, you agree to be bound by the revised terms.",
      },
    ],
  },
  {
    title: "7. Contact",
    blocks: [
      {
        type: "p" as const,
        content: (
          <>
            For any questions regarding these Terms of Use, please contact us at{" "}
            <a href="mailto:info@code412.com">info@code412.com</a>.
          </>
        ),
      },
    ],
  },
];

export default function TermsOfUsePage() {
  return <LegalPage title="Terms of Use" sections={sections} />;
}
