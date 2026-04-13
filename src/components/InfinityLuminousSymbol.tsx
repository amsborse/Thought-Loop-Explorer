import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

type InfinityLuminousSymbolProps = {
  className?: string;
};

const LOOP_TIMING = {
  fadeIn: 0.75,
  draw: 3.9,
  hold: 1.05,
  erase: 3.6,
  empty: 0.95,
};

const TOTAL_LOOP = LOOP_TIMING.draw + LOOP_TIMING.hold + LOOP_TIMING.erase + LOOP_TIMING.empty;
const DRAW_END = LOOP_TIMING.draw / TOTAL_LOOP;
const HOLD_END = (LOOP_TIMING.draw + LOOP_TIMING.hold) / TOTAL_LOOP;
const ERASE_END = (LOOP_TIMING.draw + LOOP_TIMING.hold + LOOP_TIMING.erase) / TOTAL_LOOP;

const INFINITY_PATH =
  "M 140 180 C 140 102 260 102 320 180 C 380 258 500 258 500 180 C 500 102 380 102 320 180 C 260 258 140 258 140 180";

const times = [0, DRAW_END, HOLD_END, ERASE_END, 1];

export default function InfinityLuminousSymbol({ className = "" }: InfinityLuminousSymbolProps) {
  const reduceMotion = useReducedMotion();
  const idBase = useId().replace(/:/g, "");
  const gradientId = `${idBase}-grad`;
  const coreGradientId = `${idBase}-core`;
  const bloomId = `${idBase}-bloom`;

  return (
    <motion.div
      className={`pointer-events-none relative mx-auto flex w-full justify-center ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : LOOP_TIMING.fadeIn, ease: "easeOut" }}
      aria-hidden
    >
      <svg viewBox="0 0 640 360" className="h-[36vw] max-h-[520px] min-h-[280px] w-full rounded-[1.6rem]">
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="52%" x2="90%" y2="48%">
            <stop offset="0%" stopColor="#44b6c6" />
            <stop offset="52%" stopColor="#8e72de" />
            <stop offset="100%" stopColor="#d78daf" />
          </linearGradient>

          <linearGradient id={coreGradientId} x1="14%" y1="48%" x2="86%" y2="52%">
            <stop offset="0%" stopColor="rgba(212, 246, 255, 0.86)" />
            <stop offset="48%" stopColor="rgba(230, 222, 255, 0.93)" />
            <stop offset="100%" stopColor="rgba(255, 230, 243, 0.86)" />
          </linearGradient>

          <filter id={bloomId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={INFINITY_PATH}
          pathLength={1}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="11.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${bloomId})`}
          style={{ strokeDasharray: 1 }}
          initial={{ strokeDashoffset: reduceMotion ? 0 : 1, opacity: reduceMotion ? 0.34 : 0 }}
          animate={
            reduceMotion
              ? { strokeDashoffset: 0, opacity: 0.34 }
              : {
                  strokeDashoffset: [1, 0, 0, 1, 1],
                  opacity: [0, 0.34, 0.34, 0.28, 0],
                }
          }
          transition={{
            duration: reduceMotion ? 0.01 : TOTAL_LOOP,
            times,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d={INFINITY_PATH}
          pathLength={1}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 1 }}
          initial={{ strokeDashoffset: reduceMotion ? 0 : 1, opacity: reduceMotion ? 0.9 : 0 }}
          animate={
            reduceMotion
              ? { strokeDashoffset: 0, opacity: 0.9 }
              : {
                  strokeDashoffset: [1, 0, 0, 1, 1],
                  opacity: [0, 0.9, 0.9, 0.9, 0],
                }
          }
          transition={{
            duration: reduceMotion ? 0.01 : TOTAL_LOOP,
            times,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d={INFINITY_PATH}
          pathLength={1}
          fill="none"
          stroke={`url(#${coreGradientId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 1 }}
          initial={{ strokeDashoffset: reduceMotion ? 0 : 1, opacity: reduceMotion ? 0.78 : 0 }}
          animate={
            reduceMotion
              ? { strokeDashoffset: 0, opacity: 0.78 }
              : {
                  strokeDashoffset: [1, 0, 0, 1, 1],
                  opacity: [0, 0.78, 0.8, 0.72, 0],
                }
          }
          transition={{
            duration: reduceMotion ? 0.01 : TOTAL_LOOP,
            times,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
