import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type WhirlpoolMindProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

type Intensity = "low" | "medium" | "high";

const stageMap = ["Trigger", "Thought", "Emotion", "Behavior", "Reinforcement"] as const;

function breakLine(input: string, max = 34) {
  if (input.length <= max) return [input];
  const splitAt = input.lastIndexOf(" ", max);
  const point = splitAt > 12 ? splitAt : max;
  return [input.slice(0, point), input.slice(point + 1)];
}

function WhirlpoolMind({ loop, onFocus }: WhirlpoolMindProps) {
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [awareness, setAwareness] = useState(false);
  const [selectedThought, setSelectedThought] = useState(loop.microThoughts[0]);

  useEffect(() => {
    setSelectedThought(loop.microThoughts[0]);
  }, [loop]);

  useEffect(() => {
    if (!awareness) return undefined;
    const timeout = window.setTimeout(() => setAwareness(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [awareness]);

  const visual = useMemo(() => {
    const base =
      intensity === "high"
        ? { radius: 110, duration: 8 }
        : intensity === "low"
          ? { radius: 152, duration: 15 }
          : { radius: 130, duration: 11 };
    return awareness
      ? { radius: base.radius + 24, duration: base.duration + 6, ringOpacity: 0.68 }
      : { radius: base.radius, duration: base.duration, ringOpacity: 0.42 };
  }, [awareness, intensity]);

  const orbitNodes = useMemo(
    () =>
      loop.microThoughts.map((thought, index) => ({
        thought,
        stage: stageMap[index % stageMap.length],
        angle: (index / loop.microThoughts.length) * Math.PI * 2,
      })),
    [loop.microThoughts]
  );
  const coreLines = useMemo(() => breakLine(loop.coreThought), [loop.coreThought]);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(137,109,255,0.19),transparent_42%),radial-gradient(circle_at_30%_80%,rgba(95,212,206,0.1),transparent_34%)]" />

      <div className="relative z-10 mb-3 flex flex-wrap items-center gap-2">
        {(["low", "medium", "high"] as Intensity[]).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setIntensity(level)}
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${
              intensity === level ? "border-cyan-300/60 bg-cyan-300/15 text-white" : "border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {level}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAwareness(true)}
          className="ml-auto rounded-lg border border-emerald-300/45 bg-emerald-300/12 px-3 py-1.5 text-xs text-emerald-50"
        >
          Awareness Pause
        </button>
      </div>
      <p className="relative z-10 mb-2 text-xs text-white/68">
        Emotional gravity pulls related thoughts inward; awareness creates temporary space.
      </p>

      <div className="relative z-10 h-[380px]">
        <svg viewBox="0 0 620 380" className="h-full w-full">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: visual.duration, ease: "linear", repeat: Infinity }}
            style={{ originX: "50%", originY: "50%" }}
          >
            {[0.68, 0.82, 0.95].map((factor, index) => (
              <ellipse
                key={factor}
                cx="310"
                cy="190"
                rx={visual.radius * factor}
                ry={visual.radius * factor * 0.48}
                fill="none"
                stroke={`rgba(167, 194, 255, ${visual.ringOpacity - index * 0.1})`}
                strokeWidth={1.2 - index * 0.2}
                strokeDasharray={`${5 + index * 2} ${9 + index * 2}`}
              />
            ))}
          </motion.g>

          <circle cx="310" cy="190" r="54" fill="rgba(115, 95, 232, 0.28)" />
          <circle cx="310" cy="190" r="38" fill="rgba(30, 42, 84, 0.72)" />
          <text x="310" y="178" textAnchor="middle" fill="rgba(236,243,255,0.9)" fontSize="11">
            Core Belief
          </text>
          {coreLines.map((line, index) => (
            <text key={line} x="310" y={196 + index * 14} textAnchor="middle" fill="rgba(218,232,255,0.88)" fontSize="11.4">
              {line}
            </text>
          ))}
          <text x="310" y="237" textAnchor="middle" fill="rgba(188,214,255,0.75)" fontSize="10">
            Body signal: {loop.bodySignal}
          </text>

          {orbitNodes.map((node, index) => {
            const radius = visual.radius * (0.72 + (index % 2) * 0.22);
            const x = 310 + Math.cos(node.angle) * radius;
            const y = 190 + Math.sin(node.angle) * radius * 0.5;
            const active = node.thought === selectedThought;
            return (
              <g key={node.thought}>
                <path
                  d={`M ${x} ${y} Q ${(x + 310) / 2} ${(y + 190) / 2 - 10} 310 190`}
                  stroke={active ? "rgba(174, 214, 255, 0.44)" : "rgba(144, 178, 226, 0.2)"}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3 5"
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r={active ? 8.5 : 6.2}
                  fill={active ? "rgba(240,249,255,0.97)" : "rgba(167,204,255,0.78)"}
                  animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
                  onClick={() => {
                    setSelectedThought(node.thought);
                    onFocus({
                      loopId: loop.id,
                      stage: node.stage,
                      selectedItem: node.thought,
                      observerNote: `${node.thought} reinforces "${loop.coreThought}"`,
                    });
                  }}
                  className="cursor-pointer"
                />
              </g>
            );
          })}

          <g>
            {loop.observerInsights.map((insight, index) => (
              <text
                key={insight}
                x={90}
                y={310 + index * 16}
                fill="rgba(210,231,255,0.78)"
                fontSize="10.5"
                onClick={() =>
                  onFocus({
                    loopId: loop.id,
                    selectedItem: "Observer Insight",
                    observerNote: insight,
                    stage: "Interruption",
                  })
                }
                className="cursor-pointer"
              >
                {`\u2022 ${insight}`}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default memo(WhirlpoolMind);
