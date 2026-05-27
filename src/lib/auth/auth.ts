import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    passwordReset: {
      async sendResetPassword({ url, user }) {
        try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Sprintly <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your Sprintly password",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #0d9488; font-size: 24px; margin: 0;">Sprintly</h1>
              </div>
              <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Reset your password</h2>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                We received a request to reset your password. Click the button below to choose a new password.
              </p>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${url}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
                If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
              </p>
            </div>
          `,
        });
        console.log(`Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error("Failed to send reset email via Resend:", error);
        // Also log the URL to terminal as fallback
        console.log(`\nFallback - PASSWORD RESET LINK FOR ${user.email}: ${url}\n`);
      }
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
