import { useEffect, useRef, useState } from "react";
import { initialLines, runCommand, PROMPT_PATH, PROMPT_USER } from "../../terminal";
import SnakeGame from "../../SnakeGame";

const Prompt = () => (
  <span className="ws-prompt" aria-hidden="true">
    <span className="ws-prompt-user">{PROMPT_USER}</span>
    <span className="ws-prompt-sep">:</span>
    <span className="ws-prompt-path">{PROMPT_PATH}</span>
    <span className="ws-prompt-sep">$</span>
  </span>
);

export default function TerminalApp() {
  const [lines, setLines] = useState(initialLines);
  const [value, setValue] = useState("");
  const [gameOpen, setGameOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines, gameOpen]);

  const submit = (raw) => {
    const { echo, lines: out, action } = runCommand(raw);
    setValue("");
    if (raw.trim()) {
      setHistory((h) => [raw, ...h].slice(0, 50));
      setHIndex(-1);
    }
    if (action && action.type === "clear") {
      setLines(initialLines());
      return;
    }
    setLines((prev) => [...prev, { kind: "in", text: echo }, ...out]);
    if (action && action.type === "snake") {
      setGameOpen(true);
      inputRef.current?.blur();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(history.length - 1, hIndex + 1);
        setHIndex(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex > 0) {
        setHIndex(hIndex - 1);
        setValue(history[hIndex - 1]);
      } else {
        setHIndex(-1);
        setValue("");
      }
    }
  };

  const exitGame = () => {
    setGameOpen(false);
    setLines((prev) => [...prev, { kind: "sys", text: "Returned to the terminal." }]);
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="dt-app dt-terminal" onClick={() => { if (!gameOpen) inputRef.current?.focus(); }}>
      <div className="ws-term-output" ref={outputRef} role="log" aria-live="polite">
        {lines.map((line, i) =>
          line.kind === "in" ? (
            <div className="ws-line ws-line--in" key={i}>
              <Prompt />
              <span className="ws-line-text">{line.text}</span>
            </div>
          ) : (
            <div className={`ws-line ws-line--${line.kind}`} key={i}>
              {line.text}
            </div>
          ),
        )}

        {gameOpen ? (
          <SnakeGame onExit={exitGame} />
        ) : (
          <div className="ws-line ws-line--input">
            <Prompt />
            <span className="ws-input-wrap">
              <input
                ref={inputRef}
                className="ws-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command input"
              />
              <span className="ws-caret" aria-hidden="true" data-idle={value ? "false" : "true"} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
