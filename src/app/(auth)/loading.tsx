import { Loader2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      
      <div className="flex flex-col items-center justify-center z-10 animate-fade-in">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-white/80">Loading...</h3>
      </div>
    </div>
  );
}
