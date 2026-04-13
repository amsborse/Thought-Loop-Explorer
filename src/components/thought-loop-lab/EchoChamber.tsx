import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type EchoChamberProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

function evolveThought(source: string, layer: number) {
  if (layer === 0) return source;
  if (layer === 1) return `What if this means ${source.toLowerCase()}?`;
  return `This always ends badly, so ${source.toLowerCase()}.`;
}

function EchoChamber({ loop, onFocus }: EchoChamberProps) {
  const [repetition, setRepetition] = useState(1);
  const [interrupted, setInterrupted] = useState(false);

  const layers = useMemo(
    () =>
      [0, 1, 2].map((level) => ({
        id: `echo-${level}`,
        title: level === 0 ? "Original" : level === 1 ? "Amplified" : "Exaggerated",
        text: evolveThought(loop.coreThought, level),
      })),
    [loop.coreThought]
  );

  const intensity = Math.max(0.26, Math.min(1, repetition / 8)) * (interrupted ? 0.45 : 1);

  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRepetition((prev) => Math.min(9, prev + 1))}
          className="rounded-lg border border-violet-300/50 bg-violet-300/12 px-3 py-1.5 text-xs text-violet-50"
        >
          Repeat thought
        </button>
        <button
          type="button"
          onClick={() => {
            setInterrupted(true);
            setRepetition(1);
            onFocus({
              loopId: loop.id,
              stage: "Interruption",
              selectedItem: "Neutral thought introduced",
              observerNote: "Interrupt added: maybe this is only one moment, not a full identity verdict.",
            });
          }}
          className="rounded-lg border border-emerald-300/45 bg-emerald-300/12 px-3 py-1.5 text-xs text-emerald-50"
        >
          Interrupt echo
        </button>
        <span className="ml-auto text-xs text-white/68">Repetition turns thoughts into beliefs.</span>
      </div>

      <div className="relative h-[360px]">
        <svg viewBox="0 0 620 340" className="h-full w-full">
          {[1, 2, 3, 4].map((ring) => (
            <motion.circle
              key={ring}
              cx="310"
              cy="170"
              r={45 + ring * 35}
              fill="none"
              stroke={`rgba(160, 195, 255, ${0.12 + intensity * 0.22 - ring * 0.03})`}
              strokeWidth={1.4}
              animate={{ scale: [1, 1.02 + intensity * 0.05, 1], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.2 + ring * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>

        <div className="absolute inset-x-8 top-12 space-y-3">
          {layers.map((layer, index) => (
            <motion.button
              key={layer.id}
              type="button"
              onClick={() =>
                onFocus({
                  loopId: loop.id,
                  stage: "Thought",
                  selectedItem: layer.text,
                  observerNote: `${layer.title} layer reflects ${loop.distortionType}.`,
                })
              }
              animate={{ x: [0, index === 0 ? 2 : -2, 0] }}
              transition={{ duration: 2 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className={`w-full rounded-xl border px-4 py-3 text-left ${
                index === 0
                  ? "border-white/30 bg-white/8 text-white/92"
                  : index === 1
                    ? "border-violet-300/35 bg-violet-300/10 text-white/86"
                    : "border-rose-300/35 bg-rose-300/10 text-white/84"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.1em] text-white/58">{layer.title}</p>
              <p className="mt-1 text-sm">{layer.text}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(EchoChamber);
