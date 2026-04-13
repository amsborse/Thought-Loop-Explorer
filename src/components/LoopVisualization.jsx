import { useMemo, useState } from "react";
import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import { STEP_COLORS } from "../lib/loopTheme";

const SVG_SIZE = 640;
const CENTER = SVG_SIZE / 2;
const RADIUS = 210;

function polar(index, total, radius = RADIUS) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

export default function LoopVisualization({
  loop,
  activeStep,
  onSelectStep,
  breakMode,
  onSelectInterruption,
  selectedInterruption,
}) {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });
  const clarity = useSpring(0.18, { stiffness: 80, damping: 20, mass: 1.2 });
  const [clarityValue, setClarityValue] = useState(0.18);

  useMotionValueEvent(clarity, "change", (value) => {
    setClarityValue(value);
  });

  const nodePositions = useMemo(
    () => loop.steps.map((step, index) => ({ ...step, ...polar(index, loop.steps.length) })),
    [loop.steps]
  );

  const interruptionsMap = useMemo(
    () => new Map(loop.interruptions.map((item) => [item.stage, item])),
    [loop.interruptions]
  );

  const particles = useMemo(() => {
    const list = [];
    const count = 220;
    for (let i = 0; i < count; i += 1) {
      const anchorNode = nodePositions[i % nodePositions.length];
      const scatterRadius = 260 + ((i * 17) % 110);
      const scatterAngle = (i * 0.43) % (Math.PI * 2);
      list.push({
        id: i,
        anchorX: anchorNode.x + Math.cos(i * 0.85) * (12 + (i % 8)),
        anchorY: anchorNode.y + Math.sin(i * 0.72) * (12 + (i % 8)),
        scatterX: CENTER + Math.cos(scatterAngle) * scatterRadius,
        scatterY: CENTER + Math.sin(scatterAngle) * scatterRadius,
        size: 0.9 + (i % 3) * 0.7,
      });
    }
    return list;
  }, [nodePositions]);

  const activeLabel = activeStep?.label;

  return (
    <div
      className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_25px_70px_rgba(3,7,9,0.65)] backdrop-blur-md md:p-7"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dist = Math.hypot(x - cx, y - cy);
        const maxDist = Math.min(cx, cy) * 0.95;
        const target = Math.max(0.14, 1 - dist / maxDist);
        clarity.set(target);
        setCursor({ x, y, active: true });
      }}
      onMouseLeave={() => {
        clarity.set(0.14);
        setCursor((prev) => ({ ...prev, active: false }));
      }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-3 rounded-[2.4rem]"
        style={{
          background: cursor.active
            ? `radial-gradient(180px circle at ${cursor.x}px ${cursor.y}px, rgba(139, 92, 246, 0.22), transparent 80%)`
            : "transparent",
        }}
      />

      <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="relative z-10 mx-auto h-auto w-full max-w-[760px]">
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 76, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50% 50%" }}>
          {nodePositions.map((node, index) => {
            const next = nodePositions[(index + 1) % nodePositions.length];
            const active = activeLabel === node.label;
            const hovered = hoveredStep === node.label;
            return (
              <g key={`${node.label}-line`}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={active || hovered ? "rgba(139,92,246,0.95)" : "rgba(45,212,191,0.38)"}
                  strokeWidth={active || hovered ? 2.6 : 1.4}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </motion.g>

        <g>
          {particles.map((particle) => {
            const x = particle.scatterX + (particle.anchorX - particle.scatterX) * clarityValue;
            const y = particle.scatterY + (particle.anchorY - particle.scatterY) * clarityValue;
            const opacity = 0.12 + clarityValue * 0.78;
            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={particle.size}
                fill="rgba(226, 232, 240, 0.9)"
                opacity={opacity}
              />
            );
          })}
        </g>

        {nodePositions.map((node, index) => {
          const active = activeLabel === node.label;
          const hovered = hoveredStep === node.label;
          const interruption = interruptionsMap.get(node.label);
          const selectedMarker = selectedInterruption?.stage === node.label;
          const markerX = node.x + 28;
          const markerY = node.y - 28;
          return (
            <motion.g
              key={node.label}
              initial={{ opacity: 0, scale: 0.2, x: (index - 3) * 18, y: (index - 3) * -12 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + index * 0.09 }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={active ? 34 : hovered ? 30 : 26}
                fill="rgba(8, 12, 14, 0.9)"
                stroke={STEP_COLORS[node.label]}
                strokeWidth={active || hovered ? 2.6 : 1.3}
                filter={active || hovered ? "url(#nodeGlow)" : undefined}
                opacity={active || hovered ? 1 : 0.75}
                onMouseEnter={() => setHoveredStep(node.label)}
                onMouseLeave={() => setHoveredStep(null)}
                onClick={() => onSelectStep(node)}
                className="cursor-pointer transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fill="rgba(241,245,249,0.95)"
                fontSize={11}
                fontWeight={500}
                pointerEvents="none"
              >
                {node.label}
              </text>

              {breakMode && interruption && (
                <g onClick={() => onSelectInterruption(interruption)} className="cursor-pointer">
                  <motion.circle
                    cx={markerX}
                    cy={markerY}
                    r={selectedMarker ? 9 : 7}
                    fill="#8b5cf6"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <circle cx={markerX} cy={markerY} r={selectedMarker ? 15 : 12} fill="none" stroke="#8b5cf6" strokeOpacity="0.5" />
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {hoveredStep && (
        <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-white/20 bg-black/55 px-4 py-1.5 text-xs text-white/90 backdrop-blur">
          {hoveredStep}
        </div>
      )}
    </div>
  );
}
