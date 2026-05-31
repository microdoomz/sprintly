"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNavigationStore } from "@/hooks/use-navigation-store";

interface SmartLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function SmartLink({ href, className, children, ...props }: SmartLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const setIsNavigating = useNavigationStore((state) => state.setIsNavigating);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a modified click (Ctrl, Cmd, Shift), let the browser handle it (new tab)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    // If it's the exact same page, don't do anything special
    const currentPath = pathname;
    const targetPath = href.split('?')[0]; // Strip query params for simple comparison
    
    if (currentPath === targetPath) {
      // It might be an anchor link or query param change, just let Next.js handle normally
      return;
    }

    e.preventDefault();
    setIsNavigating(true, href);
    
    // Use transition to avoid blocking the main thread while React prepares the render
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
