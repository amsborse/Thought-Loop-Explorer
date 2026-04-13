import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type BrowserTabsHellProps = {
  loops: ThoughtLoop[];
  onFocus: (payload: FocusPayload) => void;
};

type TabLoop = { id: string; loopId: string; title: string; urgent: boolean };

function BrowserTabsHell({ loops, onFocus }: BrowserTabsHellProps) {
  const [tabs, setTabs] = useState<TabLoop[]>([
    { id: "tab-0", loopId: loops[0].id, title: loops[0].title, urgent: false },
    { id: "tab-1", loopId: loops[1].id, title: loops[1].title, urgent: true },
  ]);
  const [focusMode, setFocusMode] = useState(false);
  const [activeTabId, setActiveTabId] = useState("tab-0");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTabs((prev) => {
        if (prev.length >= 11) return prev;
        const source = loops[Math.floor(Math.random() * loops.length)];
        return [
          ...prev,
          {
            id: `tab-${Date.now()}-${prev.length}`,
            loopId: source.id,
            title: `${source.title} (${source.repeatCount})`,
            urgent: source.intensity >= 4,
          },
        ];
      });
    }, 2400);
    return () => window.clearInterval(interval);
  }, [loops]);

  const visibleTabs = useMemo(() => (focusMode ? tabs.filter((tab) => tab.id === activeTabId) : tabs), [activeTabId, focusMode, tabs]);

  const loadStats = useMemo(() => {
    const loopMap = new Map(loops.map((loop) => [loop.id, loop]));
    const load = tabs.reduce((sum, tab) => sum + (loopMap.get(tab.loopId)?.cognitiveLoad ?? 45), 0);
    const cpu = Math.min(100, Math.round(load / 7));
    const memory = Math.min(100, Math.round(18 + tabs.length * 7.5));
    return { cpu, memory };
  }, [loops, tabs]);

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== id);
      if (!filtered.find((tab) => tab.id === activeTabId) && filtered[0]) setActiveTabId(filtered[0].id);
      return filtered;
    });
  };

  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTabs((prev) => prev.filter((tab) => !tab.urgent))}
          className="rounded-lg border border-amber-300/45 bg-amber-300/12 px-3 py-1.5 text-xs text-amber-100"
        >
          Close all minor loops
        </button>
        <button
          type="button"
          onClick={() => setFocusMode((prev) => !prev)}
          className="rounded-lg border border-cyan-300/45 bg-cyan-300/12 px-3 py-1.5 text-xs text-cyan-50"
        >
          {focusMode ? "Exit focus mode" : "Focus mode"}
        </button>
        <span className="ml-auto text-xs text-white/68">Unresolved thoughts multiply and compete for attention.</span>
      </div>

      <div className="rounded-xl border border-white/12 bg-[#131d3f]/72 p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {visibleTabs.map((tab, index) => {
            const active = tab.id === activeTabId;
            return (
              <motion.button
                key={tab.id}
                type="button"
                animate={{ opacity: tab.urgent ? [0.82, 1, 0.82] : 1 }}
                transition={{ duration: 1.4 + index * 0.2, repeat: tab.urgent ? Infinity : 0 }}
                onClick={() => {
                  setActiveTabId(tab.id);
                  const loop = loops.find((item) => item.id === tab.loopId);
                  if (!loop) return;
                  onFocus({
                    loopId: loop.id,
                    stage: "Thought",
                    selectedItem: tab.title,
                    observerNote: `Tab reopened: ${loop.coreThought}`,
                  });
                }}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  active ? "border-violet-300/60 bg-violet-300/16 text-white" : "border-white/18 bg-white/5 text-white/75"
                }`}
              >
                <span>{tab.title}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") closeTab(tab.id);
                  }}
                  className="rounded bg-black/30 px-1 text-[10px]"
                >
                  x
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <p className="mb-1 text-white/70">CPU load</p>
            <div className="h-2 rounded bg-white/10">
              <div className="h-2 rounded bg-gradient-to-r from-cyan-300/70 to-violet-300/80" style={{ width: `${loadStats.cpu}%` }} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-white/70">Memory pressure</p>
            <div className="h-2 rounded bg-white/10">
              <div className="h-2 rounded bg-gradient-to-r from-fuchsia-300/60 to-rose-300/80" style={{ width: `${loadStats.memory}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(BrowserTabsHell);
