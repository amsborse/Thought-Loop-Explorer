import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type HallOfMirrorsProps = {
  loops: ThoughtLoop[];
  activeLoopId: string;
  onFocus: (payload: FocusPayload) => void;
};

function HallOfMirrors({ loops, activeLoopId, onFocus }: HallOfMirrorsProps) {
  const [viewMode, setViewMode] = useState<"inside" | "observer">("inside");
  const [selectedChainId, setSelectedChainId] = useState(activeLoopId);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const chainCandidates = useMemo(() => loops.filter((loop) => loop.id === activeLoopId || loop.relatedLoops.includes(activeLoopId)), [activeLoopId, loops]);
  const displayLoops = chainCandidates.length >= 2 ? chainCandidates.slice(0, 2) : loops.slice(0, 2);
  const activeChain = useMemo(
    () => displayLoops.find((loop) => loop.id === selectedChainId) ?? displayLoops[0],
    [displayLoops, selectedChainId]
  );

  const cards = useMemo(
    () => [activeChain.mirrorChain.event, ...activeChain.mirrorChain.reflections],
    [activeChain.mirrorChain.event, activeChain.mirrorChain.reflections]
  );

  useEffect(() => {
    if (displayLoops.some((loop) => loop.id === selectedChainId)) return;
    setSelectedChainId(displayLoops[0].id);
    setSelectedIndex(0);
  }, [displayLoops, selectedChainId]);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_10%,rgba(145,117,243,0.2),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(88,198,225,0.09),transparent_38%)]" />
      <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
        {displayLoops.map((loop) => (
          <button
            key={loop.id}
            type="button"
            onClick={() => {
              setSelectedChainId(loop.id);
              setSelectedIndex(0);
              onFocus({ loopId: loop.id, stage: "Trigger", selectedItem: "Neutral event" });
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              selectedChainId === loop.id ? "border-violet-300/50 bg-violet-300/18 text-violet-50" : "border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {loop.title}
          </button>
        ))}

        <div className="ml-auto inline-flex rounded-lg border border-white/15 bg-white/5 p-1">
          {(["inside", "observer"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`rounded-md px-3 py-1 text-xs capitalize ${
                viewMode === mode ? "bg-cyan-300/18 text-white" : "text-white/68"
              }`}
            >
              {mode === "inside" ? "Inside the loop" : "Observer view"}
            </button>
          ))}
        </div>
      </div>
      <p className="relative z-10 mb-2 text-xs text-white/68">
        Notice the shift from a neutral event to an identity story. Observer view names each distortion clearly.
      </p>

      <div className="relative z-10 grid h-[375px] grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-5 [perspective:900px]">
          <div className="pointer-events-none absolute left-7 right-7 top-7 h-px bg-gradient-to-r from-transparent via-white/26 to-transparent" />
          <div className="pointer-events-none absolute left-10 right-10 top-[138px] h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          <div className="pointer-events-none absolute left-14 right-14 top-[248px] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <p className="absolute left-5 top-4 text-[10px] uppercase tracking-[0.14em] text-white/45">Neutral Event</p>
          <p className="absolute right-5 top-4 text-[10px] uppercase tracking-[0.14em] text-white/45">Identity Story</p>
          {cards.map((line, index) => {
            const isActive = index === selectedIndex;
            const depth = index * 30;
            const distortion = viewMode === "inside" ? 1 + index * 0.025 : 1;
            return (
              <motion.button
                key={line}
                type="button"
                className={`absolute left-1/2 w-[78%] -translate-x-1/2 rounded-xl border px-4 py-3 text-left backdrop-blur-md ${
                  isActive
                    ? "border-cyan-300/55 bg-cyan-300/14 text-white"
                    : "border-white/18 bg-[#121a38]/72 text-white/78"
                }`}
                style={{
                  top: `${24 + index * 42}px`,
                  transform: `translateX(-50%) translateZ(${-depth}px) scale(${distortion - index * 0.02})`,
                  filter: viewMode === "inside" && index > 0 ? `blur(${index * 0.36}px)` : "blur(0px)",
                  opacity: Math.max(0.35, 1 - index * 0.12),
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  setSelectedIndex(index);
                  onFocus({
                    loopId: activeChain.id,
                    stage: index === 0 ? "Trigger" : "Thought",
                    selectedItem: line,
                    observerNote:
                      index === 0
                        ? "Neutral event before distortion."
                        : activeChain.mirrorChain.distortionLabels[index - 1] ?? activeChain.distortionPattern,
                  });
                }}
                whileHover={{ y: -3 }}
              >
                <p className="text-xs uppercase tracking-[0.08em] text-white/58">
                  {index === 0 ? "Event" : `Reflection ${index}`}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{line}</p>
                {viewMode === "observer" && index > 0 && (
                  <span className="mt-2 inline-block rounded-full border border-amber-300/45 bg-amber-300/12 px-2 py-1 text-[10px] uppercase tracking-[0.06em] text-amber-100/90">
                    {activeChain.mirrorChain.distortionLabels[index - 1] ?? activeChain.distortionPattern}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/12 bg-[#111a39]/74 p-4 text-sm text-white/82">
          <p className="text-xs uppercase tracking-[0.14em] text-white/52">Distortion Lens</p>
          <p className="mt-2 text-white/90">
            {selectedIndex === 0
              ? "Starting event remains factual."
              : activeChain.mirrorChain.distortionLabels[selectedIndex - 1] ?? activeChain.distortionPattern}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/52">Interruption marker</p>
          <button
            type="button"
            onClick={() =>
              onFocus({
                loopId: activeChain.id,
                stage: "Interruption",
                selectedItem: activeChain.interruption,
                observerNote: "Reality-check point: return to evidence before identity conclusions.",
              })
            }
            className="mt-2 w-full rounded-xl border border-emerald-300/45 bg-emerald-300/10 px-3 py-2 text-left text-emerald-50"
          >
            {activeChain.interruption}
          </button>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/52">Emotional consequence</p>
          <p className="mt-1 text-white/88">{activeChain.emotion}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(HallOfMirrors);
