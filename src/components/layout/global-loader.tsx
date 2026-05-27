"use client";

import { useNavigationStore } from "@/hooks/use-navigation-store";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function GlobalLoader() {
  const isNavigating = useNavigationStore((state) => state.isNavigating);
  const navigatingTo = useNavigationStore((state) => state.navigatingTo);
  const setIsNavigating = useNavigationStore((state) => state.setIsNavigating);
  const [show, setShow] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Clear navigation state whenever the URL changes
  useEffect(() => {
    setIsNavigating(false, null);
  }, [pathname, searchParams, setIsNavigating]);

  // Debounce the showing slightly to avoid flashing for very fast transitions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isNavigating) {
      setShow(true);
    } else {
      timeoutId = setTimeout(() => {
        setShow(false);
      }, 50); // Small delay to prevent jitter
    }
    return () => clearTimeout(timeoutId);
  }, [isNavigating]);

  if (!show) return null;

  // Determine what type of skeleton to show based on the URL
  const isDashboard = navigatingTo?.includes("/dashboard") || navigatingTo?.includes("/boards") || navigatingTo?.includes("/settings");
  
  if (isDashboard) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex flex-col w-64 h-full bg-card border-r border-border p-4">
          <div className="h-8 w-32 bg-primary/20 rounded-md animate-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-primary/10 rounded-lg animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar Skeleton */}
          <div className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center px-4 sm:px-6 lg:px-8 justify-between">
            <div className="h-6 w-48 bg-primary/20 rounded-md animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="h-10 w-64 bg-primary/20 rounded-lg animate-pulse mb-8" />
            
            {navigatingTo?.includes("/boards") ? (
              <div className="flex gap-6 h-[calc(100vh-200px)]">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
                    <div className="h-6 w-32 bg-primary/20 rounded-md animate-pulse" />
                    <div className="h-24 w-full bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-24 w-full bg-primary/10 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 bg-black/20 border border-white/5 rounded-xl p-6 flex flex-col justify-between">
                    <div className="h-6 w-1/2 bg-primary/20 rounded-md animate-pulse" />
                    <div className="h-4 w-3/4 bg-primary/10 rounded-md animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generic Auth/Landing Page Skeleton
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md">
        <div className="h-4 w-24 bg-primary/20 rounded-md animate-pulse mb-6" />
        <div className="glass border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl rounded-xl p-6">
          <div className="h-8 w-48 bg-primary/20 rounded-md animate-pulse mb-4" />
          <div className="h-4 w-full bg-primary/10 rounded-md animate-pulse mb-8" />
          
          <div className="space-y-4">
            <div>
              <div className="h-4 w-16 bg-primary/20 rounded-md animate-pulse mb-2" />
              <div className="h-10 w-full bg-black/20 border border-white/10 rounded-md animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-24 bg-primary/20 rounded-md animate-pulse mb-2" />
              <div className="h-10 w-full bg-black/20 border border-white/10 rounded-md animate-pulse" />
            </div>
            <div className="h-10 w-full bg-teal-500/30 rounded-md animate-pulse mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
