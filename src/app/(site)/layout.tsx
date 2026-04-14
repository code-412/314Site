import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ContactDrawer } from "@/widgets/contact-drawer";
import { ContactDrawerProvider } from "@/shared/lib/contact-drawer-context";
import { NotificationProvider } from "@/shared/lib/notification-context";
import { NotificationContainer } from "@/shared/ui/Notification";
import { CookieBanner } from "@/shared/ui/CookieBanner";
import { DebugNotifications } from "@/shared/ui/DebugNotifications";

const debug = process.env.NEXT_PUBLIC_DEBUG === "true";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <ContactDrawerProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <ContactDrawer />
        <NotificationContainer />
        <CookieBanner />
        {debug && <DebugNotifications />}
      </ContactDrawerProvider>
    </NotificationProvider>
  );
}
