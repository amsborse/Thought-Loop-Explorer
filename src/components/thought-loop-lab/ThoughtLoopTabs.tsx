import { motion } from "framer-motion";
import type { LabModeId } from "./types";

const tabItems: Array<{ id: LabModeId; label: string }> = [
  { id: "infinity", label: "Infinity Navigator" },
  { id: "galaxy", label: "Galaxy Graph" },
  { id: "playback", label: "Loop Playback" },
  { id: "builder", label: "Build Your Loop" },
  { id: "overgrown", label: "Overgrown Path" },
  { id: "whirlpool", label: "Whirlpool Mind" },
  { id: "mirrors", label: "Hall of Mirrors" },
  { id: "gravity", label: "Gravity Field" },
  { id: "tabs-hell", label: "Browser Tabs Hell" },
  { id: "echo", label: "Echo Chamber" },
  { id: "fork", label: "Decision Fork Illusion" },
  { id: "energy", label: "Energy Drain Meter" },
];

type ThoughtLoopTabsProps = {
  active: LabModeId;
  onChange: (id: LabModeId) => void;
};

export default function ThoughtLoopTabs({ active, onChange }: ThoughtLoopTabsProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#070d1d] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#070d1d] to-transparent" />
      <div className="inline-flex w-full max-w-full gap-2 overflow-x-auto rounded-2xl border border-white/12 bg-[#101933]/74 p-2 backdrop-blur-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tabItems.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="relative shrink-0 overflow-hidden rounded-xl px-4 py-2 text-sm text-slate-200/78 transition-all duration-200 ease-in-out hover:text-slate-50"
            >
              {isActive && (
                <motion.span
                  layoutId="lab-tab-highlight"
                  className="absolute inset-0 rounded-xl border border-indigo-200/18 bg-gradient-to-r from-cyan-300/16 via-indigo-300/15 to-violet-300/16 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_20px_rgba(12,26,56,0.24)]"
                  transition={{ type: "spring", stiffness: 270, damping: 34 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
