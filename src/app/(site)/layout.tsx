import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ContactDrawer } from "@/widgets/contact-drawer";
import { ContactDrawerProvider } from "@/shared/lib/contact-drawer-context";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContactDrawerProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <ContactDrawer />
    </ContactDrawerProvider>
  );
}
