//-| File path: lib/auth.ts
import { resend } from "@/lib/email/resend";
import reactResetPasswordEmail from "@/lib/email/reset-password";
import reactVerificationEmail from "@/lib/email/verification";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma-client";

const from = process.env.BETTER_AUTH_EMAIL || "";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailVerification: {
    verificationUrl: process.env.NEXT_PUBLIC_APP_URL,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Verify your email address",
        react: reactVerificationEmail({
          username: user.email,
          verificationLink: url,
        }),
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000"],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = [
            process.env.ADMIN_EMAIL,
            ...(process.env.ADMIN_EMAILS?.split(",").map((email) =>
              email.trim()
            ) || []),
          ].filter(Boolean);

          if (adminEmails.includes(user.email)) {
            return {
              data: {
                ...user,
                role: "admin",
              },
            };
          }
          return { data: user };
        },
        after: async (user) => {
          const adminEmails = [
            process.env.ADMIN_EMAIL,
            ...(process.env.ADMIN_EMAILS?.split(",").map((email) =>
              email.trim()
            ) || []),
          ].filter(Boolean);

          if (adminEmails.includes(user.email)) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "admin" },
            });
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
