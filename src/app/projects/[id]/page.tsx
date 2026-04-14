import type { Metadata } from "next";
import ProjectDetailsClient from "../../../components/pages/ProjectDetailsClient";

export const metadata: Metadata = {
  title: "Project Details",
  description: "Explore a detailed NAVITECS project case study.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ProjectDetailsClient />;
}
