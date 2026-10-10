"use client";

import { forwardRef, useId } from "react";
import type { EyeFocus, RobotMood } from "./robot.types";

export interface RobotCharacterProps {
  mood?: RobotMood;
  eyeFocus?: EyeFocus;
  className?: string;
}

/**
 * A cute, friendly digital-assistant robot rendered in SVG (full body: head,
 * ears, antenna, expressive eyes, face, body, two arms, two legs). Eyes,
 * mouth and whole-b-GEUP transforms are driven via props/refs so animation
 * stays transform-only (GPU friendly). `forwardRef` lets the orchestrator
 * (CuteRobot) apply jump/land transforms without re-renders.
 */
export const RobotCharacter = forwardRef<SVGSVGElement, RobotCharacterProps>(
  function RobotCharacter({ mood = "neutral", eyeFocus = { x: 0, y: 0 }, className }, ref) {
    const gradId = useId();
    const fill = `url(#${gradId})`;
    const ex = Math.max(-1, Math.min(1, eyeFocus.x ?? 0)) * 2.4;
    const ey = Math.max(-1, Math.min(1, eyeFocus.y ?? 0)) * 1.4;
    const mouthY = mood === "thinking" ? 61 : 66;
    const mouthCurve = mood === "happy" ? 6 : mood === "thinking" ? 0 : 2.6;
    const glintLeftX = 47 + ex;
    const glintLeftY = 52 + ey;
    const glintRightX = 73 + ex;
    const glintRightY = 52 + ey;

    return (
      <svg
        ref={ref}
        viewBox="0 0 120 150"
        width="120"
        height="150"
        aria-hidden="true"
        className={className}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="60" y1="18" x2="60" y2="34" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="13" r="4.5" fill={fill} />

        {/* Ears */}
        <rect x="21" y="44" width="10" height="16" rx="5" fill={fill} opacity="0.9" />
        <rect x="89" y="44" width="10" height="16" rx="5" fill={fill} opacity="0.9" />

        {/* Head */}
        <rect x="30" y="28" width="60" height="52" rx="18" fill={fill} />
        {/* Face plate */}
        <rect x="38" y="38" width="44" height="32" rx="13" fill="#ffffff" opacity="0.16" />

        {/* Eyes */}
        <circle cx="47" cy="52" r="7.5" fill="#0f172a" />
        <circle cx="73" cy="52" r="7.5" fill="#0f172a" />
        <circle cx={glintLeftX} cy={glintLeftY} r="3" fill="#ffffff" />
        <circle cx={glintRightX} cy={glintRightY} r="3" fill="#ffffff" />

        {/* Cheeks */}
        <ellipse cx="42" cy="62" rx="3.4" ry="2.2" fill="#fda4af" opacity="0.7" />
        <ellipse cx="78" cy="62" rx="3.4" ry="2.2" fill="#fda4af" opacity="0.7" />

        {/* Mouth */}
        <path
          d={`M52 ${mouthY} q8 ${mouthCurve} 16 0`}
          stroke="#0f172a"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Body */}
        <path
          d="M36 82 L36 108 Q36 118 48 118 L72 118 Q84 118 84 108 L84 82 Q84 76 76 76 L44 76 Q36 76 36 82 Z"
          fill={fill}
        />
        <rect x="46" y="88" width="28" height="8" rx="4" fill="#ffffff" opacity="0.18" />

        {/* Arms */}
        <path d="M34 86 L22 98" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
        <path d="M86 86 L98 98" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
        <circle cx="20" cy="101" r="5" fill="#60a5fa" />
        <circle cx="100" cy="101" r="5" fill="#60a5fa" />

        {/* Legs */}
        <path d="M48 118 L46 134" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
        <path d="M72 118 L74 134" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
        <rect x="40" y="133" width="14" height="6" rx="3" fill="#1e3a8a" />
        <rect x="66" y="133" width="14" height="6" rx="3" fill="#1e3a8a" />
      </svg>
    );
  },
);

export default RobotCharacter;