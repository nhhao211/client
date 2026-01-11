import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function GlassCard({ className, children, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={hoverEffect ? { scale: 1, y: 0 } : undefined}
      whileHover={hoverEffect ? { scale: 1.02, y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-blue-500/15 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-blue-400/15 dark:bg-slate-950/70",
        "transition-colors hover:bg-white/85 dark:hover:bg-slate-950/85",
        "hover:border-blue-500/25 dark:hover:border-blue-400/25",
        "hover:shadow-xl hover:shadow-blue-500/5",
        className
      )}
      {...props}
    >
      {/* Blue decorative glow blobs */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
