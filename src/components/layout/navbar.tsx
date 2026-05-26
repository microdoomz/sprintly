"use client";

import { useSession } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Menu } from "lucide-react";
// Mobile sidebar implementation will go here

export function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center p-4 border-b border-border bg-background h-16">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex w-full justify-end items-center gap-4">
        <ThemeToggle />
        {session?.user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
