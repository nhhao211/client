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
      whileHover={hoverEffect ? { scale: 1.02, translateY: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "clay-card relative overflow-hidden transition-all duration-300",
        // Default to white/card-color, but allow overrides. 
        // Note: clay-card in globals usually has !important bg, so overrides might need !important or inline styles.
        // We'll trust the global clay-card class for the base look.
        "p-6", 
        hoverEffect && "cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
