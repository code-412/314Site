import { z } from "zod";

export const projectStatusSchema = z.enum(["draft", "published", "review"]);
export const requestStatusSchema = z.enum(["new", "inProgress", "closed"]);

const textBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("text"),
  title: z.string().min(1),
  heading: z.string(),
  layout: z.enum(["default", "split"]).default("split"),
  paragraphs: z.array(z.string()).default([]),
  hidden: z.boolean().optional(),
});

const wideBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("wide"),
  title: z.string().min(1),
  image: z.string(),
  fullWidth: z.boolean().default(false),
  objectFit: z.enum(["cover", "contain"]).default("cover"),
  background: z.string().default("#f0f0f0"),
  hidden: z.boolean().optional(),
});

const galleryBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("gallery"),
  title: z.string().min(1),
  columns: z.union([z.literal(2), z.literal(3)]).default(2),
  images: z.array(z.string()).default([]),
  hidden: z.boolean().optional(),
});

const darkBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("dark"),
  title: z.string().min(1),
  heading: z.string(),
  images: z.array(z.string()).default([]),
  hidden: z.boolean().optional(),
});

export const projectBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  wideBlockSchema,
  galleryBlockSchema,
  darkBlockSchema,
]);

export const projectInputSchema = z.object({
  slug: z.string().default(""),
  title: z.string().default(""),
  status: projectStatusSchema.default("draft"),
  category: z.string().default(""),
  year: z.coerce.number().int().min(2000).max(2100),
  client: z.string().default(""),
  date: z.string().default(""),
  description: z.string().default(""),
  projectUrl: z.string().default(""),
  coverImage: z.string().default(""),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  blocks: z.array(projectBlockSchema).default([]),
}).superRefine((project, context) => {
  if (project.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    context.addIssue({
      code: "custom",
      path: ["slug"],
      message: "Slug can contain lowercase latin letters, numbers and hyphens.",
    });
  }

  if (project.status !== "published") return;

  const requiredFields: Array<keyof typeof project> = ["slug", "title", "category", "coverImage", "description"];
  requiredFields.forEach((field) => {
    if (typeof project[field] === "string" && !project[field].trim()) {
      context.addIssue({
        code: "custom",
        path: [field],
        message: "Required for publishing.",
      });
    }
  });
});

export const requestInputSchema = z.object({
  name: z.string().min(1),
  phone: z.string().default(""),
  email: z.email(),
  message: z.string().min(1),
  consent: z.boolean().default(false),
  source: z.string().default("/contact"),
  status: requestStatusSchema.default("new"),
});

export const requestStatusUpdateSchema = z.object({
  status: requestStatusSchema,
});
