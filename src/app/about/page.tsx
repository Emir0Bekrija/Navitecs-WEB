import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import AboutClient from "../../components/pages/AboutClient";
import type { AboutTeamFeature } from "@/types/index";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NAVITECS — a BIM-focused engineering consultancy delivering precision coordination and technical solutions. Meet our team of experts in architectural, structural, and MEP engineering.",
  alternates: {
    canonical: "https://navitecs.ba/about",
  },
  openGraph: {
    title: "About Us | NAVITECS",
    description:
      "Learn about NAVITECS — a BIM-focused engineering consultancy delivering precision coordination and technical solutions in architectural, structural, and MEP engineering.",
    url: "https://navitecs.ba/about",
  },
};

export default async function Page() {
  const aboutFeature = (await prisma.aboutTeamFeature.findFirst({
    where: { enabled: true },
    select: { id: true, title: true, text: true, imageUrl: true, enabled: true },
  })) as AboutTeamFeature | null;

  return <AboutClient aboutFeature={aboutFeature} />;
}
