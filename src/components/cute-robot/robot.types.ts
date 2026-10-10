/**
 * Shared types for the Cute Robot. Kept separate so a future chatbot/AI layer
 * (messages, typing indicators, conversation state, i18n, API client) can be
 * added without rewriting the visual components.
 */

export interface RobotTarget {
  /** CSS selector of the section the robot can jump to (e.g. "#services"). */
  selector: string;
}

export type RobotMood = "neutral" | "happy" | "thinking";

/** Normalized eye focus: -1 (left) … 1 (right), 0 = center. */
export interface EyeFocus {
  x: number;
  y: number;
}

export interface RobotMessage {
  id: string;
  text: string;
}

export interface CuteRobotProps {
  /** Section selectors the robot jumps between while scrolling. */
  targets?: string[];
  /** Initial welcome message shown on first click. */
  messages?: string[];
  /** Reduce intensity (e.g., on mobile). */
  compact?: boolean;
  className?: string;
}