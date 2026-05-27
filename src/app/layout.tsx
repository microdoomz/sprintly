import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { GlobalLoader } from "@/components/layout/global-loader";
import { Prefetcher } from "@/components/layout/prefetcher";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprintly | Modern Task Management",
  description: "A beautiful, performant task management app for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalLoader />
          <Prefetcher />
          {/* Dynamic Animated Background - Global */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
            <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-teal-600/10 blur-[120px] rounded-full animate-pulse-slow dark:mix-blend-screen" />
            <div className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse-slow dark:mix-blend-screen" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow dark:mix-blend-screen" style={{ animationDelay: '4s' }} />
          </div>
          <div className="relative z-0">
            {children}
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
