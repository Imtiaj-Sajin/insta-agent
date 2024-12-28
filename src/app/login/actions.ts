"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Test users
const testUsers = [
  {
    id: "1",
    email: "contact@ad.io",
    password: "1",
    type: "admin",
  },
  {
    id: "2",
    email: "contact@mod.io",
    password: "2",
    type: "moderator",
  },
];

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(1, { message: "Password must be at least 8 characters" })
    .trim(),
});

// Login function
export async function login(prevState: any, formData: FormData) {
  console.log("inside login function")
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  // Find user by email and password
  const user = testUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    await createSession(user.id);
    console.log("creating sesiion")

    return {
      success: true,
      redirectTo: user.type === "admin" ? "/admin/dashboard" : "/moderator/dashboard",
    };
  } else {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }
}

// Logout function
export async function logout() {
  await deleteSession();
  redirect("/login");
}
