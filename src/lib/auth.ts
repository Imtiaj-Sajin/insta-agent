import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
// import { redirect, useRouter } from "next/navigation";//error occurs 1
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const dbUser = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        console.log(dbUser);
        //Verify Password here
        //We are going to use a simple === operator
        //In production DB, passwords should be encrypted using something like bcrypt...
        if (dbUser && dbUser.password === credentials.password) {
          const { password, createdAt,id, ...dbUserWithoutPassword } = dbUser;
          return { ...dbUserWithoutPassword, type: "moderator" } as User;
        }
        // Check in the admin table
        const adminUser = await prisma.admin.findFirst({
          where: { email: credentials.email },
        });

        if (adminUser && adminUser.password === credentials.password) {
          const { password, id, ...adminUserWithoutPassword } = adminUser;
          return { ...adminUserWithoutPassword, type: "admin" } as User;
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  //callbacks added, remove next 7 line safely, deletion will affect midlleware.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.type = user.type; // Add type to token
      }
      return token;
    },
  }
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  
  if (!session) return redirect("/");
}

export function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
    const session = useSession();
    // const router = useRouter();//error occurs 1
    // if (!session) router.push("/");//error occurs 1
  }
}
