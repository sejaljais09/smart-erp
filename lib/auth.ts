import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } =
  NextAuth({
    session: {
      strategy: "jwt",
    },

    providers: [
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.id;
    }
    return session;
  },
},

        async authorize(credentials) {
  console.log("========== LOGIN ATTEMPT ==========");

  const email = credentials?.email as string;
  const password = credentials?.password as string;

  console.log("EMAIL:", email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("USER FOUND:", !!user);

  if (!user) {
    console.log("USER DOES NOT EXIST");
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  console.log("PASSWORD VALID:", isValid);

  if (!isValid) {
    return null;
  }

  console.log("LOGIN SUCCESS");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
      }),
    ],

    pages: {
      signIn: "/login",
    },
  });