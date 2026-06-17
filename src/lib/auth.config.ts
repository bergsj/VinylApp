import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.startsWith("/login");
      const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
      if (isApiAuth) return true;
      if (isLoginPage) return isLoggedIn ? Response.redirect(new URL("/collection", nextUrl)) : true;
      return isLoggedIn;
    },
  },
};
