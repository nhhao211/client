import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background/50 backdrop-blur-sm">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
}
