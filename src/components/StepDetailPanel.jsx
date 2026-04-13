import { AnimatePresence, motion } from "framer-motion";
import { STEP_COLORS } from "../lib/loopTheme";

export default function StepDetailPanel({ step, interruption, breakMode }) {
  return (
    <div className="relative min-h-[330px] rounded-[1.7rem] border border-white/10 bg-black/20 p-6 backdrop-blur-lg">
      <AnimatePresence mode="wait">
        {step ? (
          <motion.div
            key={`${step.label}-${breakMode ? "break" : "loop"}`}
            initial={{ opacity: 0, x: 26, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">{breakMode ? "Break Node" : "Loop Node"}</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">{step.label}</h3>
            <div
              className="mt-5 h-1.5 w-20 rounded-full"
              style={{ background: `linear-gradient(90deg, ${STEP_COLORS[step.label]}, rgba(255,255,255,0.2))` }}
            />
            <p className="mt-6 text-base leading-relaxed text-white/78">{step.text}</p>

            {breakMode && interruption ? (
              <motion.div
                className="mt-8 rounded-2xl border border-violet-300/30 bg-violet-500/10 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200/80">Intervention</p>
                <p className="mt-2 text-sm leading-relaxed text-violet-50">{interruption.text}</p>
              </motion.div>
            ) : breakMode ? (
              <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                No intervention marker on this node yet. Focus where the loop is most reactive.
              </p>
            ) : null}
          </motion.div>
        ) : (
          <motion.p key="empty" className="mt-12 text-sm text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Select a node to inspect how this phase shapes the rest of the cycle.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
