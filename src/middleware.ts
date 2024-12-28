import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/admin/dashboard", "/moderator/dashboard"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("req:", req)
  console.log("req.nextUrl:", req.nextUrl)

  console.log("req.nextUrl.pathname:", path)
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log(session);

  if (isProtectedRoute && !session?.userId) {
    console.log("Redirecting to login: Unauthorized access to protected route");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Allow accessing the login route, even if the user is already logged in
  if (path === "/login") {
    console.log("Accessing login route");
    console.log(NextResponse.next())
    return NextResponse.next();
  }

  if (publicRoutes.includes(path) && session?.userId) {
    console.log("Redirecting logged-in user based on userType");
    const redirectPath =
      session.userType === "admin"
        ? "/admin/dashboard"
        : session.userType === "moderator"
        ? "/moderator/dashboard"
        : "/";

    return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
  }
    // Ensure users cannot access routes that don't match their role
    if (session?.userType === "admin" && path === "/moderator/dashboard") {
      console.log("Admin trying to access moderator dashboard, redirecting...");
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
  
    if (session?.userType === "moderator" && path === "/admin/dashboard") {
      console.log("Moderator trying to access admin dashboard, redirecting...");
      return NextResponse.redirect(new URL("/moderator/dashboard", req.nextUrl));
    }

  return NextResponse.next();
}
