import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ password: z.string().min(1) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.adminUser.findUnique({
          where: { username: "admin" },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        // Return minimal user object — only used to create the JWT
        return { id: String(user.id), name: "Admin" };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/admin/login",
  },

  // AUTH_SECRET is read automatically from process.env.AUTH_SECRET
  trustHost: true,
});
