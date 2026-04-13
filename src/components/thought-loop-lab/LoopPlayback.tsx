import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, LoopStage, ThoughtLoop } from "./types";

type LoopPlaybackProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

const speedMap = {
  slow: 1800,
  normal: 1100,
  fast: 700,
} as const;

type PlaybackSpeed = keyof typeof speedMap;

function LoopPlayback({ loop, onFocus }: LoopPlaybackProps) {
  const stages = useMemo(() => loop.nodes.slice(0, 5), [loop]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, speedMap[speed]);
    return () => window.clearInterval(interval);
  }, [isPlaying, speed, stages.length]);

  useEffect(() => {
    onFocus({ loopId: loop.id, stage: stages[activeIndex]?.label as LoopStage });
  }, [activeIndex, loop.id, onFocus, stages]);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-5 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(133,103,248,0.15),transparent_55%)]" />

      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsPlaying(true);
          }}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90"
        >
          Replay
        </button>
        {(["slow", "normal", "fast"] as PlaybackSpeed[]).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setSpeed(label)}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              speed === label ? "border-violet-300/60 bg-violet-400/20 text-white" : "border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative z-10 mt-10 grid grid-cols-5 gap-3">
        {stages.map((stage, index) => {
          const active = index === activeIndex;
          return (
            <motion.button
              key={stage.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              animate={{ y: active ? -6 : 0 }}
              className={`rounded-xl border px-3 py-4 text-left ${
                active
                  ? "border-cyan-300/60 bg-cyan-300/10 text-white shadow-[0_0_18px_rgba(88,190,244,0.35)]"
                  : "border-white/15 bg-[#131b39]/80 text-white/75"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.08em]">{stage.label}</p>
              <p className="mt-2 text-xs leading-relaxed">{stage.text}</p>
              {stage.label === "Behavior" && (
                <span className="mt-3 inline-block rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-1 text-[10px] uppercase text-amber-100/85">
                  Interrupt Here
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <svg viewBox="0 0 100 22" className="relative z-10 mt-8 h-16 w-full">
        {stages.map((_, index) => {
          const x1 = 10 + index * 20;
          const x2 = index === stages.length - 1 ? 10 : 10 + (index + 1) * 20;
          const active = index <= activeIndex;
          return (
            <line
              key={`playback-line-${index}`}
              x1={x1}
              y1="11"
              x2={x2}
              y2="11"
              stroke={active ? "rgba(138, 188, 255, 0.92)" : "rgba(255,255,255,0.2)"}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default memo(LoopPlayback);
