"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";

export function Prefetcher() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Aggressive prefetching for all common routes
    const routesToPrefetch = [
      "/login",
      "/register",
      "/forgot-password",
      "/pricing",
      "/features"
    ];

    routesToPrefetch.forEach((route) => {
      router.prefetch(route);
    });

    // Prefetch authenticated routes if user is likely logged in
    if (session?.user) {
      router.prefetch("/dashboard");
      router.prefetch("/boards");
      router.prefetch("/settings");
      // Note: We can't easily prefetch specific board IDs here without fetching them first,
      // but the layout and board listing will be heavily cached now.
    }
  }, [router, session?.user]);

  return null;
}
