import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center pt-24 px-4 sm:px-6">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center z-10">
        <Link href="/" className="self-start flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          Simple, transparent <span className="gradient-text">pricing</span>
        </h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl mb-16">
          Whether you're a solo developer or a large team, we have a plan that fits your needs. Start for free and upgrade when you're ready.
        </p>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Free Tier */}
          <Card className="glass relative flex flex-col border-white/5 bg-black/20 dark:bg-black/20 light:bg-white/50">
            <CardHeader>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>Perfect for individuals just getting started.</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {["Up to 3 boards", "Basic task management", "1-week activity history", "Community support"].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-3 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="glass relative flex flex-col border-teal-500/30 bg-teal-500/5 shadow-[0_0_30px_rgba(20,184,166,0.1)] scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For professionals and small teams.</CardDescription>
              <div className="mt-4 text-4xl font-bold">$12<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {["Unlimited boards", "Advanced task filtering", "Unlimited activity history", "Priority support", "Custom board colors"].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-3 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full gradient-primary border-0 text-white" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="glass relative flex flex-col border-white/5 bg-black/20 dark:bg-black/20 light:bg-white/50">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For large organizations with complex needs.</CardDescription>
              <div className="mt-4 text-4xl font-bold">Custom</div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {["Everything in Pro", "SSO/SAML integration", "Dedicated success manager", "Custom contracts", "SLA guarantees"].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-3 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="mailto:contact@sprintly.app">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
