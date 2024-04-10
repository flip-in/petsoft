import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";
import { nextAuthEdgeConfig } from "./auth-edge";


const config = {
  ...nextAuthEdgeConfig,
  providers: [
    credentials({
      async authorize(credentials) {
        //runs on login

        //validate the object
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null
        }
      
        // extract values
        const {email, password} = validatedFormData.data
        const user = await getUserByEmail(email)

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
  
} satisfies NextAuthConfig


export const { auth, signIn, signOut, handlers: {GET, POST} } = NextAuth(config)
