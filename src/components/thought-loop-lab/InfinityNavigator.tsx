import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { FocusPayload, LoopStage, ThoughtLoop } from "./types";

type InfinityNavigatorProps = {
  loop: ThoughtLoop;
  selectedStage?: LoopStage;
  onFocus: (payload: FocusPayload) => void;
};

const INFINITY_PATH =
  "M 120 190 C 120 112 242 112 304 190 C 366 268 488 268 488 190 C 488 112 366 112 304 190 C 242 268 120 268 120 190";

function getInfinityPoint(t: number) {
  const theta = t * Math.PI * 2;
  const x = 304 + Math.sin(theta) * 184;
  const y = 190 + Math.sin(theta) * Math.cos(theta) * 94;
  return { x, y };
}

function InfinityNavigator({ loop, selectedStage, onFocus }: InfinityNavigatorProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const progressRef = useRef(0);
  const idBase = useId().replace(/:/g, "");
  const pathGlowId = `${idBase}-pathglow`;
  const [broken, setBroken] = useState(false);
  const orbX = useMotionValue(304);
  const orbY = useMotionValue(190);

  const nodeStops = useMemo(
    () =>
      [0.02, 0.17, 0.31, 0.54, 0.77, 0.91].map((stop, index) => {
        const point = getInfinityPoint(stop);
        const stage = loop.nodes[index]?.label ?? "Trigger";
        return {
          id: `${loop.id}-node-${index}`,
          stage,
          x: point.x,
          y: point.y,
          label: loop.nodes[index]?.label ?? stage,
        };
      }),
    [loop]
  );

  useAnimationFrame((_, delta) => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const speed = broken ? -0.00016 : 0.000085;
    progressRef.current = (progressRef.current + delta * speed + 1) % 1;
    const point = path.getPointAtLength(progressRef.current * total);
    orbX.set(point.x);
    orbY.set(point.y);
  });

  useEffect(() => {
    if (!broken) return undefined;
    const timeout = window.setTimeout(() => setBroken(false), 850);
    return () => window.clearTimeout(timeout);
  }, [broken]);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(122,95,255,0.2),rgba(7,11,24,0)_54%)]" />
      <svg viewBox="0 0 608 380" className="relative z-10 h-full w-full">
        <defs>
          <filter id={pathGlowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`${idBase}-stroke`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#5ad2d6" />
            <stop offset="50%" stopColor="#8b76ed" />
            <stop offset="100%" stopColor="#d38db7" />
          </linearGradient>
        </defs>

        <motion.path
          ref={pathRef}
          d={INFINITY_PATH}
          fill="none"
          stroke={`url(#${idBase}-stroke)`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${pathGlowId})`}
          animate={{ opacity: broken ? 0.28 : 0.88 }}
          transition={{ duration: 0.35 }}
        />

        {nodeStops.map((node) => {
          const active = selectedStage === node.stage;
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={active ? 9 : 6.5}
                fill={active ? "rgba(240,244,255,0.96)" : "rgba(177, 194, 233, 0.6)"}
                onMouseEnter={() => onFocus({ loopId: loop.id, stage: node.stage })}
                onClick={() => onFocus({ loopId: loop.id, stage: node.stage })}
                className="cursor-pointer"
              />
            </g>
          );
        })}

        <motion.circle
          style={{ cx: orbX, cy: orbY }}
          r={5.5}
          fill="rgba(245, 248, 255, 0.95)"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <button
        type="button"
        onClick={() => setBroken(true)}
        className="absolute bottom-4 left-4 rounded-lg border border-violet-300/35 bg-violet-400/10 px-3 py-1.5 text-xs tracking-[0.08em] text-violet-100"
      >
        Break the Loop
      </button>
    </div>
  );
}

export default memo(InfinityNavigator);
