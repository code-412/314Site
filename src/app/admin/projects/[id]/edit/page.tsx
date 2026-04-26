import { notFound } from "next/navigation";
import { getProject } from "@/shared/server/database";
import { ProjectEditor } from "../../ProjectEditor";
import pageStyles from "../../../AdminPages.module.scss";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.toolbar}>
        <div className={pageStyles.titleGroup}>
          <span className={pageStyles.eyebrow}>Project constructor</span>
          <h1 className={pageStyles.title}>Edit project</h1>
          <p className={pageStyles.subtitle}>
            Update project metadata and arrange the page blocks. Saving and publishing
            are persisted through the admin API.
          </p>
        </div>
      </div>
      <ProjectEditor initialProject={project} mode="edit" />
    </div>
  );
}
