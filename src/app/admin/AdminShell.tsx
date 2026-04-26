"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoIcon } from "@/shared/icons/LogoIcon";
import s from "./AdminShell.module.scss";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/projects/new", label: "New project" },
  { href: "/admin/requests", label: "Requests" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <Link href="/admin" className={s.brand} aria-label="Code 412 admin">
          <LogoIcon />
          <span>Admin</span>
        </Link>

        <nav className={s.nav} aria-label="Admin navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${s.navLink}${isActive(pathname, item.href) ? ` ${s.navLinkActive}` : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={s.sidebarFoot}>
          <span className={s.eyebrow}>Mock mode</span>
          <p>Front-end prototype. Data is local and will be replaced by SQLite API.</p>
        </div>
      </aside>

      <div className={s.workspace}>
        <header className={s.topbar}>
          <div>
            <span className={s.kicker}>Code 412 control room</span>
            <p>Projects, requests, publishing flow</p>
          </div>
          <div className={s.actions}>
            <Link href="/" className={s.ghostLink}>
              View site
            </Link>
            <button type="button" className={s.userButton} onClick={logout} aria-label="Log out">
              AM
            </button>
          </div>
        </header>
        <main className={s.content}>{children}</main>
      </div>
    </div>
  );
}
