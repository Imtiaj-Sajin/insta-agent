// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    type?: string | null;
    id?: number | null;
  }

  interface Session {
    user: User;
  }
}
