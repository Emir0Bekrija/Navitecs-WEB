// Server-only: uses Node.js fs module. Do NOT import in client components or middleware.
import { promises as fs } from "fs";
import path from "path";
import type {
  Project,
  Job,
  Application,
  ContactSubmission,
} from "@/types/index";
import { projects as staticProjects } from "@/data/projects";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

// Projects — reads projects.json if present, else falls back to static projects.ts
export async function getProjects(): Promise<Project[]> {
  return readJson<Project[]>("projects.json", staticProjects as Project[]);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJson("projects.json", projects);
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  return readJson<Job[]>("jobs.json", []);
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  await writeJson("jobs.json", jobs);
}

// Applications
export async function getApplications(): Promise<Application[]> {
  return readJson<Application[]>("applications.json", []);
}

export async function saveApplications(
  applications: Application[],
): Promise<void> {
  await writeJson("applications.json", applications);
}

// Contacts
export async function getContacts(): Promise<ContactSubmission[]> {
  return readJson<ContactSubmission[]>("contacts.json", []);
}

export async function saveContacts(
  contacts: ContactSubmission[],
): Promise<void> {
  await writeJson("contacts.json", contacts);
}
