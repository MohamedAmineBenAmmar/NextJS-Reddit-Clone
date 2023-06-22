import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define some next auth specific types
type UserId = string;

// Declaring the skeleton of the jwt
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

// Adding the id and username to the session
declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    };
  }
}
