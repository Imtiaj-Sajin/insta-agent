// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    type?: string | null;
  }

  interface Session {
    user: User;
  }
}
