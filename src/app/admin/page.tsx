import Link from "next/link";
import { listProjects, listRequests } from "@/shared/server/database";
import s from "./AdminPages.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const projects = await listProjects();
  const requests = await listRequests();
  const published = projects.filter((project) => project.status === "published").length;
  const drafts = projects.filter((project) => project.status === "draft").length;
  const newRequests = requests.filter((request) => request.status === "new").length;

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div>
          <span className={s.eyebrow}>Live admin</span>
          <h1 className={s.heroTitle}>Build cases without touching code.</h1>
        </div>
        <p className={s.heroText}>
          Projects, page-builder blocks, contact requests, uploads, and auth are now
          backed by the configured database and upload storage.
        </p>
      </section>

      <section className={s.statsGrid} aria-label="Admin stats">
        <div className={s.stat}>
          <span className={s.statValue}>{projects.length}</span>
          <span className={s.statLabel}>Projects in workspace</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{published}</span>
          <span className={s.statLabel}>Published cases</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{drafts}</span>
          <span className={s.statLabel}>Draft projects</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{newRequests}</span>
          <span className={s.statLabel}>New contact requests</span>
        </div>
      </section>

      <section className={s.gridTwo}>
        <div className={s.panel}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>Recent project activity</h2>
            <Link href="/admin/projects/new" className={s.buttonDark}>
              New project
            </Link>
          </div>
          <div className={s.timeline}>
            {projects.map((project) => (
              <div key={project.id} className={s.timelineItem}>
                <span className={s.muted}>{project.updatedAt}</span>
                <div>
                  <p className={s.strong}>{project.title}</p>
                  <p className={s.muted}>{project.category} / {project.blocks.length} blocks</p>
                </div>
                <span className={project.status === "published" ? s.status : project.status === "draft" ? s.statusDraft : s.statusReview}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>Request inbox</h2>
            <Link href="/admin/requests" className={s.button}>
              Open
            </Link>
          </div>
          <div className={s.timeline}>
            {requests.slice(0, 3).map((request) => (
              <div key={request.id} className={s.timelineItem}>
                <span className={s.muted}>{request.createdAt}</span>
                <div>
                  <p className={s.strong}>{request.name}</p>
                  <p className={s.muted}>{request.email}</p>
                </div>
                <span className={request.status === "new" ? s.statusNew : request.status === "inProgress" ? s.statusInProgress : s.statusClosed}>
                  {request.status === "inProgress" ? "In progress" : request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
