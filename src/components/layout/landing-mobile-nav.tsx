"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SmartLink } from "@/components/ui/smart-link";
import { useState } from "react";

export function LandingMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -mr-2 text-white/70 hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[300px] bg-black/95 border-l border-white/10 p-6 backdrop-blur-xl">
        <SheetTitle className="text-white mb-8">Navigation</SheetTitle>
        <div className="flex flex-col gap-6 text-base font-medium text-white/70">
          <SmartLink href="/" className="hover:text-white transition-colors" onClick={() => setOpen(false)}>Home</SmartLink>
          <SmartLink href="/features" className="hover:text-white transition-colors" onClick={() => setOpen(false)}>Features</SmartLink>
          <SmartLink href="/pricing" className="hover:text-white transition-colors" onClick={() => setOpen(false)}>Pricing</SmartLink>
          
          <div className="h-px bg-white/10 w-full my-2"></div>
          
          <SmartLink href="/login" className="hover:text-white transition-colors" onClick={() => setOpen(false)}>
            Log In
          </SmartLink>
          <SmartLink href="/register" className="h-12 w-full inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 font-medium transition-colors mt-2" onClick={() => setOpen(false)}>
            Get Started
          </SmartLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
