import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * A fixed, sticky background that morphs its color, fog, and light rays as the
 * user scrolls the whole page. Combined with a persistent drifting particle field,
 * it makes every section feel like part of one continuous journey.
 */
export function JourneyBackdrop() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  // Cinematic palette per chapter (0 dawn → 1 night invitation)
  const bg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1],
    [
      "radial-gradient(120% 80% at 50% 20%, oklch(0.24 0.05 240) 0%, oklch(0.08 0.02 260) 60%, #050914 100%)",
      "radial-gradient(120% 80% at 30% 40%, oklch(0.28 0.08 60) 0%, oklch(0.10 0.03 250) 60%, #060a15 100%)",
      "radial-gradient(120% 80% at 70% 40%, oklch(0.26 0.07 30) 0%, oklch(0.09 0.03 240) 60%, #05080f 100%)",
      "radial-gradient(120% 80% at 40% 60%, oklch(0.28 0.10 160) 0%, oklch(0.08 0.03 220) 60%, #04070d 100%)",
      "radial-gradient(120% 80% at 60% 40%, oklch(0.30 0.09 45) 0%, oklch(0.10 0.03 260) 60%, #05070f 100%)",
      "radial-gradient(120% 80% at 50% 30%, oklch(0.22 0.06 300) 0%, oklch(0.08 0.03 260) 60%, #04060d 100%)",
      "radial-gradient(120% 80% at 50% 20%, oklch(0.20 0.06 220) 0%, oklch(0.06 0.02 260) 60%, #03050c 100%)",
    ],
  );

  const rayRotate = useTransform(scrollYProgress, [0, 1], [-8, 22]);
  const rayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.55, 0.25]);
  const fogY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const horizonY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div style={{ background: bg }} className="absolute inset-0" />

      {/* Light rays */}
      <motion.div
        style={{ rotate: rayRotate, opacity: rayOpacity }}
        className="absolute -left-1/2 -top-1/3 h-[200vh] w-[200vw] mix-blend-screen"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 30%, transparent 0deg, oklch(0.78 0.14 85 / 0.18) 20deg, transparent 45deg, transparent 180deg, oklch(0.78 0.17 220 / 0.14) 205deg, transparent 235deg, transparent 360deg)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Fog layers */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-x-0 top-0 h-[140vh] opacity-70"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(80% 40% at 50% 60%, oklch(0.78 0.10 220 / 0.10), transparent 70%), radial-gradient(60% 30% at 20% 80%, oklch(0.85 0.10 60 / 0.10), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </motion.div>

      {/* Parallax horizon silhouettes */}
      <motion.svg
        style={{ y: horizonY }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[35vh] w-full opacity-40"
      >
        <path
          d="M0 220 L120 200 L240 240 L360 180 L480 220 L600 190 L720 230 L840 200 L960 240 L1080 210 L1200 230 L1200 300 L0 300 Z"
          fill="oklch(0.10 0.03 240)"
        />
        <path
          d="M0 260 L200 240 L400 270 L600 245 L800 275 L1000 250 L1200 270 L1200 300 L0 300 Z"
          fill="oklch(0.06 0.02 240)"
        />
      </motion.svg>

      {/* Particle field */}
      {!reduce && <ParticleField />}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgba(0,0,0,0.55))]" />
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const count = isMobile ? 18 : window.innerWidth < 1024 ? 45 : 80;
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 1.4 + 0.3) * dpr,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: -(Math.random() * 0.25 + 0.05) * dpr,
      a: Math.random() * 0.6 + 0.2,
    }));

    // Throttle to 30fps on mobile — enough for drift, half the paint cost.
    const minFrame = isMobile ? 33 : 0;
    let last = 0;
    // Pause drawing while the user is actively scrolling fast; resume shortly after.
    let scrollBusy = false;
    let scrollTimer = 0;
    const onScroll = () => {
      scrollBusy = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrollBusy = false;
      }, 120);
    };
    if (isMobile) window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (scrollBusy) return;
      if (minFrame && t - last < minFrame) return;
      last = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(180,220,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    tick(0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  if (!ready) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />;
}
