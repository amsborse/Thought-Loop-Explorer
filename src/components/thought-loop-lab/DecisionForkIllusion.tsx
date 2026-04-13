import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { FocusPayload, ThoughtLoop } from "./types";

type DecisionForkIllusionProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

function DecisionForkIllusion({ loop, onFocus }: DecisionForkIllusionProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const levels = useMemo(
    () => [
      loop.perceivedChoices,
      ["Double-check once more", "Wait for better state", "Ask one more person"],
      ["Delay final move", "Prepare extra backup", "Re-open earlier thought"],
    ],
    [loop.perceivedChoices]
  );

  const choose = (choice: string) => {
    const next = [...selected, choice].slice(0, 3);
    setSelected(next);
    setStep(Math.min(3, next.length));
    onFocus({
      loopId: loop.id,
      stage: "Behavior",
      selectedItem: choice,
      observerNote: next.length < 3 ? "Path feels different, but loop signature remains." : loop.actualOutcome,
    });
  };

  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#0f1732]/80 p-4 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
      <p className="mb-3 text-xs text-white/68">Different choices can still lead to the same loop.</p>
      <div className="grid h-[390px] grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-white/12 bg-[#121b3b]/72 p-4">
          <svg viewBox="0 0 500 300" className="h-full w-full">
            <circle cx="70" cy="150" r="18" fill="rgba(152,181,255,0.78)" />
            <text x="70" y="154" textAnchor="middle" fontSize="9.5" fill="#0a1736">
              Start
            </text>
            {[90, 150, 210].map((y, index) => (
              <g key={y}>
                <line x1="88" y1="150" x2="206" y2={y} stroke="rgba(170, 195, 242, 0.35)" />
                <line x1="226" y1={y} x2="336" y2={150 + (index - 1) * 38} stroke="rgba(170, 195, 242, 0.3)" />
                <line x1="356" y1={150 + (index - 1) * 38} x2="432" y2="150" stroke="rgba(170, 195, 242, 0.28)" />
              </g>
            ))}
            <circle cx="448" cy="150" r="23" fill="rgba(234,134,184,0.72)" />
            <text x="448" y="146" textAnchor="middle" fontSize="9" fill="#2a0822">
              Same
            </text>
            <text x="448" y="158" textAnchor="middle" fontSize="9" fill="#2a0822">
              outcome
            </text>
          </svg>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">{step < 3 ? `Decision ${step + 1}` : "Convergence"}</p>
          {step < 3 ? (
            <div className="mt-3 space-y-2">
              {levels[step].map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => choose(choice)}
                  className="w-full rounded-xl border border-white/18 bg-white/5 px-3 py-2 text-left text-sm text-white/84 hover:bg-white/10"
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-rose-300/35 bg-rose-300/10 p-3"
            >
              <p className="text-[11px] uppercase tracking-[0.1em] text-rose-100/80">Illusion vs reality</p>
              <p className="mt-1 text-sm text-white/90">{loop.actualOutcome}</p>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setSelected([]);
                }}
                className="mt-3 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80"
              >
                Try another path
              </button>
            </motion.div>
          )}
          <div className="mt-4 space-y-1">
            {selected.map((choice, index) => (
              <p key={choice} className="text-xs text-white/66">{`${index + 1}. ${choice}`}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DecisionForkIllusion);
