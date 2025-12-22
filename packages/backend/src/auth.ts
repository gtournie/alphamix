import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "infrastructure/database";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: ["http://localhost:5173"],
  session: {
    expiresIn: 604800, // 7 days
    updateAge: 86400, // 1 day
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // redirectURI: "http://localhost:5173/auth/callback/google"
    },
  },
  advanced: {
    database: {
      generateId: false// () => uuidv4(),
    }
  },
});