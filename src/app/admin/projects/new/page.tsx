import { createBlankAdminProject } from "@/shared/admin/mock-data";
import { ProjectEditor } from "../ProjectEditor";
import pageStyles from "../../AdminPages.module.scss";

export default function NewProjectPage() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.toolbar}>
        <div className={pageStyles.titleGroup}>
          <span className={pageStyles.eyebrow}>Project constructor</span>
          <h1 className={pageStyles.title}>New project</h1>
          <p className={pageStyles.subtitle}>
            Create the public case page from locked visual blocks: text, wide images,
            galleries, and dark media sections.
          </p>
        </div>
      </div>
      <ProjectEditor initialProject={createBlankAdminProject()} mode="create" />
    </div>
  );
}
