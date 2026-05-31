"use server";

import { db } from "@/lib/db";
import { userAvatars, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAvatar(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF." };
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File too large. Maximum size is 2MB." };
  }

  try {
    // Convert to base64 data URL for simple storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    // Store massive base64 in the dedicated user_avatars table
    await db
      .insert(userAvatars)
      .values({ userId: session.user.id, data: dataUrl })
      .onConflictDoUpdate({
        target: userAvatars.userId,
        set: { data: dataUrl }
      });

    // Store only the tiny API URL in the users table so get-session stays fast!
    const avatarApiUrl = `/api/users/${session.user.id}/avatar`;
    await db
      .update(users)
      .set({ image: avatarApiUrl })
      .where(eq(users.id, session.user.id));

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true, imageUrl: avatarApiUrl };
  } catch (error: any) {
    console.error("Failed to update avatar:", error);
    return { error: "Failed to update avatar. Please try again." };
  }
}

export async function updateProfile(name: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Name cannot be empty" };
  }

  try {
    await db
      .update(users)
      .set({ name: name.trim() })
      .where(eq(users.id, session.user.id));

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile." };
  }
}
