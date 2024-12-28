"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

// Test users
const testUsers = [
  {
    id: "1",
    email: "contact@ad.io",
    password: "12345678",
    type: "admin",
  },
  {
    id: "2",
    email: "contact@mod.io",
    password: "12345678",
    type: "moderator",
  },
];

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

// Login function
export async function login(prevState: any, formData: FormData) {
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

    // Redirect based on userType
    if (user.type === "admin") {
      console.log("inside redirect")
      redirect("admin/dashboard");
    } else if (user.type === "moderator") {
      redirect("/moderator/dashboard");
    }
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
