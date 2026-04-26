import "server-only";

import type { AdminProject, AdminRequest } from "@/shared/admin/mock-data";

export type DatabaseAdapter = {
  listProjects(): Promise<AdminProject[]>;
  getProject(idOrSlug: string): Promise<AdminProject | null>;
  createProject(input: unknown): Promise<AdminProject>;
  updateProject(id: string, input: unknown): Promise<AdminProject | null>;
  deleteProject(id: string): Promise<boolean>;
  listRequests(): Promise<AdminRequest[]>;
  createRequest(input: unknown): Promise<AdminRequest | null>;
  updateRequestStatus(id: string, input: unknown): Promise<AdminRequest | null>;
  deleteRequest(id: string): Promise<boolean>;
};

function provider() {
  if (process.env.DATABASE_PROVIDER === "postgres") return "postgres";
  if (process.env.DATABASE_PROVIDER === "sqlite") return "sqlite";
  if (process.env.VERCEL && (process.env.DATABASE_URL || process.env.POSTGRES_URL)) return "postgres";
  return "sqlite";
}

let adapterPromise: Promise<DatabaseAdapter> | undefined;

async function getAdapter() {
  if (!adapterPromise) {
    adapterPromise =
      provider() === "postgres"
        ? import("./database-postgres").then((module) => module.postgresAdapter)
        : import("./database-sqlite").then((module) => module.sqliteAdapter);
  }

  return adapterPromise;
}

export async function listProjects() {
  return (await getAdapter()).listProjects();
}

export async function getProject(idOrSlug: string) {
  return (await getAdapter()).getProject(idOrSlug);
}

export async function createProject(input: unknown) {
  return (await getAdapter()).createProject(input);
}

export async function updateProject(id: string, input: unknown) {
  return (await getAdapter()).updateProject(id, input);
}

export async function deleteProject(id: string) {
  return (await getAdapter()).deleteProject(id);
}

export async function listRequests() {
  return (await getAdapter()).listRequests();
}

export async function createRequest(input: unknown) {
  return (await getAdapter()).createRequest(input);
}

export async function updateRequestStatus(id: string, input: unknown) {
  return (await getAdapter()).updateRequestStatus(id, input);
}

export async function deleteRequest(id: string) {
  return (await getAdapter()).deleteRequest(id);
}
