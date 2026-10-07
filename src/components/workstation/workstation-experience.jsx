"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import WorkstationScene from "./workstation-scene";
import { initialLines, runCommand } from "./terminal";

export default function WorkstationExperience({
  quality = "high",
  reduceMotion = false,
  inView = true,
  focusKey = 0,
  onFocusChange,
}) {
  const inputRef = useRef(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState(initialLines);
  const [caretOn, setCaretOn] = useState(true);

  useEffect(() => {
    onFocusChange?.(active);
  }, [active, onFocusChange]);

  useEffect(() => {
    if (focusKey > 0) setActive(true);
  }, [focusKey]);

  const activate = useCallback(() => setActive(true), []);
  const exit = useCallback(() => setActive(false), []);

  useEffect(() => {
    if (active) {
      const raf = requestAnimationFrame(() =>
        inputRef.current?.focus({ preventScroll: true })
      );
      return () => cancelAnimationFrame(raf);
    }
    if (inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.blur();
    }
    return undefined;
  }, [active]);

  useEffect(() => {
    if (!active || reduceMotion) {
      setCaretOn(true);
      return undefined;
    }
    const id = setInterval(() => setCaretOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [active, reduceMotion]);

  const submit = useCallback((raw) => {
    const { echo, lines: out, action } = runCommand(raw);
    if (action && action.type === "clear") {
      setLines(initialLines());
      setValue("");
      return;
    }
    setLines((prev) => [...prev, { kind: "in", text: echo }, ...out]);
    setValue("");
    if (action && action.type === "navigate") {
      setTimeout(() => window.location.assign(action.href), 450);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      exit();
    }
  };

  const screen = useMemo(
    () => ({ active, value, lines, caretOn }),
    [active, value, lines, caretOn]
  );

  return (
    <>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={exit}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Sadat Upgrade workstation terminal input"
        className="sr-only"
      />
      <WorkstationScene
        quality={quality}
        reduceMotion={reduceMotion}
        inView={inView}
        screen={screen}
        onActivate={activate}
        onExit={exit}
      />
    </>
  );
}
