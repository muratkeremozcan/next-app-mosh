import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// export the options so we can use them
// to access the session at the server, at Home component
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
}

const handler = NextAuth(authOptions)

// any GET or POST will get handled by the NextAuth handler
export {handler as GET, handler as POST}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
