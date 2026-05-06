import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import TeamPageClient from "@/components/pages/TeamPageClient";
import type { TeamMember } from "@/types/index";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the NAVITECS team — experienced BIM coordinators, engineers, and architects based in Sarajevo, Bosnia and Herzegovina, delivering projects across Europe.",
  alternates: {
    canonical: "https://navitecs.ba/team",
  },
  openGraph: {
    title: "Our Team | NAVITECS",
    description:
      "Meet the NAVITECS team — experienced BIM coordinators, engineers, and architects delivering projects across Europe.",
    url: "https://navitecs.ba/team",
  },
};

export default async function TeamPage() {
  const members = (await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      imageUrl: true,
      featured: true,
      active: true,
      order: true,
    },
  })) as TeamMember[];

  return <TeamPageClient members={members} />;
}
