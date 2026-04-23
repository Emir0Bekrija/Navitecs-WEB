/**
 * Seed / reset the superadmin account.
 *
 * Usage:
 *   npx tsx scripts/seed-superadmin.ts
 *
 * Run this once to create the initial superadmin, or any time
 * you need to recover access (e.g. forgotten password).
 */
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaClient } = await import("../src/generated/prisma/client.js") as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { PrismaMariaDb } = await import("@prisma/adapter-mariadb") as any;

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASSWORD ?? "",
  database: process.env.DATABASE_NAME ?? "navitecs",
});

const prisma = new PrismaClient({ adapter });

const rl = readline.createInterface({ input, output });

async function main() {
  console.log("\n── NAVITECS Superadmin Seed ──\n");

  const username =
    (await rl.question("Username (default: superadmin): ")).trim() ||
    "superadmin";
  const password = (await rl.question("Password (min 12 chars): ")).trim();

  if (password.length < 12) {
    console.error("❌ Password must be at least 12 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: { password: hash, role: "superadmin" },
    create: { username, password: hash, role: "superadmin" },
  });

  console.log(`\n✅ Superadmin "${user.username}" saved (id=${user.id}).`);
  console.log(`   Login at: /navitecs-control-admin/login\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
