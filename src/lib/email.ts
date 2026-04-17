// Server-only: Node.js runtime only, do NOT import in client components or middleware.
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
};

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "smtp-config.json");

export async function getSmtpConfig(): Promise<SmtpConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as SmtpConfig;
  } catch {
    return {
      host: "",
      port: 587,
      secure: false,
      user: "",
      password: "",
      fromName: "NAVITECS",
      fromEmail: "",
    };
  }
}

export async function saveSmtpConfig(config: SmtpConfig): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
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
