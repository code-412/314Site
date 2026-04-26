import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  type AdminDarkBlock,
  type AdminGalleryBlock,
  type AdminProject,
  type AdminProjectBlock,
  type AdminProjectStatus,
  type AdminRequest,
  type AdminRequestStatus,
  type AdminTextBlock,
  type AdminWideImageBlock,
  adminProjects,
  adminRequests,
} from "@/shared/admin/mock-data";
import {
  projectInputSchema,
  requestInputSchema,
  requestStatusUpdateSchema,
} from "@/shared/admin/schemas";
import type { DatabaseAdapter } from "@/shared/server/database";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  status: AdminProjectStatus;
  category: string;
  year: number;
  client: string;
  date: string;
  description: string;
  project_url: string;
  cover_image: string;
  featured: number;
  tags_json: string;
  services_json: string;
  created_at: string;
  updated_at: string;
};

type BlockRow = {
  id: string;
  project_id: string;
  sort_order: number;
  type: AdminProjectBlock["type"];
  title: string;
  payload_json: string;
  hidden: number;
};

type RequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: number;
  source: string;
  status: AdminRequestStatus;
  created_at: string;
  updated_at: string;
};

let db: Database.Database | undefined;

function dataDir() {
  return process.env.SQLITE_DIR ?? path.join(process.cwd(), "data");
}

function dbPath() {
  return process.env.SQLITE_PATH ?? path.join(dataDir(), "site.sqlite");
}

function jsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function now() {
  return new Date().toISOString();
}

function draftSlug() {
  return `draft-${randomUUID().slice(0, 8)}`;
}

export function getDb() {
  if (db) return db;

  mkdirSync(dataDir(), { recursive: true });
  db = new Database(dbPath());
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);

  return db;
}

function migrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      category TEXT NOT NULL,
      year INTEGER NOT NULL,
      client TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      project_url TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      tags_json TEXT NOT NULL DEFAULT '[]',
      services_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_blocks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      hidden INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_project_blocks_project
      ON project_blocks(project_id, sort_order);

    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      consent INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL DEFAULT '/contact',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function seed(database: Database.Database) {
  const projectCount = database.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (projectCount.count === 0) {
    const insertMany = database.transaction((projects: AdminProject[]) => {
      projects.forEach((project) => upsertProject(project, database));
    });
    insertMany(adminProjects);
  }

  const requestCount = database.prepare("SELECT COUNT(*) as count FROM contact_requests").get() as { count: number };
  if (requestCount.count === 0) {
    const insert = database.prepare(`
      INSERT INTO contact_requests (
        id, name, phone, email, message, consent, source, status, created_at, updated_at
      ) VALUES (
        @id, @name, @phone, @email, @message, @consent, @source, @status, @created_at, @updated_at
      )
    `);

    const insertMany = database.transaction((requests: AdminRequest[]) => {
      requests.forEach((request) => {
        insert.run({
          id: request.id,
          name: request.name,
          phone: request.phone,
          email: request.email,
          message: request.message,
          consent: request.consent ? 1 : 0,
          source: request.source,
          status: request.status,
          created_at: request.createdAt,
          updated_at: request.createdAt,
        });
      });
    });

    insertMany(adminRequests);
  }
}

function blockPayload(block: AdminProjectBlock) {
  if (block.type === "text") {
    return {
      heading: block.heading,
      layout: block.layout,
      paragraphs: block.paragraphs,
    };
  }

  if (block.type === "wide") {
    return {
      image: block.image,
      fullWidth: block.fullWidth,
      objectFit: block.objectFit,
      background: block.background,
    };
  }

  if (block.type === "gallery") {
    return {
      columns: block.columns,
      images: block.images,
    };
  }

  return {
    heading: block.heading,
    images: block.images,
  };
}

function rowToBlock(row: BlockRow): AdminProjectBlock {
  const payload = jsonParse<Record<string, unknown>>(row.payload_json, {});
  const base = {
    id: row.id,
    title: row.title,
    hidden: Boolean(row.hidden),
  };

  if (row.type === "text") {
    return {
      ...base,
      type: "text",
      heading: String(payload.heading ?? ""),
      layout: payload.layout === "default" ? "default" : "split",
      paragraphs: Array.isArray(payload.paragraphs) ? payload.paragraphs.map(String) : [],
    } satisfies AdminTextBlock;
  }

  if (row.type === "wide") {
    return {
      ...base,
      type: "wide",
      image: String(payload.image ?? ""),
      fullWidth: Boolean(payload.fullWidth),
      objectFit: payload.objectFit === "contain" ? "contain" : "cover",
      background: String(payload.background ?? "#f0f0f0"),
    } satisfies AdminWideImageBlock;
  }

  if (row.type === "gallery") {
    return {
      ...base,
      type: "gallery",
      columns: payload.columns === 3 ? 3 : 2,
      images: Array.isArray(payload.images) ? payload.images.map(String) : [],
    } satisfies AdminGalleryBlock;
  }

  return {
    ...base,
    type: "dark",
    heading: String(payload.heading ?? ""),
    images: Array.isArray(payload.images) ? payload.images.map(String) : [],
  } satisfies AdminDarkBlock;
}

function rowToProject(row: ProjectRow, blocks: AdminProjectBlock[]): AdminProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    category: row.category,
    year: row.year,
    client: row.client,
    date: row.date,
    description: row.description,
    projectUrl: row.project_url,
    coverImage: row.cover_image,
    featured: Boolean(row.featured),
    tags: jsonParse<string[]>(row.tags_json, []),
    services: jsonParse<string[]>(row.services_json, []),
    updatedAt: row.updated_at,
    blocks,
  };
}

function upsertProject(project: AdminProject, database = getDb()) {
  const time = project.updatedAt || now();

  database.prepare(`
    INSERT INTO projects (
      id, slug, title, status, category, year, client, date, description,
      project_url, cover_image, featured, tags_json, services_json, created_at, updated_at
    ) VALUES (
      @id, @slug, @title, @status, @category, @year, @client, @date, @description,
      @project_url, @cover_image, @featured, @tags_json, @services_json, @created_at, @updated_at
    )
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      status = excluded.status,
      category = excluded.category,
      year = excluded.year,
      client = excluded.client,
      date = excluded.date,
      description = excluded.description,
      project_url = excluded.project_url,
      cover_image = excluded.cover_image,
      featured = excluded.featured,
      tags_json = excluded.tags_json,
      services_json = excluded.services_json,
      updated_at = excluded.updated_at
  `).run({
    id: project.id,
    slug: project.slug,
    title: project.title,
    status: project.status,
    category: project.category,
    year: project.year,
    client: project.client,
    date: project.date,
    description: project.description,
    project_url: project.projectUrl,
    cover_image: project.coverImage,
    featured: project.featured ? 1 : 0,
    tags_json: JSON.stringify(project.tags),
    services_json: JSON.stringify(project.services),
    created_at: time,
    updated_at: time,
  });

  database.prepare("DELETE FROM project_blocks WHERE project_id = ?").run(project.id);

  const insertBlock = database.prepare(`
    INSERT INTO project_blocks (
      id, project_id, sort_order, type, title, payload_json, hidden
    ) VALUES (
      @id, @project_id, @sort_order, @type, @title, @payload_json, @hidden
    )
  `);

  project.blocks.forEach((block, index) => {
    insertBlock.run({
      id: block.id,
      project_id: project.id,
      sort_order: index,
      type: block.type,
      title: block.title,
      payload_json: JSON.stringify(blockPayload(block)),
      hidden: block.hidden ? 1 : 0,
    });
  });

  return getProject(project.id, database);
}

export function listProjects(database = getDb()) {
  const rows = database.prepare("SELECT * FROM projects ORDER BY updated_at DESC").all() as ProjectRow[];
  return rows.map((row) => getProject(row.id, database)).filter(Boolean) as AdminProject[];
}

export function getProject(idOrSlug: string, database = getDb()) {
  const row = database
    .prepare("SELECT * FROM projects WHERE id = ? OR slug = ?")
    .get(idOrSlug, idOrSlug) as ProjectRow | undefined;

  if (!row) return null;

  const blocks = database
    .prepare("SELECT * FROM project_blocks WHERE project_id = ? ORDER BY sort_order ASC")
    .all(row.id) as BlockRow[];

  return rowToProject(row, blocks.map(rowToBlock));
}

export function createProject(input: unknown) {
  const parsed = projectInputSchema.parse(input);
  const id = randomUUID();
  const project: AdminProject = {
    ...parsed,
    id,
    slug: parsed.slug.trim() || draftSlug(),
    title: parsed.title.trim(),
    category: parsed.category.trim(),
    coverImage: parsed.coverImage.trim(),
    description: parsed.description.trim(),
    updatedAt: now(),
    blocks: parsed.blocks.map((block) => ({ ...block, id: block.id ?? randomUUID() } as AdminProjectBlock)),
  };

  const transaction = getDb().transaction(() => upsertProject(project));
  return transaction() as AdminProject;
}

export function updateProject(id: string, input: unknown) {
  const existing = getProject(id);
  if (!existing) return null;

  const parsed = projectInputSchema.parse(input);
  const project: AdminProject = {
    ...parsed,
    id: existing.id,
    slug: parsed.slug.trim() || existing.slug || draftSlug(),
    title: parsed.title.trim(),
    category: parsed.category.trim(),
    coverImage: parsed.coverImage.trim(),
    description: parsed.description.trim(),
    updatedAt: now(),
    blocks: parsed.blocks.map((block) => ({ ...block, id: block.id ?? randomUUID() } as AdminProjectBlock)),
  };

  const transaction = getDb().transaction(() => upsertProject(project));
  return transaction() as AdminProject;
}

export function deleteProject(id: string) {
  const result = getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  return result.changes > 0;
}

export function listRequests(database = getDb()) {
  const rows = database
    .prepare("SELECT * FROM contact_requests ORDER BY created_at DESC")
    .all() as RequestRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    consent: Boolean(row.consent),
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
  } satisfies AdminRequest));
}

export function createRequest(input: unknown) {
  const parsed = requestInputSchema.parse(input);
  const request = {
    id: randomUUID(),
    ...parsed,
    created_at: now(),
    updated_at: now(),
  };

  getDb().prepare(`
    INSERT INTO contact_requests (
      id, name, phone, email, message, consent, source, status, created_at, updated_at
    ) VALUES (
      @id, @name, @phone, @email, @message, @consent, @source, @status, @created_at, @updated_at
    )
  `).run({
    ...request,
    consent: request.consent ? 1 : 0,
  });

  return listRequests().find((item) => item.id === request.id) ?? null;
}

export function updateRequestStatus(id: string, input: unknown) {
  const parsed = requestStatusUpdateSchema.parse(input);
  const result = getDb()
    .prepare("UPDATE contact_requests SET status = ?, updated_at = ? WHERE id = ?")
    .run(parsed.status, now(), id);

  if (result.changes === 0) return null;
  return listRequests().find((item) => item.id === id) ?? null;
}

export function deleteRequest(id: string) {
  const result = getDb().prepare("DELETE FROM contact_requests WHERE id = ?").run(id);
  return result.changes > 0;
}

export const sqliteAdapter: DatabaseAdapter = {
  async listProjects() {
    return listProjects();
  },
  async getProject(idOrSlug) {
    return getProject(idOrSlug);
  },
  async createProject(input) {
    return createProject(input);
  },
  async updateProject(id, input) {
    return updateProject(id, input);
  },
  async deleteProject(id) {
    return deleteProject(id);
  },
  async listRequests() {
    return listRequests();
  },
  async createRequest(input) {
    return createRequest(input);
  },
  async updateRequestStatus(id, input) {
    return updateRequestStatus(id, input);
  },
  async deleteRequest(id) {
    return deleteRequest(id);
  },
};
