import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { magicLink, emailOTP, twoFactor, passkey } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: process.env.APP_NAME || "My App",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(`Magic link for ${email}: ${url}`);
      }
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(`OTP for ${email} (${type}): ${otp}`);
      }
    }),
    twoFactor(),
    passkey()
  ],
});

export type Session = typeof auth.$Infer.Session;