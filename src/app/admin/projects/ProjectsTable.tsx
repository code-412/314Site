"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type AdminProject, type AdminProjectStatus } from "@/shared/admin/mock-data";
import s from "../AdminPages.module.scss";

function statusClass(status: AdminProjectStatus) {
  if (status === "published") return s.status;
  if (status === "draft") return s.statusDraft;
  return s.statusReview;
}

export function ProjectsTable({ initialProjects }: { initialProjects: AdminProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const deleteProject = async (project: AdminProject) => {
    const confirmed = window.confirm(`Delete "${project.title || project.slug}" from the database?`);
    if (!confirmed) return;

    setBusyId(project.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch {
      setError("Project was not deleted. Please try again.");
    } finally {
      setBusyId("");
    }
  };

  if (projects.length === 0) {
    return (
      <div className={s.emptyState}>
        <span className={s.eyebrow}>Empty database</span>
        <h2>No projects yet</h2>
        <p>Create the first project and publish it when the page is ready.</p>
        <Link href="/admin/projects/new" className={s.buttonDark}>
          New project
        </Link>
      </div>
    );
  }

  return (
    <>
      {error ? <p className={s.errorText}>{error}</p> : null}
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
                      <p className={s.strong}>{project.title || "Untitled project"}</p>
                      <p className={s.muted}>/{project.slug}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={statusClass(project.status)}>
                    {project.status}
                  </span>
                </td>
                <td>{project.category || "-"}</td>
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
                    <button
                      className={s.buttonDanger}
                      disabled={busyId === project.id}
                      onClick={() => deleteProject(project)}
                    >
                      {busyId === project.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
