import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, LayoutDashboard, Users, Zap, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-violet-600/30 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-fuchsia-600/30 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-sky-600/30 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '4s' }} />
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1.5 rounded-lg shadow-lg group-hover:shadow-violet-500/25 transition-all">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">Sprintly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log In
            </Link>
            <Button asChild size="sm" className="rounded-full bg-white text-black hover:bg-white/90">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-16 px-6 sm:pt-40 sm:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-lg shadow-black/50">
            <span className="flex h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"></span>
            <span className="text-xs font-medium text-white/80">Sprintly 2.0 is now live</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl mb-8 selection:bg-violet-500/30">
            Manage work with <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-violet-300 via-fuchsia-300 to-sky-300">
              Liquid Clarity.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/50 mb-10 leading-relaxed font-light">
            Sprintly brings your team&apos;s tasks, boards, and goals into one unified, beautiful workspace. Built for modern teams who demand performance and aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full h-14 px-8 text-base bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 transition-all hover:scale-105">
              <Link href="/register">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white transition-all">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid - Liquid Glass Cards */}
        <div className="mx-auto max-w-7xl mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 group">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Intuitive Boards</h3>
            <p className="text-white/50 leading-relaxed font-light">Organize tasks effortlessly with drag-and-drop Kanban boards that adapt to your workflow seamlessly.</p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 group">
            <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 transition-colors">
              <Users className="h-6 w-6 text-fuchsia-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Real-time Sync</h3>
            <p className="text-white/50 leading-relaxed font-light">Work together in perfect sync. See updates instantly as your teammates move tasks and make changes.</p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 sm:col-span-2 lg:col-span-1 group">
            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
              <Zap className="h-6 w-6 text-sky-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Lightning Fast</h3>
            <p className="text-white/50 leading-relaxed font-light">Experience a fluid, app-like interface built on modern web technologies for instant responsiveness.</p>
          </div>
        </div>
        
        {/* App Preview Mockup */}
        <div className="mx-auto max-w-5xl mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl -z-10" />
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-2 sm:p-4 backdrop-blur-3xl shadow-2xl shadow-black/80">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 bg-black/60 shadow-inner">
              {/* Fake App Header */}
              <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-md text-xs text-white/50 border border-white/5 shadow-inner">
                  <Layout className="w-3 h-3" />
                  sprintly.app
                </div>
              </div>
              {/* Fake App Body */}
              <div className="h-[300px] sm:h-[500px] flex p-4 sm:p-6 gap-6 relative bg-gradient-to-br from-black to-neutral-900/50">
                 <div className="w-48 hidden sm:flex flex-col gap-3">
                    <div className="h-8 rounded-md bg-white/5 w-full border border-white/5" />
                    <div className="h-8 rounded-md bg-white/5 w-3/4 border border-white/5" />
                    <div className="h-8 rounded-md bg-white/5 w-5/6 border border-white/5" />
                 </div>
                 <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="h-6 w-24 bg-white/10 rounded-md mb-2" />
                      <div className="h-24 bg-white/5 border border-white/5 rounded-xl shadow-lg" />
                      <div className="h-32 bg-white/5 border border-white/5 rounded-xl shadow-lg" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="h-6 w-24 bg-white/10 rounded-md mb-2" />
                      <div className="h-40 bg-white/5 border border-white/5 rounded-xl shadow-lg" />
                      <div className="h-20 bg-white/5 border border-white/5 rounded-xl shadow-lg" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3 hidden md:flex">
                      <div className="h-6 w-24 bg-white/10 rounded-md mb-2" />
                      <div className="h-28 bg-white/5 border border-white/5 rounded-xl shadow-lg" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
