import { memo, useEffect, useMemo, useState } from "react";
import type { FocusPayload, ThoughtLoop } from "./types";

type EnergyDrainMeterProps = {
  loops: ThoughtLoop[];
  activeLoopId: string;
  onFocus: (payload: FocusPayload) => void;
};

function EnergyDrainMeter({ loops, activeLoopId, onFocus }: EnergyDrainMeterProps) {
  const [activeLoopIds, setActiveLoopIds] = useState<string[]>([activeLoopId, loops[1]?.id ?? activeLoopId]);
  const [paused, setPaused] = useState(false);
  const [energy, setEnergy] = useState(92);

  useEffect(() => {
    setActiveLoopIds((prev) => (prev.includes(activeLoopId) ? prev : [activeLoopId, ...prev].slice(0, 3)));
  }, [activeLoopId]);

  const activeLoops = useMemo(() => loops.filter((loop) => activeLoopIds.includes(loop.id)), [activeLoopIds, loops]);
  const drainRate = useMemo(() => activeLoops.reduce((sum, loop) => sum + loop.energyCost, 0), [activeLoops]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEnergy((prev) => {
        if (paused) return Math.min(100, prev + 1.8);
        const next = prev - drainRate * 0.08;
        return Math.max(0, next);
      });
    }, 220);
    return () => window.clearInterval(interval);
  }, [drainRate, paused]);

  const toggleLoop = (id: string) => {
    setActiveLoopIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id].slice(-3)));
  };

  const energyTone = energy > 66 ? "from-emerald-300 to-cyan-300" : energy > 36 ? "from-amber-300 to-orange-300" : "from-rose-400 to-fuchsia-400";

  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPaused((prev) => !prev)}
          className="rounded-lg border border-cyan-300/45 bg-cyan-300/12 px-3 py-1.5 text-xs text-cyan-50"
        >
          {paused ? "Resume loops" : "Pause active loops"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            setActiveLoopIds([activeLoopId]);
            onFocus({
              loopId: activeLoopId,
              stage: "Interruption",
              selectedItem: "Primary loop only",
              observerNote: "Breaking secondary loops allows energy to recover.",
            });
          }}
          className="rounded-lg border border-emerald-300/45 bg-emerald-300/12 px-3 py-1.5 text-xs text-emerald-50"
        >
          Break extra loops
        </button>
        <span className="ml-auto text-xs text-white/68">Loops silently consume mental energy.</span>
      </div>

      <div className="rounded-2xl border border-white/12 bg-[#121a3a]/72 p-4">
        <p className="text-xs text-white/58">Energy level</p>
        <div className="mt-2 h-4 rounded-full bg-white/10">
          <div className={`h-4 rounded-full bg-gradient-to-r ${energyTone} transition-[width] duration-200`} style={{ width: `${energy}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/70">
          <span>{`${Math.round(energy)}%`}</span>
          <span>{paused ? "Recovery mode" : `Drain ${drainRate.toFixed(1)}/cycle`}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {loops.map((loop) => {
          const active = activeLoopIds.includes(loop.id);
          return (
            <button
              key={loop.id}
              type="button"
              onClick={() => {
                toggleLoop(loop.id);
                onFocus({
                  loopId: loop.id,
                  stage: "Behavior",
                  selectedItem: `${loop.title} (${loop.energyCost} energy cost)`,
                  observerNote: active ? "Loop removed from active drain." : "Loop added to active drain profile.",
                });
              }}
              className={`rounded-xl border px-3 py-2 text-left ${
                active ? "border-violet-300/55 bg-violet-300/14 text-white" : "border-white/18 bg-white/5 text-white/72"
              }`}
            >
              <p className="text-xs">{loop.title}</p>
              <p className="mt-1 text-[11px] text-white/70">{`Cost ${loop.energyCost} | Load ${loop.cognitiveLoad}`}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(EnergyDrainMeter);
