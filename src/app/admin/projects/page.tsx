import Link from "next/link";
import { listProjects } from "@/shared/server/database";
import { ProjectsTable } from "./ProjectsTable";
import s from "../AdminPages.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div className={s.titleGroup}>
          <span className={s.eyebrow}>Portfolio CMS</span>
          <h1 className={s.title}>Projects</h1>
          <p className={s.subtitle}>
            Manage case studies, featured cards, SEO data, and the page builder block
            order. Data is stored in the configured database.
          </p>
        </div>
        <div className={s.buttonRow}>
          <button className={s.buttonMuted}>Import</button>
          <Link href="/admin/projects/new" className={s.buttonDark}>
            New project
          </Link>
        </div>
      </div>

      <div className={s.filters}>
        <button className={s.filter}>All</button>
        <button className={s.filter}>Published</button>
        <button className={s.filter}>Drafts</button>
        <button className={s.filter}>Featured</button>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
