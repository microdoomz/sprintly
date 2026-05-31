"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";

export function Prefetcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // Only run on the client
    if (typeof window === "undefined") return;

    // Stagger prefetches to avoid flooding the server and blocking the initial load
    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    const schedulePrefetch = (route: string, delay: number) => {
      const execute = () => {
        if (pathname !== route) {
          router.prefetch(route);
        }
      };

      if ("requestIdleCallback" in window) {
        setTimeout(() => {
          (window as any).requestIdleCallback(execute);
        }, delay);
      } else {
        setTimeout(execute, delay + 500); // Add a bit more delay if no requestIdleCallback
      }
    };

    // If user is NOT logged in, prefetch public auth pages
    if (!session?.user) {
      schedulePrefetch("/login", 1000); // wait 1s after initial load
      schedulePrefetch("/register", 2000); // wait 2s
      schedulePrefetch("/pricing", 3000);
      schedulePrefetch("/features", 4000);
    } 
    // If user IS logged in, prefetch dashboard/app routes
    else {
      // Don't prefetch dashboard if we are already there
      if (!pathname?.startsWith("/dashboard")) {
        schedulePrefetch("/dashboard", 1000);
      }
      if (!pathname?.startsWith("/boards")) {
        schedulePrefetch("/boards", 2000);
      }
      if (!pathname?.startsWith("/settings")) {
        schedulePrefetch("/settings", 3000);
      }
    }
  }, [router, session?.user, pathname]);

  return null;
}
