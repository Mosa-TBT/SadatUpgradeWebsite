"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface RobotSpeechBubbleProps {
  text: string;
  /** Unique key to re-trigger appear animation per message. */
  appearKey?: string | number;
  className?: string;
}

/**
 * The robot's speech bubble. Polished card with a small tail pointing at the
 * robot, `aria-live` so screen readers announce messages, and a lightweight
 * CSS entrance animation (transform-based, safe with reduced motion).
 */
export function RobotSpeechBubble({ text, appearKey, className }: RobotSpeechBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.classList.remove("robot-bubble-enter");
    // Force reflow so re-triggering works for each new message.
    void node.offsetWidth;
    node.classList.add("robot-bubble-enter");
  }, [appearKey, text]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(
        "relative max-w-[240px] rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-xl",
        className,
      )}
    >
      <span className="text-base">{text}</span>
      {/* Tail */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r border-blue-100 bg-white"
      />
    </div>
  );
}

export default RobotSpeechBubble;