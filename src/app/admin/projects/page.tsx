import Link from "next/link";
import Image from "next/image";
import { listProjects } from "@/shared/server/database";
import s from "../AdminPages.module.scss";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  const projects = listProjects();

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div className={s.titleGroup}>
          <span className={s.eyebrow}>Portfolio CMS</span>
          <h1 className={s.title}>Projects</h1>
          <p className={s.subtitle}>
            Manage case studies, featured cards, SEO data, and the page builder block
            order. Data is stored in SQLite.
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

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Category</th>
              <th>Blocks</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className={s.projectCell}>
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt=""
                        width={74}
                        height={54}
                        className={s.thumb}
                      />
                    ) : (
                      <span className={s.thumb} aria-hidden="true" />
                    )}
                    <div>
                      <p className={s.strong}>{project.title}</p>
                      <p className={s.muted}>/{project.slug}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={project.status === "published" ? s.status : project.status === "draft" ? s.statusDraft : s.statusReview}>
                    {project.status}
                  </span>
                </td>
                <td>{project.category}</td>
                <td>{project.blocks.length}</td>
                <td className={s.muted}>{project.updatedAt}</td>
                <td>
                  <div className={s.buttonRow}>
                    <Link href={`/admin/projects/${project.id}/edit`} className={s.button}>
                      Edit
                    </Link>
                    <Link href={`/admin/projects/${project.id}/preview`} className={s.buttonMuted}>
                      Preview
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
