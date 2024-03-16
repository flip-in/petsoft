import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    credentials({
      async authorize(credentials) {
        // runs on login
        const {email, password} = credentials
        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if (!user) {
          console.log('no user found')
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword)

        if (!passwordsMatch) {
          console.log('Invalid credentials')
          return null
        }
        return user;
      }
    })
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user)
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app')

      if (!isLoggedIn && isTryingToAccessApp) {
        return false
      } 

      if (isLoggedIn && isTryingToAccessApp) {
        return true
      }

      if (!isTryingToAccessApp) {
        return true
      }
    }
  }
} satisfies NextAuthConfig


export const { auth, signIn, signOut } = NextAuth(config)
