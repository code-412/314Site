import Link from "next/link";
import { notFound } from "next/navigation";
import { type AdminProjectBlock } from "@/shared/admin/mock-data";
import { getProject } from "@/shared/server/database";
import pageStyles from "../../../AdminPages.module.scss";
import s from "./page.module.scss";

type Props = {
  params: Promise<{ id: string }>;
};

function renderBlock(block: AdminProjectBlock) {
  if (block.hidden) return null;

  if (block.type === "text") {
    if (block.layout === "split") {
      return (
        <section key={block.id} className={s.splitSection}>
          <div className={s.splitLayout}>
            <h2 className={s.splitHeading}>{block.heading}</h2>
            <div className={s.textStack}>
              {block.paragraphs.map((paragraph, index) => (
                <p key={`${block.id}-${index}`} className={s.paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section key={block.id} className={s.section}>
        <h2 className={s.heading}>{block.heading}</h2>
        <div className={s.textStack}>
          {block.paragraphs.map((paragraph, index) => (
            <p key={`${block.id}-${index}`} className={s.paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "wide") {
    return (
      <section key={block.id} className={s.wideSection}>
        <div
          className={`${s.wideImage}${block.fullWidth ? ` ${s.fullWidth}` : ""}`}
          style={{
            backgroundColor: block.background,
            backgroundImage: `url(${block.image})`,
            backgroundSize: block.objectFit,
          }}
        />
      </section>
    );
  }

  if (block.type === "gallery") {
    return (
      <section key={block.id} className={s.gallerySection}>
        <div className={s.gallery} data-cols={block.columns}>
          {block.images.map((image, index) => (
            <div
              key={`${block.id}-${index}`}
              className={s.galleryItem}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section key={block.id} className={s.darkSection}>
      <h2 className={s.heading}>{block.heading}</h2>
      <div className={s.darkGrid}>
        {block.images.map((image, index) => (
          <div
            key={`${block.id}-${index}`}
            className={s.darkImage}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProjectPreviewPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) notFound();

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.toolbar}>
        <div className={pageStyles.titleGroup}>
          <span className={pageStyles.eyebrow}>Draft preview</span>
          <h1 className={pageStyles.title}>{project.title}</h1>
          <p className={pageStyles.subtitle}>
            Approximate admin preview of the public project page. Final rendering will use
            the same data model as the live `/works/[slug]` route.
          </p>
        </div>
        <div className={pageStyles.buttonRow}>
          <Link href={`/admin/projects/${project.id}/edit`} className={pageStyles.button}>
            Back to editor
          </Link>
          <Link href={`/works/${project.slug}`} className={pageStyles.buttonDark}>
            View live
          </Link>
        </div>
      </div>

      <article className={s.preview}>
        <section className={s.hero}>
          <h2 className={s.heroTitle}>{project.title}</h2>
          <div className={s.meta}>
            <div>
              <span className={s.label}>Client</span>
              <span className={s.value}>{project.client || "Client name"}</span>
            </div>
            <div>
              <span className={s.label}>Type of works</span>
              <span className={s.value}>{project.services.join(", ")}</span>
            </div>
          </div>
          <div className={s.heroImage} style={{ backgroundImage: `url(${project.coverImage})` }} />
        </section>
        {project.blocks.map(renderBlock)}
      </article>
    </div>
  );
}
