import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import loops from "./data/loops.json";
import HeroSection from "./components/HeroSection";
import LoopCardGrid from "./components/LoopCardGrid";
import LoopVisualization from "./components/LoopVisualization";
import StepDetailPanel from "./components/StepDetailPanel";
import BreakModeToggle from "./components/BreakModeToggle";
import ReflectionSection from "./components/ReflectionSection";
import { STEP_ORDER } from "./lib/loopTheme";

export default function App() {
  const [selectedLoopId, setSelectedLoopId] = useState(loops[0].id);
  const [breakMode, setBreakMode] = useState(false);
  const [selectedInterruption, setSelectedInterruption] = useState(null);
  const loopSectionRef = useRef(null);

  const selectedLoop = useMemo(
    () => loops.find((loop) => loop.id === selectedLoopId) ?? loops[0],
    [selectedLoopId]
  );

  const [activeStepLabel, setActiveStepLabel] = useState("Trigger");
  const activeStep = useMemo(
    () =>
      selectedLoop.steps.find((step) => step.label === activeStepLabel) ??
      selectedLoop.steps.find((step) => step.label === "Trigger") ??
      selectedLoop.steps[0],
    [activeStepLabel, selectedLoop]
  );

  const orderedSteps = useMemo(
    () =>
      [...selectedLoop.steps].sort(
        (a, b) => STEP_ORDER.indexOf(a.label) - STEP_ORDER.indexOf(b.label)
      ),
    [selectedLoop.steps]
  );

  function selectLoop(loopId) {
    setSelectedLoopId(loopId);
    setSelectedInterruption(null);
    const loop = loops.find((item) => item.id === loopId);
    setActiveStepLabel(loop?.steps[0]?.label ?? "Trigger");
    loopSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="relative overflow-x-hidden bg-[#05090a] text-white">
      <HeroSection onExplore={() => loopSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-16 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
          <div className="absolute right-[12%] top-[28%] h-[380px] w-[380px] rounded-full bg-teal-400/10 blur-[120px]" />
        </div>

        <LoopCardGrid loops={loops} selectedLoopId={selectedLoopId} onSelectLoop={selectLoop} />

        <section ref={loopSectionRef} id="loop-visualization" className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/45">Interactive Loop Visualization</p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{selectedLoop.title}</h2>
            </div>
            <BreakModeToggle
              breakMode={breakMode}
              onChange={(enabled) => {
                setBreakMode(enabled);
                if (!enabled) {
                  setSelectedInterruption(null);
                }
              }}
            />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
            <motion.div layout transition={{ type: "spring", stiffness: 130, damping: 24 }}>
              <LoopVisualization
                loop={{ ...selectedLoop, steps: orderedSteps }}
                activeStep={activeStep}
                onSelectStep={(step) => {
                  setActiveStepLabel(step.label);
                  setSelectedInterruption(
                    selectedLoop.interruptions.find((item) => item.stage === step.label) ?? null
                  );
                }}
                breakMode={breakMode}
                selectedInterruption={selectedInterruption}
                onSelectInterruption={(interruption) => {
                  setSelectedInterruption(interruption);
                  setActiveStepLabel(interruption.stage);
                }}
              />
            </motion.div>
            <StepDetailPanel step={activeStep} interruption={selectedInterruption} breakMode={breakMode} />
          </div>
        </section>

        <ReflectionSection />
      </main>
    </div>
  );
}
