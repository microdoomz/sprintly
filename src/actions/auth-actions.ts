"use server";

import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function checkEmailAuthMethod(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { exists: false, hasPassword: false };
    }

    // Find if there is an email-password credential provider account for this user
    const emailAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, user.id),
        eq(accounts.providerId, "credential")
      )
    });

    return {
      exists: true,
      hasPassword: !!emailAccount,
    };
  } catch (error) {
    console.error("Error checking email auth method:", error);
    return { exists: false, hasPassword: false, error: true };
  }
}
