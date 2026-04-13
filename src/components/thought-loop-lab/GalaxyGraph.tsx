import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type GalaxyGraphProps = {
  loops: ThoughtLoop[];
  activeLoopId: string;
  onFocus: (payload: FocusPayload) => void;
};

const positions = [
  { x: 52, y: 44 },
  { x: 26, y: 66 },
  { x: 74, y: 67 },
  { x: 38, y: 30 },
  { x: 63, y: 27 },
];

function GalaxyGraph({ loops, activeLoopId, onFocus }: GalaxyGraphProps) {
  const indexed = useMemo(() => new Map(loops.map((loop) => [loop.id, loop])), [loops]);

  const edges = useMemo(() => {
    const lines: Array<{ from: string; to: string }> = [];
    loops.forEach((loop) => {
      loop.relatedLoops.forEach((related) => {
        if (indexed.has(related) && loop.id < related) {
          lines.push({ from: loop.id, to: related });
        }
      });
    });
    return lines;
  }, [indexed, loops]);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_52%,rgba(127,95,234,0.16),transparent_56%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {edges.map((edge) => {
          const fromIndex = loops.findIndex((loop) => loop.id === edge.from);
          const toIndex = loops.findIndex((loop) => loop.id === edge.to);
          const from = positions[fromIndex];
          const to = positions[toIndex];
          const active = edge.from === activeLoopId || edge.to === activeLoopId;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={active ? "rgba(158, 193, 255, 0.75)" : "rgba(130, 150, 193, 0.24)"}
              strokeWidth={active ? 0.34 : 0.18}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0">
        {loops.map((loop, index) => {
          const active = loop.id === activeLoopId;
          return (
            <motion.button
              key={loop.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left"
              style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}
              animate={{ y: [0, -4, 0], scale: active ? 1.04 : 1 }}
              transition={{
                duration: 6 + index * 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => onFocus({ loopId: loop.id })}
            >
              <div
                className={`w-36 rounded-lg border px-3 py-2 backdrop-blur-sm ${
                  active
                    ? "border-cyan-300/50 bg-cyan-300/10 text-white shadow-[0_0_24px_rgba(96,213,215,0.35)]"
                    : "border-white/20 bg-[#141c39]/70 text-white/80"
                }`}
              >
                <p className="text-xs tracking-[0.08em]">{loop.title}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(GalaxyGraph);
