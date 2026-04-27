import "server-only";

import { randomUUID } from "node:crypto";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
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
} from "@/shared/admin/mock-data";
import {
  projectInputSchema,
  requestInputSchema,
  requestStatusUpdateSchema,
} from "@/shared/admin/schemas";
import type { DatabaseAdapter } from "@/shared/server/database";

type Queryable = Pick<Pool, "query"> | Pick<PoolClient, "query">;

type ProjectRow = QueryResultRow & {
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
  featured: boolean;
  tags_json: unknown;
  services_json: unknown;
  created_at: Date | string;
  updated_at: Date | string;
};

type BlockRow = QueryResultRow & {
  id: string;
  project_id: string;
  sort_order: number;
  type: AdminProjectBlock["type"];
  title: string;
  payload_json: unknown;
  hidden: boolean;
};

type RequestRow = QueryResultRow & {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  source: string;
  status: AdminRequestStatus;
  created_at: Date | string;
  updated_at: Date | string;
};

let pool: Pool | undefined;
let migrated = false;

function connectionString() {
  const value = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!value) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for postgres storage.");
  }
  return value;
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString(),
      ssl: process.env.POSTGRES_SSL === "false" ? undefined : { rejectUnauthorized: false },
      max: Number(process.env.POSTGRES_POOL_MAX ?? 5),
    });
  }

  return pool;
}

function now() {
  return new Date().toISOString();
}

function draftSlug() {
  return `draft-${randomUUID().slice(0, 8)}`;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function asPayload(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return {};
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

async function ensureDatabase() {
  if (migrated) return;

  const database = getPool();
  await database.query(`
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
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      tags_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      services_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_blocks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      hidden BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE INDEX IF NOT EXISTS idx_project_blocks_project
      ON project_blocks(project_id, sort_order);

    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      consent BOOLEAN NOT NULL DEFAULT FALSE,
      source TEXT NOT NULL DEFAULT '/contact',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `);

  migrated = true;
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
  const payload = asPayload(row.payload_json);
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
      paragraphs: asStringArray(payload.paragraphs),
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
      images: asStringArray(payload.images),
    } satisfies AdminGalleryBlock;
  }

  return {
    ...base,
    type: "dark",
    heading: String(payload.heading ?? ""),
    images: asStringArray(payload.images),
  } satisfies AdminDarkBlock;
}

async function rowToProject(row: ProjectRow, database: Queryable): Promise<AdminProject> {
  const blocks = await database.query<BlockRow>(
    "SELECT * FROM project_blocks WHERE project_id = $1 ORDER BY sort_order ASC",
    [row.id]
  );

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    category: row.category,
    year: Number(row.year),
    client: row.client,
    date: row.date,
    description: row.description,
    projectUrl: row.project_url,
    coverImage: row.cover_image,
    featured: Boolean(row.featured),
    tags: asStringArray(row.tags_json),
    services: asStringArray(row.services_json),
    updatedAt: toIso(row.updated_at),
    blocks: blocks.rows.map(rowToBlock),
  };
}

async function getProjectFrom(idOrSlug: string, database: Queryable) {
  const result = await database.query<ProjectRow>(
    "SELECT * FROM projects WHERE id = $1 OR slug = $1 LIMIT 1",
    [idOrSlug]
  );

  if (!result.rows[0]) return null;
  return rowToProject(result.rows[0], database);
}

async function upsertProject(project: AdminProject, database: Queryable) {
  const time = project.updatedAt || now();

  await database.query(
    `
      INSERT INTO projects (
        id, slug, title, status, category, year, client, date, description,
        project_url, cover_image, featured, tags_json, services_json, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13::jsonb, $14::jsonb, $15, $15
      )
      ON CONFLICT (id) DO UPDATE SET
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
    `,
    [
      project.id,
      project.slug,
      project.title,
      project.status,
      project.category,
      project.year,
      project.client,
      project.date,
      project.description,
      project.projectUrl,
      project.coverImage,
      project.featured,
      JSON.stringify(project.tags),
      JSON.stringify(project.services),
      time,
    ]
  );

  await database.query("DELETE FROM project_blocks WHERE project_id = $1", [project.id]);

  for (const [index, block] of project.blocks.entries()) {
    await database.query(
      `
        INSERT INTO project_blocks (
          id, project_id, sort_order, type, title, payload_json, hidden
        ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
      `,
      [
        block.id,
        project.id,
        index,
        block.type,
        block.title,
        JSON.stringify(blockPayload(block)),
        Boolean(block.hidden),
      ]
    );
  }

  return getProjectFrom(project.id, database);
}

async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const postgresAdapter: DatabaseAdapter = {
  async listProjects() {
    await ensureDatabase();
    const rows = await getPool().query<ProjectRow>("SELECT * FROM projects ORDER BY updated_at DESC");
    return Promise.all(rows.rows.map((row) => rowToProject(row, getPool())));
  },

  async getProject(idOrSlug) {
    await ensureDatabase();
    return getProjectFrom(idOrSlug, getPool());
  },

  async createProject(input) {
    await ensureDatabase();
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

    return withTransaction((client) => upsertProject(project, client)) as Promise<AdminProject>;
  },

  async updateProject(id, input) {
    await ensureDatabase();
    const existing = await getProjectFrom(id, getPool());
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

    return withTransaction((client) => upsertProject(project, client)) as Promise<AdminProject>;
  },

  async deleteProject(id) {
    await ensureDatabase();
    const result = await getPool().query("DELETE FROM projects WHERE id = $1", [id]);
    return Number(result.rowCount) > 0;
  },

  async listRequests() {
    await ensureDatabase();
    const rows = await getPool().query<RequestRow>(
      "SELECT * FROM contact_requests ORDER BY created_at DESC"
    );

    return rows.rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      message: row.message,
      consent: Boolean(row.consent),
      source: row.source,
      status: row.status,
      createdAt: toIso(row.created_at),
    } satisfies AdminRequest));
  },

  async createRequest(input) {
    await ensureDatabase();
    const parsed = requestInputSchema.parse(input);
    const id = randomUUID();
    const time = now();

    await getPool().query(
      `
        INSERT INTO contact_requests (
          id, name, phone, email, message, consent, source, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      `,
      [
        id,
        parsed.name,
        parsed.phone,
        parsed.email,
        parsed.message,
        parsed.consent,
        parsed.source,
        parsed.status,
        time,
      ]
    );

    const requests = await this.listRequests();
    return requests.find((item) => item.id === id) ?? null;
  },

  async updateRequestStatus(id, input) {
    await ensureDatabase();
    const parsed = requestStatusUpdateSchema.parse(input);
    const result = await getPool().query(
      "UPDATE contact_requests SET status = $1, updated_at = $2 WHERE id = $3",
      [parsed.status, now(), id]
    );

    if (Number(result.rowCount) === 0) return null;
    const requests = await this.listRequests();
    return requests.find((item) => item.id === id) ?? null;
  },

  async deleteRequest(id) {
    await ensureDatabase();
    const result = await getPool().query("DELETE FROM contact_requests WHERE id = $1", [id]);
    return Number(result.rowCount) > 0;
  },
};
