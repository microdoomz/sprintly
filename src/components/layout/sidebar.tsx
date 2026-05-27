"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CheckSquare, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Boards",
    icon: CheckSquare,
    href: "/boards",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      isMobile ? "flex w-full" : "hidden md:flex",
      !isMobile && (isCollapsed ? "w-16" : "w-64")
    )}>
      <div className="px-3 py-2 flex-1 flex flex-col">
        {/* Brand Header & Toggle */}
        <div className={cn("flex items-center justify-between mb-8 transition-all duration-300", (!isMobile && isCollapsed) ? "flex-col justify-center gap-4 pl-0" : "px-3")}>
          <Link href="/dashboard" className="flex items-center">
            <div className={cn(
              "relative h-8 w-8 bg-primary rounded-md flex items-center justify-center shrink-0 transition-all duration-300",
              (!isMobile && isCollapsed) ? "" : "mr-4"
            )}>
              <CheckSquare className="text-white h-5 w-5" />
            </div>
            {(isMobile || !isCollapsed) && (
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-fade-in whitespace-nowrap">
                Sprintly
              </h1>
            )}
          </Link>

          {!isMobile && (
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer shrink-0"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Routes */}
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition hover:text-primary hover:bg-primary/10",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
                  (!isMobile && isCollapsed) ? "justify-center" : "justify-start"
                )}
              >
                <div className={cn("flex items-center", (!isMobile && isCollapsed) ? "justify-center" : "flex-1")}>
                  <route.icon className={cn("h-5 w-5 shrink-0 transition-all duration-300", (!isMobile && isCollapsed) ? "" : "mr-3", route.color)} />
                  {(isMobile || !isCollapsed) && <span className="truncate">{route.label}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout button */}
      <div className="px-3 py-2 mt-auto">
        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          className={cn(
            "w-full text-muted-foreground hover:text-primary cursor-pointer",
            (!isMobile && isCollapsed) ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className={cn("h-5 w-5 shrink-0", (!isMobile && isCollapsed) ? "" : "mr-3")} />
          {(isMobile || !isCollapsed) && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  );
}
