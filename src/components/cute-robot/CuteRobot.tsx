"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RobotCharacter } from "./RobotCharacter";
import { RobotSpeechBubble } from "./RobotSpeechBubble";
import type { CuteRobotProps, EyeFocus, RobotMessage } from "./robot.types";

const DEFAULT_TARGETS = [
  "#hero",
  "#services",
  "#process",
  "#technology",
  "#projects",
  "#testimonials",
  "#faq",
  "#cta",
];

const DEFAULT_MESSAGES: string[] = [
  "Hello! 👋 I'm Sadaat — your digital guide.",
  "Looking for a website, app, or brand? I can point you in the right direction. 🚀",
  "Scroll with me through the platform — we have a lot to show you!",
];

const IS_CLIENT = typeof window !== "undefined";
const reducedMotion =
  IS_CLIENT &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer =
  IS_CLIENT &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * A reusable, future-proof Cute Robot.
 *
 * Scroll behaviour: the robot "jumps" between the section targets passed in
 * `targets`. Mouse interaction: eyes/head subtly follow the cursor (disabled on
 * touch and for reduced motion). Click / Enter / Space opens a speech bubble
 * with rotating messages. Positioning uses a GPU transform on one element and
 * the character animates with transform-only classes — no continuous React
 * renders, so it stays light on desktop and mobile.
 */
export function CuteRobot({
  targets = DEFAULT_TARGETS,
  messages = DEFAULT_MESSAGES,
  compact = false,
  className,
}: CuteRobotProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<SVGSVGElement>(null);

  const [eyeFocus, setEyeFocus] = useState<EyeFocus>({ x: 0, y: 0 });
  const [message, setMessage] = useState<RobotMessage | null>(null);
  const messageIndex = useRef(-1);
  const bubbleTimer = useRef<number | undefined>(undefined);

  const yCurrent = useRef(0);
  const yTarget = useRef(0);
  const eyeTarget = useRef<EyeFocus>({ x: 0, y: 0 });
  const raf = useRef<number | undefined>(undefined);
  const lastMove = useRef(0);

  const pushBubble = useCallback(() => {
    messageIndex.current = (messageIndex.current + 1) % messages.length;
    setMessage({
      id: `${messages.length}-${messageIndex.current}-${Date.now()}`,
      text: messages[messageIndex.current] ?? "Hello! 👋",
    });
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setMessage(null), 7000);
  }, [messages]);

  const pulse = useCallback(() => {
    const node = innerRef.current;
    if (!node) return;
    node.classList.remove("robot-bounce");
    void node.getBoundingClientRect();
    node.classList.add("robot-bounce");
  }, []);

  const tick = useCallback(() => {
    raf.current = undefined;

    const y = yCurrent.current;
    yCurrent.current = y + (yTarget.current - y) * 0.16;
    if (outerRef.current) {
      outerRef.current.style.transform = `translate3d(0, ${yCurrent.current}px, 0)`;
    }
    if (Math.abs(yTarget.current - yCurrent.current) > 1.5) {
      raf.current = requestAnimationFrame(tick);
    }

    const ex = eyeFocus.x + (eyeTarget.current.x - eyeFocus.x) * 0.2;
    const ey = eyeFocus.y + (eyeTarget.current.y - eyeFocus.y) * 0.2;
    if (Math.abs(ex - eyeFocus.x) > 0.01 || Math.abs(ey - eyeFocus.y) > 0.01) {
      setEyeFocus({ x: ex, y: ey });
    }
    if (Date.now() - lastMove.current < 900) {
      if (raf.current === undefined) raf.current = requestAnimationFrame(tick);
    }
  }, [eyeFocus]);

  const requestTick = useCallback(() => {
    lastMove.current = Date.now();
    if (raf.current === undefined) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const update = (): void => {
      const vh = window.innerHeight;
      let best: { el: Element; gap: number } | null = null;
      for (const selector of targets) {
        const el = document.querySelector(selector);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const gap = Math.abs(rect.top + rect.height / 2 - vh / 2);
        if (!best || gap < best.gap) best = { el, gap };
      }
      if (best) {
        const rect = best.el.getBoundingClientRect();
        const desired = rect.top + rect.height / 2 - vh / 2;
        const limit = vh * (compact ? 0.32 : 0.4);
        yTarget.current = clamp(desired, -limit, limit);
        void best.el.id;
        if (!reducedMotion) pulse();
      }
      requestTick();
    };

    const onScroll = (): void => {
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current !== undefined) cancelAnimationFrame(raf.current);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, compact]);

  useEffect(() => {
    const onMove = (e: PointerEvent): void => {
      if (isCoarsePointer) return;
      eyeTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
      requestTick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [requestTick]);

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        right: compact ? 8 : 24,
        top: "50%",
        zIndex: 45,
        willChange: "transform",
        touchAction: "manipulation",
      }}
      role="button"
      tabIndex={0}
      aria-label="Sadaat, the website assistant robot — press to hear from me"
      onClick={(e) => {
        e.stopPropagation();
        pushBubble();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pushBubble();
        }
      }}
    >
      <div ref={outerRef} className="relative" style={{ willChange: "transform" }}>
        {message && (
          <div className="absolute -top-3 right-8 sm:right-10 z-10 -translate-y-full">
            <RobotSpeechBubble text={message.text} appearKey={message.id} />
          </div>
        )}
        <div className="transition-transform">
          <RobotCharacter
            ref={innerRef}
            mood="happy"
            eyeFocus={eyeFocus}
            className={compact ? "h-[80px] w-[64px]" : "h-[120px] w-[96px]"}
          />
        </div>
      </div>
    </div>
  );
}

export default CuteRobot;