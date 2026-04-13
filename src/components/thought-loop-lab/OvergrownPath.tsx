import { memo, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { FocusPayload, LoopStage, ThoughtLoop } from "./types";

type OvergrownPathProps = {
  loops: ThoughtLoop[];
  activeLoopId: string;
  selectedStage?: LoopStage;
  onFocus: (payload: FocusPayload) => void;
};

const PATH =
  "M 92 340 C 148 288 210 270 268 248 C 332 224 352 176 414 156 C 492 132 534 182 570 224 C 538 274 470 294 402 302 C 320 312 216 292 162 258 C 122 232 106 204 108 166";
const BRANCH_PATH = "M 332 222 C 358 196 386 184 420 192 C 456 200 482 224 504 254";

function stageDetails(loop: ThoughtLoop) {
  return [
    { stage: "Trigger" as LoopStage, title: "Trigger", text: loop.trigger },
    { stage: "Thought" as LoopStage, title: "Thought", text: loop.coreThought },
    { stage: "Emotion" as LoopStage, title: "Emotion", text: `${loop.emotion} (${loop.bodySignal})` },
    { stage: "Behavior" as LoopStage, title: "Behavior", text: loop.behavior },
    { stage: "Reinforcement" as LoopStage, title: "Reinforcement", text: loop.reinforcement },
  ];
}

function OvergrownPath({ loops, activeLoopId, selectedStage, onFocus }: OvergrownPathProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [mode, setMode] = useState<"repeat" | "interrupt">("repeat");
  const progressRef = useRef(0.04);
  const orbX = useMotionValue(120);
  const orbY = useMotionValue(318);

  const currentLoop = useMemo(() => loops.find((loop) => loop.id === activeLoopId) ?? loops[0], [activeLoopId, loops]);
  const trailLoops = useMemo(() => loops.filter((loop) => loop.metaphorTheme === "trail"), [loops]);
  const segments = useMemo(() => stageDetails(currentLoop), [currentLoop]);
  const wornLevel = useMemo(() => Math.min(1, currentLoop.repeatCount / 32), [currentLoop.repeatCount]);

  const segmentStops = useMemo(
    () =>
      [0.04, 0.22, 0.42, 0.66, 0.89].map((stop, index) => {
        const theta = stop * Math.PI * 2;
        return {
          ...segments[index],
          id: `segment-${index}`,
          x: 318 + Math.sin(theta) * 232 * (1 - index * 0.05),
          y: 210 + Math.sin(theta * 1.4) * 114,
        };
      }),
    [segments]
  );

  useAnimationFrame((_, delta) => {
    const path = pathRef.current;
    if (!path) return;
    const speed = mode === "repeat" ? 0.000065 + wornLevel * 0.000035 : 0.000052;
    progressRef.current = (progressRef.current + delta * speed) % 1;
    const point = path.getPointAtLength(progressRef.current * path.getTotalLength());
    orbX.set(point.x);
    orbY.set(point.y);
  });

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(126,205,181,0.16),transparent_44%),radial-gradient(circle_at_80%_26%,rgba(147,116,245,0.14),transparent_48%)]" />
      <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
        {trailLoops.slice(0, 3).map((loop) => (
          <button
            key={loop.id}
            type="button"
            onClick={() => onFocus({ loopId: loop.id, stage: "Trigger", selectedItem: "Trail entry" })}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              loop.id === currentLoop.id ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-50" : "border-white/18 bg-white/5 text-white/75"
            }`}
          >
            {loop.title}
          </button>
        ))}
        <div className="ml-auto inline-flex rounded-lg border border-white/15 bg-white/5 p-1">
          {(["repeat", "interrupt"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-md px-3 py-1 text-xs capitalize ${
                mode === option ? "bg-violet-300/20 text-white" : "text-white/65"
              }`}
            >
              {option} mode
            </button>
          ))}
        </div>
      </div>
      <p className="relative z-10 mb-3 text-xs text-white/68">
        Each pass makes the same route easier to walk. In interrupt mode, a gentler unpracticed route becomes visible.
      </p>

      <svg viewBox="0 0 640 360" className="relative z-10 h-[330px] w-full">
        <defs>
          <linearGradient id="trailFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124, 201, 174, 0.5)" />
            <stop offset="100%" stopColor="rgba(125, 158, 241, 0.3)" />
          </linearGradient>
        </defs>
        <motion.path
          ref={pathRef}
          d={PATH}
          fill="none"
          stroke="url(#trailFill)"
          strokeWidth={12 + wornLevel * 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ opacity: mode === "repeat" ? [0.56, 0.85, 0.56] : 0.62 }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="560" cy="230" r="26" fill="rgba(148, 176, 220, 0.09)" />
        <text x="560" y="233" textAnchor="middle" fontSize="9.5" fill="rgba(223,236,255,0.8)">
          Same Clearing
        </text>
        {mode === "repeat" &&
          [0.2, 0.33, 0.49, 0.7].map((offset, index) => (
            <path
              key={offset}
              d={PATH}
              fill="none"
              stroke="rgba(189, 229, 214, 0.08)"
              strokeWidth={8 + index * 1.5 + wornLevel * 7}
              strokeDasharray={`${8 + index * 2} 18`}
              strokeDashoffset={index * 5}
              strokeLinecap="round"
            />
          ))}

        {mode === "interrupt" && (
          <motion.path
            d={BRANCH_PATH}
            fill="none"
            stroke="rgba(175, 233, 196, 0.76)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="6 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {segmentStops.map((segment) => {
          const active = selectedStage === segment.stage;
          return (
            <g key={segment.id}>
              <circle
                cx={segment.x}
                cy={segment.y}
                r={active ? 9 : 7}
                fill={active ? "rgba(240,248,255,0.96)" : "rgba(177,211,255,0.72)"}
                className="cursor-pointer"
                onMouseEnter={() =>
                  onFocus({
                    loopId: currentLoop.id,
                    stage: segment.stage,
                    selectedItem: `${segment.title}: ${segment.text}`,
                    observerNote:
                      segment.stage === "Reinforcement"
                        ? "Relief from repetition makes the trail feel like the only route."
                        : "This moment trains the trail through repetition.",
                  })
                }
                onClick={() =>
                  onFocus({
                    loopId: currentLoop.id,
                    stage: segment.stage,
                    selectedItem: segment.text,
                    observerNote:
                      mode === "interrupt"
                        ? "A new route feels unclear at first because it has less repetition."
                        : "Repetition lowers friction, which can feel like certainty.",
                  })
                }
              />
              <text x={segment.x + 10} y={segment.y - 10} fill="rgba(232,238,255,0.86)" fontSize="10">
                {segment.title}
              </text>
            </g>
          );
        })}

        <motion.circle style={{ cx: orbX, cy: orbY }} r={5.5} fill="rgba(238,251,246,0.95)" />
      </svg>
    </div>
  );
}

export default memo(OvergrownPath);
