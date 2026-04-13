import { AnimatePresence, motion } from "framer-motion";
import { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import BrowserTabsHell from "./BrowserTabsHell";
import DecisionForkIllusion from "./DecisionForkIllusion";
import EchoChamber from "./EchoChamber";
import EnergyDrainMeter from "./EnergyDrainMeter";
import GalaxyGraph from "./GalaxyGraph";
import GravityField from "./GravityField";
import HallOfMirrors from "./HallOfMirrors";
import InfinityNavigator from "./InfinityNavigator";
import LoopPlayback from "./LoopPlayback";
import OvergrownPath from "./OvergrownPath";
import ThoughtLoopTabs from "./ThoughtLoopTabs";
import WhirlpoolMind from "./WhirlpoolMind";
import { thoughtLoopDummyData } from "./thoughtLoopDummyData";
import type { FocusPayload, LabModeId, LoopStage } from "./types";

const BuildYourLoop = lazy(() => import("./BuildYourLoop"));
const PANEL_TRANSITION = { duration: 0.28, ease: "easeInOut" as const };

type InsightEntry = { label: string; value: string };

const InsightCard = memo(function InsightCard({
  loopTitle,
  loopDescription,
  entries,
}: {
  loopTitle: string;
  loopDescription: string;
  entries: InsightEntry[];
}) {
  return (
    <aside className="rounded-3xl border border-white/12 bg-[#10182f]/82 p-5 text-sm backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/60">What&apos;s happening</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-50">{loopTitle}</h3>
      <p className="mt-2 text-slate-200/72">{loopDescription}</p>
      <div className="mt-4 h-px bg-white/10" />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${loopTitle}-${entries[2]?.value ?? "none"}`}
          className="mt-4 space-y-2.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={PANEL_TRANSITION}
        >
          {entries.map((entry) => (
            <div key={entry.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-300/52">{entry.label}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-100/90">{entry.value}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
});

function ThoughtLoopExplorerLab() {
  const [activeMode, setActiveMode] = useState<LabModeId>("infinity");
  const [focusLoopId, setFocusLoopId] = useState(thoughtLoopDummyData[0].id);
  const [focusStage, setFocusStage] = useState<LoopStage>("Trigger");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [observerNote, setObserverNote] = useState<string>("");

  const focusedLoop = useMemo(
    () => thoughtLoopDummyData.find((loop) => loop.id === focusLoopId) ?? thoughtLoopDummyData[0],
    [focusLoopId]
  );

  const handleFocus = useCallback((payload: FocusPayload) => {
    setFocusLoopId(payload.loopId);
    if (payload.stage) {
      setFocusStage(payload.stage);
    }
    if (payload.selectedItem) {
      setSelectedItem(payload.selectedItem);
    }
    if (payload.observerNote) {
      setObserverNote(payload.observerNote);
    }
  }, []);

  const modeMicrocopy: Record<LabModeId, string> = useMemo(
    () => ({
      infinity: "Track one recurring loop as a living pattern in motion.",
      galaxy: "See how related loops cluster and influence each other.",
      playback: "Watch how a loop sequence escalates over repeated cycles.",
      builder: "Prototype custom loop shapes and interruption experiments.",
      overgrown: "Loops become familiar trails the mind walks automatically.",
      whirlpool: "Some beliefs pull every thought back toward themselves.",
      mirrors: "A small event can become a distorted story about the self.",
      gravity: "Beliefs bend every thought toward themselves.",
      "tabs-hell": "Unresolved thoughts multiply and compete for attention.",
      echo: "Repetition turns thoughts into beliefs.",
      fork: "Different choices can still lead to the same loop.",
      energy: "Loops silently consume mental energy.",
    }),
    []
  );

  const detailEntries = useMemo(
    () => [
      { label: "Loop", value: focusedLoop.title },
      { label: "Metaphor", value: focusedLoop.metaphorTheme },
      { label: "Current Pattern", value: selectedItem || focusStage },
      { label: "Trigger", value: focusedLoop.trigger },
      { label: "Core Thought", value: focusedLoop.coreThought },
      { label: "Emotion", value: focusedLoop.emotion },
      { label: "Body Signal", value: focusedLoop.bodySignal },
      { label: "Belief Strength", value: `${focusedLoop.beliefStrength}/5` },
      { label: "Distortion Pattern", value: focusedLoop.distortionPattern },
      { label: "Distortion Type", value: focusedLoop.distortionType },
      { label: "Repetition Pattern", value: `${focusedLoop.repetitionStrength}/5 over ${focusedLoop.repeatCount} cycles` },
      { label: "Energy Impact", value: `${focusedLoop.energyCost} cost / ${focusedLoop.cognitiveLoad} load` },
      { label: "Illusion vs Reality", value: `${focusedLoop.perceivedChoices[0]} -> ${focusedLoop.actualOutcome}` },
      { label: "Reinforcing Belief", value: focusedLoop.reinforcement },
      { label: "Suggested Interruption", value: focusedLoop.interruption },
      { label: "Observer Insight", value: observerNote || focusedLoop.observerInsights[0] },
    ],
    [focusStage, focusedLoop, observerNote, selectedItem]
  );

  return (
    <section className="relative mt-28 border-t border-white/10 bg-[#070d1d] px-4 py-24 font-[Inter,ui-sans-serif,system-ui,-apple-system,Segoe_UI,Roboto,sans-serif] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(84,143,255,0.09),transparent_38%),radial-gradient(circle_at_74%_24%,rgba(132,109,232,0.13),transparent_42%),radial-gradient(circle_at_50%_84%,rgba(18,27,52,0.92),rgba(6,9,19,1)_64%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-12 space-y-4">
          <p className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-200/70">
            Experimental Lab
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-[2.65rem]">Thought Loop Explorer</h2>
          <p className="max-w-3xl text-[15px] leading-relaxed text-slate-200/72">
            Production-caliber visualization studies for recognizing recurring patterns and testing interruption pathways.
          </p>
        </div>

        <div className="mb-7">
          <ThoughtLoopTabs active={activeMode} onChange={setActiveMode} />
          <p className="mt-3 text-sm text-slate-200/68">{modeMicrocopy[activeMode]}</p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[1.7fr_0.82fr]">
          <div className="rounded-3xl border border-white/12 bg-[#0f162d]/72 p-4 shadow-[0_14px_40px_rgba(1,5,14,0.36)] backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {activeMode === "infinity" && (
                <motion.div key="infinity" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <InfinityNavigator loop={focusedLoop} selectedStage={focusStage} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "galaxy" && (
                <motion.div key="galaxy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <GalaxyGraph loops={thoughtLoopDummyData} activeLoopId={focusedLoop.id} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "playback" && (
                <motion.div key="playback" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <LoopPlayback loop={focusedLoop} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "builder" && (
                <motion.div key="builder" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <Suspense
                    fallback={
                      <div className="flex h-[460px] items-center justify-center rounded-2xl border border-white/12 bg-[#0f1732]/86 text-slate-200/72">
                        Preparing interactive canvas...
                      </div>
                    }
                  >
                    <BuildYourLoop loop={focusedLoop} onFocus={handleFocus} />
                  </Suspense>
                </motion.div>
              )}
              {activeMode === "overgrown" && (
                <motion.div key="overgrown" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <OvergrownPath
                    loops={thoughtLoopDummyData}
                    activeLoopId={focusedLoop.id}
                    selectedStage={focusStage}
                    onFocus={handleFocus}
                  />
                </motion.div>
              )}
              {activeMode === "whirlpool" && (
                <motion.div key="whirlpool" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <WhirlpoolMind loop={focusedLoop} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "mirrors" && (
                <motion.div key="mirrors" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <HallOfMirrors loops={thoughtLoopDummyData} activeLoopId={focusedLoop.id} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "gravity" && (
                <motion.div key="gravity" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <GravityField loop={focusedLoop} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "tabs-hell" && (
                <motion.div key="tabs-hell" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <BrowserTabsHell loops={thoughtLoopDummyData} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "echo" && (
                <motion.div key="echo" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <EchoChamber loop={focusedLoop} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "fork" && (
                <motion.div key="fork" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <DecisionForkIllusion loop={focusedLoop} onFocus={handleFocus} />
                </motion.div>
              )}
              {activeMode === "energy" && (
                <motion.div key="energy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={PANEL_TRANSITION}>
                  <EnergyDrainMeter loops={thoughtLoopDummyData} activeLoopId={focusedLoop.id} onFocus={handleFocus} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <InsightCard loopTitle={focusedLoop.title} loopDescription={focusedLoop.description} entries={detailEntries} />
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.16em] text-slate-300/52">
          Experimental interactions using synthetic loop data
        </p>
      </div>
    </section>
  );
}

export default memo(ThoughtLoopExplorerLab);
