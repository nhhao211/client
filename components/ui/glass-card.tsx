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
      whileHover={hoverEffect ? { scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-sm dark:shadow-lg",
        "transition-all duration-200 hover:shadow-md dark:hover:shadow-xl",
        "hover:border-gray-300/70 dark:hover:border-white/20",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Subtle decorative glow blobs - lighter and more subtle */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/3 dark:bg-blue-500/5 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/3 dark:bg-cyan-500/5 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
