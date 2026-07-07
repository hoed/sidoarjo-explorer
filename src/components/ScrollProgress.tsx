import { motion, useSpring } from "framer-motion";
import { useScrollStack } from "@/lib/scroll-stack-context";

export function ScrollProgress() {
  const { progress: scrollYProgress } = useScrollStack();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-gradient-to-r from-primary via-accent to-primary"
    />
  );
}
