/**
 * Prisma seed script
 * Migrates existing JSON data into MySQL and creates the admin user.
 * Run: npm run db:seed
 *
 * NOTE: Uses dynamic imports so dotenv loads BEFORE PrismaClient is instantiated.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env.local before anything else (static imports are hoisted in ESM)
const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: fs.existsSync(envPath) ? envPath : ".env" });

// Dynamic imports ensure env vars are set before these modules load
const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
const { PrismaClient } = await import("@/generated/prisma/client");
const bcrypt = await import("bcryptjs");
//const { projects: staticProjects } = await import("@/data/projects");

function readJson<T>(filename: string): T | null {
  const fullPath = path.resolve(process.cwd(), "src", "data", filename);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T;
  } catch {
    return null;
  }
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASSWORD ?? "",
  database: process.env.DATABASE_NAME ?? "navitecs",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // ── Admin user ────────────────────────────────────────────────────────────
  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!rawPassword) throw new Error("ADMIN_PASSWORD is not set in .env.local");

  const hashed = await bcrypt.hash(rawPassword, 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { password: hashed },
    create: { username: "admin", password: hashed },
  });
  console.log("✓ Admin user seeded");

  // ── Projects ──────────────────────────────────────────────────────────────
  /*type ProjectData = (typeof staticProjects)[number];
  const projectsJson = readJson<ProjectData[]>("projects.json");
  const projectsToSeed = projectsJson ?? staticProjects;

  for (let i = 0; i < projectsToSeed.length; i++) {
    const p = projectsToSeed[i];
    await prisma.project.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        category: p.category,
        description: p.description,
        scope: p.scope,
        image: p.image,
        challenge: p.caseStudy.challenge,
        solution: p.caseStudy.solution,
        results: p.caseStudy.results,
        order: i,
      },
      create: {
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        scope: p.scope,
        image: p.image,
        challenge: p.caseStudy.challenge,
        solution: p.caseStudy.solution,
        results: p.caseStudy.results,
        order: i,
      },
    });
  }
  console.log(`✓ ${projectsToSeed.length} projects seeded`);*/

  // ── Jobs ──────────────────────────────────────────────────────────────────
  type OldJob = {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    active: boolean;
    createdAt: string;
    order?: number;
  };
  const jobs = readJson<OldJob[]>("jobs.json");
  if (jobs) {
    for (let i = 0; i < jobs.length; i++) {
      const j = jobs[i];
      await prisma.job.upsert({
        where: { id: j.id },
        update: {
          title: j.title,
          department: j.department,
          location: j.location,
          type: j.type,
          description: j.description,
          active: j.active,
          order: j.order ?? i,
        },
        create: {
          id: j.id,
          title: j.title,
          department: j.department,
          location: j.location,
          type: j.type,
          description: j.description,
          active: j.active,
          order: j.order ?? i,
          createdAt: new Date(j.createdAt),
        },
      });
    }
    console.log(`✓ ${jobs.length} jobs seeded`);
  }

  // ── Contacts ──────────────────────────────────────────────────────────────
  type OldContact = {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    projectType?: string;
    service?: string;
    message: string;
    submittedAt: string;
  };
  const contacts = readJson<OldContact[]>("contacts.json");
  if (contacts) {
    for (const c of contacts) {
      const existing = await prisma.contact.findUnique({ where: { id: c.id } });
      if (!existing) {
        await prisma.contact.create({
          data: {
            id: c.id,
            name: c.name,
            email: c.email,
            company: c.company,
            phone: c.phone,
            projectType: c.projectType,
            service: c.service,
            message: c.message,
            submittedAt: new Date(c.submittedAt),
          },
        });
      }
    }
    console.log(`✓ ${contacts.length} contacts seeded`);
  }

  // ── Applications ──────────────────────────────────────────────────────────
  type OldApplication = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    linkedin?: string;
    portfolio?: string;
    message?: string;
    cvFileName?: string;
    submittedAt: string;
  };
  const applications = readJson<OldApplication[]>("applications.json");
  if (applications) {
    for (const a of applications) {
      const existing = await prisma.application.findUnique({
        where: { id: a.id },
      });
      if (!existing) {
        await prisma.application.create({
          data: {
            id: a.id,
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email,
            phone: a.phone,
            role: a.role,
            linkedin: a.linkedin,
            portfolio: a.portfolio,
            message: a.message,
            cvFileName: a.cvFileName,
            cvPath: a.cvFileName ? `cvs/${a.cvFileName}` : null,
            submittedAt: new Date(a.submittedAt),
          },
        });
      }
    }
    console.log(`✓ ${applications.length} applications seeded`);
  }

  // ── SMTP config singleton ─────────────────────────────────────────────────
  type SmtpJson = {
    host?: string;
    port?: number;
    secure?: boolean;
    user?: string;
    password?: string;
    fromName?: string;
    fromEmail?: string;
  };
  const smtp = readJson<SmtpJson>("smtp-config.json");
  const smtpData = {
    host: smtp?.host ?? "",
    port: smtp?.port ?? 587,
    secure: smtp?.secure ?? false,
    user: smtp?.user ?? "",
    password: smtp?.password ?? "",
    fromName: smtp?.fromName ?? "NAVITECS",
    fromEmail: smtp?.fromEmail ?? "",
  };
  await prisma.smtpConfig.upsert({
    where: { id: 1 },
    update: smtpData,
    create: { id: 1, ...smtpData },
  });
  console.log("✓ SMTP config seeded");

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
