import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LayoutDashboard, Zap, Shield, Users, ArrowUpRight, CheckSquare } from "lucide-react";
import { SmartLink } from "@/components/ui/smart-link";
import { TransitionLink } from "@/components/ui/transition-link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-gradient-to-tr from-teal-500 to-cyan-500 p-1.5 rounded-lg shadow-lg group-hover:shadow-teal-500/25 transition-all">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">Sprintly</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <SmartLink href="/" className="hover:text-white transition-colors">Home</SmartLink>
            <SmartLink href="/features" className="hover:text-white transition-colors">Features</SmartLink>
            <SmartLink href="/pricing" className="hover:text-white transition-colors">Pricing</SmartLink>
          </div>
          <div className="flex items-center gap-4">
            <SmartLink href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-0">
              Log In
            </SmartLink>
            <SmartLink href="/register" className="h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white text-black hover:bg-white/90 text-sm font-medium transition-colors">
              Get Started
            </SmartLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-16 px-6 sm:pt-40 sm:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-lg shadow-black/50">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></span>
            <span className="text-xs font-medium text-white/80">Sprintly 2.0 is now live</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl mb-8 selection:bg-teal-500/30">
            Manage work with <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-teal-300 via-cyan-300 to-blue-300">
              Liquid Clarity.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/50 mb-10 leading-relaxed font-light">
            Sprintly brings your team&apos;s tasks, boards, and goals into one unified, beautiful workspace. Built for modern teams who demand performance and aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SmartLink href="/register" className="inline-flex items-center justify-center whitespace-nowrap rounded-full h-14 px-8 text-base bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 transition-all hover:scale-105 font-medium">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </SmartLink>
            <SmartLink href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-full h-14 px-8 text-base border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white transition-all font-medium">
              Sign in
            </SmartLink>
          </div>
        </div>

        {/* Feature Grid - Liquid Glass Cards */}
        <div id="features" className="mx-auto max-w-7xl mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 group">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-teal-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Intuitive Boards</h3>
            <p className="text-white/50 leading-relaxed font-light mb-4">Organize tasks effortlessly with drag-and-drop Kanban boards that adapt to your workflow seamlessly.</p>
            <ul className="space-y-2 text-sm text-white/40">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Custom Tags & Colors</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Drag and Drop UI</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Advanced Filtering</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
              <Users className="h-6 w-6 text-cyan-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Real-time Collaboration</h3>
            <p className="text-white/50 leading-relaxed font-light mb-4">Work together in perfect sync. See updates instantly as your teammates move tasks and make changes.</p>
            <ul className="space-y-2 text-sm text-white/40">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Live WebSocket Sync</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Shared Workspaces</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Activity Timelines</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-black/50 sm:col-span-2 lg:col-span-1 group">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Zap className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">Lightning Fast</h3>
            <p className="text-white/50 leading-relaxed font-light mb-4">Experience a fluid, app-like interface built on modern web technologies for instant responsiveness.</p>
            <ul className="space-y-2 text-sm text-white/40">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Edge Caching</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Instant Navigation</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Optimized Performance</li>
            </ul>
          </div>
        </div>
        

      </main>
    </div>
  );
}
