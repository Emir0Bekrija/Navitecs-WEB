import type { Metadata } from "next";
import ProjectDetailsClient from "../../../components/pages/ProjectDetailsClient";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Project Details",
  description: "Explore a detailed NAVITECS project case study.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const projects = await getProjects();
  return <ProjectDetailsClient allProjects={projects} />;
}
