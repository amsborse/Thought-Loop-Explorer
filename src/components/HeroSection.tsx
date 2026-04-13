import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import InfinityLuminousSymbol from "./InfinityLuminousSymbol";

type HeroSectionProps = {
  onExplore: () => void;
};

export default function HeroSection({ onExplore }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.3], [0, 110]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, 32]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const stageX = useSpring(tiltX, { stiffness: 70, damping: 24, mass: 0.8 });
  const stageY = useSpring(tiltY, { stiffness: 70, damping: 24, mass: 0.8 });

  function handleStageMove(event: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-y * 6);
    tiltY.set(x * 8);
  }

  function handleStageLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 px-4 pb-18 pt-10 md:pb-22 md:pt-14">
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
          background:
            "radial-gradient(circle at 24% 18%, rgba(45, 212, 191, 0.11), transparent 44%), radial-gradient(circle at 78% 24%, rgba(109, 88, 233, 0.18), transparent 46%), linear-gradient(180deg, #061110 0%, #030607 63%, #010202 100%)",
        }}
      />
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(125,96,234,0.10),rgba(8,12,14,0)_36%),radial-gradient(circle_at_50%_96%,rgba(0,0,0,0.42),transparent_56%)]" />

      <div className="relative z-10 mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(340px,1fr)_minmax(560px,1.34fr)] lg:gap-12">
        <motion.div
          className="order-2 max-w-xl lg:order-1"
          style={{ y: contentY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-teal-100/65">Thought Architecture</p>
          <h1 className="text-balance bg-gradient-to-b from-white via-white to-white/68 bg-clip-text text-4xl font-semibold leading-[1.06] text-transparent md:text-6xl">
            The Architecture of Consequence
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/72 md:text-lg">
            Every thought bends a future. See the loop before it becomes identity, then shift the moment where
            awareness creates choice.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Cause</span>
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Pattern</span>
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Consequence</span>
          </div>

          <motion.button
            type="button"
            onClick={onExplore}
            className="mt-10 rounded-full border border-white/22 bg-white/[0.07] px-8 py-3 text-sm font-medium tracking-[0.03em] text-white shadow-[0_12px_35px_rgba(5,8,10,0.45)] backdrop-blur-lg"
            whileHover={{ y: -2, borderColor: "rgba(223, 228, 255, 0.4)" }}
            whileTap={{ scale: 0.985 }}
          >
            Explore the Loop
          </motion.button>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.08, ease: "easeOut" }}
        >
          <motion.div
            onMouseMove={handleStageMove}
            onMouseLeave={handleStageLeave}
            style={shouldReduceMotion ? undefined : { rotateX: stageX, rotateY: stageY }}
            className="group relative mx-auto w-full max-w-4xl [perspective:1800px]"
          >
            <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_50%,rgba(102,82,196,0.17),rgba(9,13,16,0)_62%)] blur-2xl" />
            <div className="sacred-grid absolute inset-0 rounded-[2.4rem] opacity-30" />

            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/14 bg-[linear-gradient(150deg,rgba(255,255,255,0.11)_0%,rgba(190,205,222,0.035)_35%,rgba(101,92,157,0.055)_70%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_30px_90px_rgba(2,5,7,0.7),inset_0_1px_0_rgba(248,250,252,0.18)] backdrop-blur-[12px] md:p-8">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/48 to-transparent" />
              <div className="pointer-events-none absolute inset-x-14 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="pointer-events-none absolute -left-14 top-1/2 h-[35%] w-[28%] -translate-y-1/2 rounded-full bg-teal-300/10 blur-[48px]" />
              <div className="pointer-events-none absolute -right-12 top-[36%] h-[42%] w-[26%] -translate-y-1/2 rounded-full bg-violet-300/14 blur-[52px]" />

              <InfinityLuminousSymbol className="mx-auto max-w-[1120px]" />

              <div className="pointer-events-none absolute left-6 top-7 rounded-full border border-white/14 bg-white/[0.035] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                awareness
              </div>
              <div className="pointer-events-none absolute bottom-6 right-6 rounded-full border border-white/14 bg-white/[0.035] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                integration
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
