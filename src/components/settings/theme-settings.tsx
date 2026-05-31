"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
          <Sun className="mr-2 h-4 w-4" /> Light
        </Button>
        <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
          <Moon className="mr-2 h-4 w-4" /> Dark
        </Button>
        <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
          <Monitor className="mr-2 h-4 w-4" /> System
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        className={`w-full justify-start ${theme === 'light' ? 'border-primary bg-primary/5' : ''}`}
        onClick={() => setTheme('light')}
      >
        <Sun className="mr-2 h-4 w-4" /> Light
      </Button>
      <Button 
        variant="outline" 
        className={`w-full justify-start ${theme === 'dark' ? 'border-primary bg-primary/5' : ''}`}
        onClick={() => setTheme('dark')}
      >
        <Moon className="mr-2 h-4 w-4" /> Dark
      </Button>
      <Button 
        variant="outline" 
        className={`w-full justify-start ${theme === 'system' ? 'border-primary bg-primary/5' : ''}`}
        onClick={() => setTheme('system')}
      >
        <Monitor className="mr-2 h-4 w-4" /> System
      </Button>
    </div>
  );
}
