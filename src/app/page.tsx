import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20">
      <main className="flex flex-col items-center gap-8 max-w-3xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Sprintly
          </h1>
          <p className="text-xl text-muted-foreground">
            A powerful, modern task management platform for teams.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
