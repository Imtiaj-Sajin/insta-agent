import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { pool } from "../database/dbc";  // Import your MySQL connection pool

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) return null;

        try {
          // Query the user table in MySQL
          const [userRows]: any[] = await pool.promise().query(
            "SELECT * FROM user WHERE email = ?",
            [credentials.email]
          );
          const dbUser = userRows[0];

          if (dbUser) {
            // Verify the hashed password
            const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.password);
            if (isPasswordValid) {
              const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser;
              return { ...dbUserWithoutPassword, type: "moderator" } as User; // Return user without password
            }
          }

          // Check in the admin table in MySQL
          const [adminRows]: any[] = await pool.promise().query(
            "SELECT * FROM admin WHERE email = ?",
            [credentials.email]
          );
          const adminUser = adminRows[0];

          if (adminUser) {
            // Verify the hashed password
            const isPasswordValid = await bcrypt.compare(credentials.password, adminUser.password);
            if (isPasswordValid) {
              const { password, ...adminUserWithoutPassword } = adminUser;
              return { ...adminUserWithoutPassword, type: "admin" } as User; // Return admin without password
            }
          }

          return null; // If neither user nor admin, return null
        } catch (error) {
          console.error("Error in authorization:", error);
          return null; // Return null in case of an error during query
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        try {
          const email = token.email || "";

          // Check if the email exists in the admin table
          const [adminRows]: any[] = await pool.promise().query(
            "SELECT * FROM admin WHERE email = ?",
            [email]
          );
          const adminUser = adminRows[0];

          if (adminUser) {
            token.type = "admin";
            token.id = adminUser.id;
          } else {
            // Check if the email exists in the user table
            const [userRows]: any[] = await pool.promise().query(
              "SELECT * FROM user WHERE email = ?",
              [email]
            );
            const dbUser = userRows[0];

            if (dbUser) {
              token.type = "moderator";
            } else {
              return null; // If no user or admin found, return null
            }
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          return null; // Return null in case of error during JWT callback
        }
      } else {
        if (user) {
          token.type = user.type;
          token.id = user.id;
        }
        return token;
      }

      return token;
    },
  },
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/");
}

// export function loginIsRequiredClient() { // Uncomment and fix the client-side login logic if needed
//   if (typeof window !== "undefined") {
//     const session = useSession();
//     // const router = useRouter();
//     // if (!session) router.push("/");
//   }
// }
