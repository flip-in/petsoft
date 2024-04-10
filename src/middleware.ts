import { nextAuthEdgeConfig } from "./lib/auth-edge";
import NextAuth from "next-auth";

export default NextAuth(nextAuthEdgeConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};