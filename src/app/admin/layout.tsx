import type { Metadata } from "next";
import { AdminShell } from "./AdminShell";

export const metadata: Metadata = {
  title: "Admin | 412",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
