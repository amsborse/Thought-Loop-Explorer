import { motion } from "framer-motion";

export default function BreakModeToggle({ breakMode, onChange }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] p-1.5 backdrop-blur-lg">
      {["View Loop", "Break the Loop"].map((label, index) => {
        const active = breakMode ? index === 1 : index === 0;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(index === 1)}
            className="relative rounded-full px-5 py-2 text-sm text-white/80 transition"
          >
            {active && (
              <motion.span
                layoutId="modePill"
                className="absolute inset-0 rounded-full bg-violet-500/35 shadow-[0_0_32px_rgba(139,92,246,0.45)]"
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
