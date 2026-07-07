import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

export type ScrollStackContextValue = {
  currentIndex: number;
  total: number;
  ids: string[];
  /** Smoothly animates between 0 and 1 as currentIndex changes — for
   * anything (backdrop color, progress bar) that used to read document
   * scroll progress and now needs to read "journey progress" instead. */
  progress: MotionValue<number>;
  goTo: (index: number) => void;
  goToId: (id: string) => void;
};

export const ScrollStackContext = createContext<ScrollStackContextValue | null>(null);

export function useScrollStack() {
  const ctx = useContext(ScrollStackContext);
  if (!ctx) throw new Error("useScrollStack must be used within <ScrollStack>");
  return ctx;
}
