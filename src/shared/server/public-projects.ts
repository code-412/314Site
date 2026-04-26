import "server-only";

import { type AdminProject, type AdminProjectBlock } from "@/shared/admin/mock-data";
import { getProject, listProjects } from "@/shared/server/database";
import { type ContentBlock, type Work } from "@/shared/types";

function mapBlock(block: AdminProjectBlock): ContentBlock | null {
  if (block.hidden) return null;

  if (block.type === "text") {
    const paragraphs = block.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
    if (!block.heading.trim() && paragraphs.length === 0) return null;

    return {
      type: "text",
      heading: block.heading.trim(),
      paragraphs,
      layout: block.layout === "split" ? "split" : undefined,
    };
  }

  if (block.type === "wide") {
    if (!block.image.trim()) return null;

    return {
      type: "wide",
      src: block.image.trim(),
      fullWidth: block.fullWidth,
      objectFit: block.objectFit,
      bg: block.background,
    };
  }

  if (block.type === "gallery") {
    const images = block.images.map((image) => image.trim()).filter(Boolean);
    if (images.length === 0) return null;

    return {
      type: "gallery",
      images,
      columns: block.columns,
    };
  }

  const images = block.images.map((image) => image.trim()).filter(Boolean);
  if (images.length === 0 && !block.heading.trim()) return null;

  return {
    type: "dark",
    heading: block.heading.trim(),
    images,
  };
}

function isPublicProject(project: AdminProject) {
  return (
    project.status === "published" &&
    Boolean(project.slug.trim()) &&
    Boolean(project.title.trim()) &&
    Boolean(project.category.trim()) &&
    Boolean(project.coverImage.trim())
  );
}

export function mapAdminProjectToWork(project: AdminProject): Work {
  return {
    slug: project.slug.trim(),
    title: project.title.trim(),
    category: project.category.trim(),
    year: project.year,
    description: project.description.trim(),
    tags: project.tags,
    image: project.coverImage.trim(),
    featured: project.featured,
    client: project.client,
    date: project.date,
    projectUrl: project.projectUrl || undefined,
    services: project.services,
    blocks: project.blocks.map(mapBlock).filter(Boolean) as ContentBlock[],
  };
}

export function listPublishedWorks() {
  return listProjects()
    .filter(isPublicProject)
    .map(mapAdminProjectToWork);
}

export function listFeaturedPublishedWorks() {
  return listPublishedWorks().filter((project) => project.featured);
}

export function getPublishedWorkBySlug(slug: string) {
  const project = getProject(slug);
  if (!project || !isPublicProject(project)) return null;
  return mapAdminProjectToWork(project);
}
