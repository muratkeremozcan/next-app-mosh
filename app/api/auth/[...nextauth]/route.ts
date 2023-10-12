import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

// any GET or POST will get handled by the NextAuth handler
export {handler as GET, handler as POST}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
