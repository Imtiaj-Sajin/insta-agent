import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt"
// import { redirect, useRouter } from "next/navigation";//error occurs 1
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { pool } from "../database/dbc";  // Import your MySQL connection pool

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

        if (dbUser) {
          // Verify the hashed password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );
    
          if (isPasswordValid) {
            const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser;
            return { ...dbUserWithoutPassword, type: "moderator" } as User; // Return user without password
          }
        }
        // Check in the admin table
        const adminUser = await prisma.admin.findFirst({
          where: { email: credentials.email },
        });
    
        if (adminUser) {
          // Verify the hashed password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            adminUser.password
          );
    
          if (isPasswordValid) {
            const { password, ...adminUserWithoutPassword } = adminUser;
            return { ...adminUserWithoutPassword, type: "admin" } as User; // Return admin without password
          }
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
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.type = user.type; // Add type to token
    //   }
    //   return token;
    // },
    async jwt({ token, account, user }) {//check for errors
      if (account?.provider === "google") {
        // Get the email from the Google profile
        const email = token.email||"";

        // Check if the email exists in the admin table
        const adminUser = await prisma.admin.findFirst({ where: { email } });
        if (adminUser) {
          token.type = "admin";
          token.id = adminUser.id;
        } else {       
          const dbUser = await prisma.user.findFirst({ where: { email } });
          if (dbUser) {
            token.type = "moderator";
          } else {
            return null; 
          }
        }
      }else{
          if (user) {
            token.type = user.type; 
            token.id = user.id; 
          }
          return token;
        }

      return token;
    },
  }
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  
  if (!session) return redirect("/");
}

// export function loginIsRequiredClient() { //probaly this function is causing hydration error
//   if (typeof window !== "undefined") {
//     const session = useSession();
//     // const router = useRouter();//error occurs 1
//     // if (!session) router.push("/");//error occurs 1
//   }
//}