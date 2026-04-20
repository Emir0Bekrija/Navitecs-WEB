// Server-only: Node.js runtime only, do NOT import in client components or middleware.
import "server-only";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
};

const DEFAULT_CONFIG: SmtpConfig = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  password: "",
  fromName: "NAVITECS",
  fromEmail: "",
};

export async function getSmtpConfig(): Promise<SmtpConfig> {
  const row = await prisma.smtpConfig.findUnique({ where: { id: 1 } });
  if (!row) return DEFAULT_CONFIG;
  return {
    host: row.host,
    port: row.port,
    secure: row.secure,
    user: row.user,
    password: row.password,
    fromName: row.fromName,
    fromEmail: row.fromEmail,
  };
}

export async function saveSmtpConfig(config: SmtpConfig): Promise<void> {
  await prisma.smtpConfig.upsert({
    where: { id: 1 },
    update: config,
    create: { id: 1, ...config },
  });
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const cfg = await getSmtpConfig();

  if (!cfg.host || !cfg.user || !cfg.password || !cfg.fromEmail) {
    throw new Error("SMTP is not configured. Please set up SMTP in Admin → Settings.");
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.password },
  });

  await transporter.sendMail({
    from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
    to,
    subject,
    html,
  });
}