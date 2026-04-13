import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

const LOOP_TIMING = {
  fadeIn: 0.9,
  emptyHold: 0.9,
  draw: 5.2,
  fullHold: 0.95,
  erase: 4.9,
  postEmptyHold: 1.0,
};

const TOTAL_LOOP_DURATION =
  LOOP_TIMING.emptyHold + LOOP_TIMING.draw + LOOP_TIMING.fullHold + LOOP_TIMING.erase + LOOP_TIMING.postEmptyHold;
const AMBIENT_DELAY = LOOP_TIMING.emptyHold + LOOP_TIMING.draw + 0.25;

const MIN_SEGMENT = 0.0001;
const BRUSH_FRONT_MIN_LENGTH = 0.012;
const BRUSH_FRONT_MAX_LENGTH = 0.052;
const BRUSH_FRONT_GROWTH = 1.12;

const INFINITY_PATH =
  "M 140 200 C 140 122 260 122 320 200 C 380 278 500 278 500 200 C 500 122 380 122 320 200 C 260 278 140 278 140 200";

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  cx: 120 + ((index * 47) % 400),
  cy: 98 + ((index * 79) % 204),
  radius: 0.8 + (index % 3) * 0.55,
  delay: (index % 7) * 0.5,
  duration: 8 + (index % 6) * 1.4,
}));

const smoothStep = (t: number) => t * t * (3 - 2 * t);

const toRange = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function getLoopState(loopTime: number) {
  const t0 = LOOP_TIMING.emptyHold;
  const t1 = t0 + LOOP_TIMING.draw;
  const t2 = t1 + LOOP_TIMING.fullHold;
  const t3 = t2 + LOOP_TIMING.erase;

  if (loopTime < t0) {
    return { progress: 0, edgeOpacity: 0, aura: 0.05, motionDirection: 0 };
  }

  if (loopTime < t1) {
    const local = smoothStep((loopTime - t0) / LOOP_TIMING.draw);
    return {
      progress: local,
      edgeOpacity: 0.95,
      aura: 0.2 + local * 0.35,
      motionDirection: 1,
    };
  }

  if (loopTime < t2) {
    return { progress: 1, edgeOpacity: 0, aura: 0.6, motionDirection: 0 };
  }

  if (loopTime < t3) {
    const local = smoothStep((loopTime - t2) / LOOP_TIMING.erase);
    return {
      progress: 1 - local,
      edgeOpacity: 0.9,
      aura: 0.56 - local * 0.38,
      motionDirection: -1,
    };
  }

  return { progress: 0, edgeOpacity: 0, aura: 0.05, motionDirection: 0 };
}

type InfinityHeroCinematicProps = {
  className?: string;
};

export default function InfinityHeroCinematic({ className = "" }: InfinityHeroCinematicProps) {
  const reduceMotion = useReducedMotion();
  const coreGradientId = useId();
  const washGradientId = useId();
  const highlightGradientId = useId();
  const inkEdgeFilterId = useId();
  const dryBreaksMaskId = useId();
  const revealMaskPathRef = useRef<SVGPathElement | null>(null);
  const brushFrontRef = useRef<SVGPathElement | null>(null);
  const auraRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const revealMaskPath = revealMaskPathRef.current;
    const brushFront = brushFrontRef.current;
    const auraStroke = auraRef.current;

    if (!revealMaskPath || !brushFront || !auraStroke) {
      return undefined;
    }

    let rafId = 0;
    const startAt = window.performance.now();

    const frame = (now: number) => {
      const seconds = (now - startAt) / 1000;
      const loopTime = seconds % TOTAL_LOOP_DURATION;
      const state = getLoopState(loopTime);
      const progress = toRange(state.progress);
      const visibleLength = Math.max(progress, MIN_SEGMENT);
      revealMaskPath.setAttribute("stroke-dasharray", `${visibleLength} 1`);
      revealMaskPath.setAttribute("stroke-dashoffset", "0");

      const frontProgressRaw = state.motionDirection === 1 ? progress : 1 - progress;
      const frontProgress = smoothStep(toRange(frontProgressRaw * BRUSH_FRONT_GROWTH));
      const frontLength =
        BRUSH_FRONT_MIN_LENGTH + (BRUSH_FRONT_MAX_LENGTH - BRUSH_FRONT_MIN_LENGTH) * frontProgress;
      const frontStart =
        state.motionDirection >= 0
          ? toRange(progress - frontLength, 0, 1 - frontLength)
          : toRange(progress, 0, 1 - frontLength);
      brushFront.setAttribute("stroke-dasharray", `${frontLength} 1`);
      brushFront.setAttribute("stroke-dashoffset", `${-frontStart}`);
      brushFront.setAttribute("opacity", `${state.edgeOpacity}`);

      auraStroke.setAttribute("stroke-dasharray", `${visibleLength} 1`);
      auraStroke.setAttribute("stroke-dashoffset", "0");
      auraStroke.setAttribute("opacity", `${progress <= MIN_SEGMENT ? 0 : state.aura * 0.45}`);

      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);

    return () => window.cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return (
    <motion.div
      className={`pointer-events-none relative z-[1] mx-auto flex w-full justify-center ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : LOOP_TIMING.fadeIn, ease: "easeOut" }}
      aria-hidden
    >
      <div className="relative w-full">
        <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(122,92,255,0.13),rgba(10,16,18,0)_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(13,21,23,0)_46%,rgba(2,4,5,0.36)_100%)]" />

        <motion.svg
          viewBox="0 0 640 400"
          className="relative z-10 h-auto w-full"
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.01, 1],
                }
          }
          transition={{
            duration: 12,
            delay: AMBIENT_DELAY,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <defs>
            <linearGradient id={coreGradientId} x1="18%" y1="52%" x2="82%" y2="48%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2f4644" />
              <stop offset="50%" stopColor="#3f3d56" />
              <stop offset="100%" stopColor="#5a4a57" />
              {!reduceMotion && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="-4 0;5 0;-4 0"
                  dur="34s"
                  begin={`${AMBIENT_DELAY}s`}
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
            <linearGradient id={washGradientId} x1="18%" y1="52%" x2="82%" y2="48%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(92, 121, 117, 0.34)" />
              <stop offset="52%" stopColor="rgba(88, 86, 121, 0.27)" />
              <stop offset="100%" stopColor="rgba(116, 95, 109, 0.3)" />
            </linearGradient>
            <linearGradient id={highlightGradientId} x1="20%" y1="48%" x2="80%" y2="52%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(204, 214, 209, 0.07)" />
              <stop offset="52%" stopColor="rgba(203, 196, 221, 0.085)" />
              <stop offset="100%" stopColor="rgba(209, 192, 198, 0.06)" />
            </linearGradient>

            <filter id={inkEdgeFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="11" result="grain" />
              <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.15" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="0.24" result="soft" />
              <feMerge>
                <feMergeNode in="soft" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <mask id={dryBreaksMaskId}>
              <rect width="100%" height="100%" fill="white" />
              <path
                d={INFINITY_PATH}
                fill="none"
                stroke="black"
                strokeWidth="7.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="0.02 0.035 0.018 0.031 0.022 0.037 0.016 0.034"
                strokeDashoffset="-0.02"
                opacity="0.46"
              />
            </mask>

            <mask id="brush-reveal-mask">
              <rect width="100%" height="100%" fill="black" />
              <path
                ref={revealMaskPathRef}
                d={INFINITY_PATH}
                fill="none"
                stroke="white"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={reduceMotion ? "1 1" : `${MIN_SEGMENT} 1`}
                strokeDashoffset={0}
              />
            </mask>
          </defs>

          <path
            ref={auraRef}
            d={INFINITY_PATH}
            fill="none"
            stroke={`url(#${washGradientId})`}
            strokeWidth="6.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={reduceMotion ? "1 1" : `${MIN_SEGMENT} 1`}
            strokeDashoffset={0}
            opacity={reduceMotion ? 0.11 : 0}
            filter={`url(#${inkEdgeFilterId})`}
          />

          <g mask="url(#brush-reveal-mask)">
            <path
              d={INFINITY_PATH}
              fill="none"
              stroke={`url(#${washGradientId})`}
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.16}
              filter={`url(#${inkEdgeFilterId})`}
            />
            <g mask={`url(#${dryBreaksMaskId})`}>
              <path
                d={INFINITY_PATH}
                fill="none"
                stroke={`url(#${coreGradientId})`}
                strokeWidth="5.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={reduceMotion ? 0.88 : 0.82}
                filter={`url(#${inkEdgeFilterId})`}
              />
            </g>
            <path
              d={INFINITY_PATH}
              fill="none"
              stroke={`url(#${coreGradientId})`}
              strokeWidth="4.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={reduceMotion ? 0.9 : 0.78}
            />
            <path
              d={INFINITY_PATH}
              fill="none"
              stroke={`url(#${highlightGradientId})`}
              strokeWidth="0.92"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.48}
            />
          </g>

          <path
            ref={brushFrontRef}
            d={INFINITY_PATH}
            fill="none"
            stroke={`url(#${coreGradientId})`}
            strokeWidth="5.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${BRUSH_FRONT_MIN_LENGTH} 1`}
            strokeDashoffset={0}
            opacity={reduceMotion ? 0 : 0}
            filter={`url(#${inkEdgeFilterId})`}
          />

          {PARTICLES.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.cx}
              cy={particle.cy}
              r={particle.radius}
              fill="rgba(219, 228, 240, 0.8)"
              initial={{ opacity: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.14 }
                  : {
                      opacity: [0.02, 0.1, 0.04],
                      cy: [particle.cy + 1.2, particle.cy - 1.8, particle.cy + 1.2],
                    }
              }
              transition={{
                duration: particle.duration,
                delay: 0.9 + particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.svg>
      </div>
    </motion.div>
  );
}
