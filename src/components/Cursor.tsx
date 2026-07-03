import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const magnetic = t.closest("[data-magnetic]");
      if (ringRef.current) {
        ringRef.current.classList.toggle("scale-[2.2]", !!magnetic);
        ringRef.current.classList.toggle("bg-primary/20", !!magnetic);
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[999] h-8 w-8 rounded-full border border-primary/60 transition-[transform,background-color] duration-200 ease-out mix-blend-difference" />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[1000] h-1.5 w-1.5 rounded-full bg-primary mix-blend-difference" />
    </>
  );
}
