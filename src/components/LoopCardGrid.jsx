import { motion } from "framer-motion";

function calcTilt(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const tiltX = ((y / rect.height) * 2 - 1) * -6;
  const tiltY = ((x / rect.width) * 2 - 1) * 8;
  return { tiltX, tiltY };
}

export default function LoopCardGrid({ loops, selectedLoopId, onSelectLoop }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Choose a Thought Entry</h2>
        <p className="mt-3 max-w-2xl text-white/65">
          Pick one pattern and watch how it self-reinforces. Then switch to break mode to see where new choices can
          enter.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loops.map((loop, index) => (
          <motion.button
            key={loop.id}
            type="button"
            onClick={() => onSelectLoop(loop.id)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
            onMouseMove={(event) => {
              const { tiltX, tiltY } = calcTilt(event);
              event.currentTarget.style.setProperty("--tilt-x", `${tiltX}deg`);
              event.currentTarget.style.setProperty("--tilt-y", `${tiltY}deg`);
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.setProperty("--tilt-x", "0deg");
              event.currentTarget.style.setProperty("--tilt-y", "0deg");
            }}
            className={`group relative overflow-hidden rounded-3xl border p-6 text-left backdrop-blur-xl transition-transform duration-300 [transform:perspective(1000px)_rotateX(var(--tilt-x))_rotateY(var(--tilt-y))] ${
              selectedLoopId === loop.id
                ? "border-violet-300/50 bg-white/15 shadow-[0_0_42px_rgba(139,92,246,0.35)]"
                : "border-white/15 bg-white/[0.06] shadow-clay"
            }`}
            whileHover={{ y: -8, scale: 1.01 }}
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/0 via-violet-300/0 to-teal-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-violet-400/15 group-hover:to-teal-300/10" />
            <p className="relative z-10 text-xs uppercase tracking-[0.24em] text-white/45">Loop Pattern</p>
            <h3 className="relative z-10 mt-4 text-xl font-medium text-white">{loop.title}</h3>
            <p className="relative z-10 mt-5 text-sm text-white/65">
              {loop.steps[1]?.text ?? "Automatic interpretation forms fast and begins shaping behavior."}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
