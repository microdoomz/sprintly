"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";

interface TransitionLinkProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, className, variant, size, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Reset navigating state when the pathname changes (navigation completes)
    setIsNavigating(false);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === href) return;
    
    setIsNavigating(true);
    startTransition(() => {
      router.push(href);
    });
  };

  const showLoader = isPending || isNavigating;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className, showLoader && "opacity-80 pointer-events-none")}
      onClick={handleClick}
      disabled={showLoader || props.disabled}
      {...props}
    >
      {showLoader ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
