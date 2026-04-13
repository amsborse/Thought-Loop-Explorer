import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type GravityFieldProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

type BeliefMode = "weak" | "strong";

function GravityField({ loop, onFocus }: GravityFieldProps) {
  const [beliefMode, setBeliefMode] = useState<BeliefMode>("strong");
  const [awarenessMode, setAwarenessMode] = useState(false);

  const gravity = useMemo(() => {
    const base = beliefMode === "strong" ? 1 : 0.45;
    return awarenessMode ? base * 0.3 : base;
  }, [awarenessMode, beliefMode]);

  const thoughts = useMemo(
    () =>
      loop.microThoughts.map((thought, index) => {
        const angle = (index / loop.microThoughts.length) * Math.PI * 2;
        const r = 155 - index * 10;
        const x = 310 + Math.cos(angle) * r;
        const y = 185 + Math.sin(angle) * r * 0.64;
        return { id: `g-${index}`, thought, x, y };
      }),
    [loop.microThoughts]
  );

  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["weak", "strong"] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setBeliefMode(level)}
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${
              beliefMode === level ? "border-cyan-300/55 bg-cyan-300/16 text-white" : "border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {level} belief
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAwarenessMode((prev) => !prev)}
          className="ml-auto rounded-lg border border-emerald-300/45 bg-emerald-300/12 px-3 py-1.5 text-xs text-emerald-50"
        >
          {awarenessMode ? "Disable awareness" : "Awareness mode"}
        </button>
      </div>
      <p className="mb-2 text-xs text-white/66">Beliefs bend every thought toward themselves.</p>

      <svg viewBox="0 0 620 360" className="h-[370px] w-full">
        {[-130, -85, -40, 5, 50, 95, 140].map((line) => (
          <path
            key={`h-${line}`}
            d={`M 30 ${180 + line} Q 310 ${180 + line + gravity * 26} 590 ${180 + line}`}
            stroke="rgba(145, 177, 226, 0.22)"
            fill="none"
          />
        ))}
        {[-170, -115, -60, -5, 50, 105, 160].map((line) => (
          <path
            key={`v-${line}`}
            d={`M ${310 + line} 20 Q ${310 + line + gravity * 24} 180 ${310 + line} 340`}
            stroke="rgba(145, 177, 226, 0.18)"
            fill="none"
          />
        ))}

        <circle cx="310" cy="180" r={34 + gravity * 10} fill="rgba(123,96,238,0.36)" />
        <circle cx="310" cy="180" r="22" fill="rgba(16,26,57,0.95)" />
        <text x="310" y="176" textAnchor="middle" fontSize="10" fill="rgba(231,239,255,0.88)">
          Core belief
        </text>
        <text x="310" y="192" textAnchor="middle" fontSize="10.5" fill="rgba(221,232,255,0.9)">
          {loop.beliefStrength}/5
        </text>

        {thoughts.map((item, index) => (
          <g key={item.id}>
            <path
              d={`M ${item.x} ${item.y} Q ${(item.x + 310) / 2} ${(item.y + 180) / 2 + gravity * 16} 310 180`}
              fill="none"
              stroke="rgba(163, 203, 255, 0.26)"
              strokeDasharray="4 5"
            />
            <motion.circle
              cx={item.x}
              cy={item.y}
              r={7}
              drag
              dragMomentum={false}
              dragElastic={0.2}
              onDragEnd={() => {
                onFocus({
                  loopId: loop.id,
                  stage: "Thought",
                  selectedItem: item.thought,
                  observerNote: `"${item.thought}" curves back toward "${loop.coreThought}"`,
                });
              }}
              animate={{ cx: item.x - gravity * (item.x - 310) * 0.12, cy: item.y - gravity * (item.y - 180) * 0.12 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              fill={index % 2 === 0 ? "rgba(182,223,255,0.9)" : "rgba(203,189,255,0.9)"}
              className="cursor-grab active:cursor-grabbing"
              onClick={() =>
                onFocus({
                  loopId: loop.id,
                  stage: "Thought",
                  selectedItem: item.thought,
                  observerNote: "Thinking space bends around this belief, not around neutral evidence.",
                })
              }
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default memo(GravityField);
