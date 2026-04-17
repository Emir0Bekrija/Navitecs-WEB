import type { Metadata } from "next";
import ProjectsClient from "../../components/pages/ProjectsClient";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "View our portfolio of successful structural, mechanical, and architectural projects.",
  alternates: {
    canonical: "https://navitecs.ba/projects",
  },
  openGraph: {
    title: "Projects | NAVITECS",
    description:
      "View our portfolio of successful structural, mechanical, and architectural projects.",
    url: "https://navitecs.ba/projects",
  },
};

export default async function Page() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}
