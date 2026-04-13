import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const chips = [
  "Trigger",
  "Interpretation",
  "Emotion",
  "Urge",
  "Behavior",
  "Consequence",
  "Belief",
];

export default function ReflectionSection() {
  const [selectedChip, setSelectedChip] = useState("Interpretation");
  const [story, setStory] = useState("");
  const [pauseShift, setPauseShift] = useState("");

  const promptHint = useMemo(() => {
    if (selectedChip === "Interpretation") return "Good place to challenge certainty and assumptions.";
    if (selectedChip === "Urge") return "Urges are fast. Small pauses matter most here.";
    if (selectedChip === "Belief") return "Beliefs feel fixed, but they are often practiced stories.";
    return "Notice this node with curiosity rather than judgment.";
  }, [selectedChip]);

  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-4 pb-28">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl md:p-10">
        <h3 className="text-3xl font-semibold text-white">Reflection</h3>
        <p className="mt-3 max-w-2xl text-white/65">Small awareness cues to map where your pattern can shift.</p>

        <div className="mt-8">
          <p className="text-sm text-white/80">Which step traps you most?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => setSelectedChip(chip)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedChip === chip
                    ? "border-violet-300/70 bg-violet-500/20 text-violet-100"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/35"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <motion.p
            key={selectedChip}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-teal-200/80"
          >
            {promptHint}
          </motion.p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-white/80">What story repeats automatically?</span>
            <textarea
              value={story}
              onChange={(event) => setStory(event.target.value)}
              className="mt-2 h-28 w-full rounded-2xl border border-white/15 bg-black/25 p-3 text-sm text-white placeholder:text-white/35 focus:border-violet-400/70 focus:outline-none"
              placeholder="Write the repeating sentence..."
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/80">What would happen if you paused?</span>
            <textarea
              value={pauseShift}
              onChange={(event) => setPauseShift(event.target.value)}
              className="mt-2 h-28 w-full rounded-2xl border border-white/15 bg-black/25 p-3 text-sm text-white placeholder:text-white/35 focus:border-teal-400/70 focus:outline-none"
              placeholder="Name one alternative action..."
            />
          </label>
        </div>
      </div>
    </section>
  );
}
