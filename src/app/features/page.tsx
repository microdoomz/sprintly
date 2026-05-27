import Link from "next/link";
import { ArrowLeft, Zap, Layers, Lock, Globe, RefreshCcw, Bell } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-teal-500" />,
      title: "Lightning Fast",
      description: "Built on modern web technologies ensuring rapid load times and smooth interactions."
    },
    {
      icon: <Layers className="w-8 h-8 text-cyan-500" />,
      title: "Seamless Kanban",
      description: "Organize your workflow with intuitive drag-and-drop boards and customizable columns."
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: "Secure by Default",
      description: "Your data is encrypted and protected with enterprise-grade security practices."
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: "Work Anywhere",
      description: "Fully responsive design means Sprintly works perfectly on your desktop, tablet, or phone."
    },
    {
      icon: <RefreshCcw className="w-8 h-8 text-cyan-500" />,
      title: "Real-time Sync",
      description: "Collaborate with your team seamlessly. Changes reflect instantly across all devices."
    },
    {
      icon: <Bell className="w-8 h-8 text-blue-500" />,
      title: "Smart Notifications",
      description: "Stay in the loop without being overwhelmed. Get notified only about what matters to you."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center pt-24 px-4 sm:px-6">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center z-10">
        <Link href="/" className="self-start flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          Everything you need to <span className="gradient-text">ship faster</span>
        </h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl mb-16">
          Sprintly provides a robust set of features designed to eliminate friction and keep your team focused on what matters most: building great products.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-24">
          {features.map((feature, i) => (
            <div key={i} className="glass p-8 rounded-2xl border border-white/5 hover:border-teal-500/30 transition-colors bg-black/20 dark:bg-black/20 light:bg-white/50">
              <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
