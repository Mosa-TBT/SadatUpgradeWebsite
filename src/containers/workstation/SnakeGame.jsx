import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./SnakeGame.css";

const COLS = 22;
const ROWS = 14;
const CELL = 18;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const KEY_DIRS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  W: "up",
  A: "left",
  S: "down",
  D: "right",
};

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export default function SnakeGame({ onExit, reduceMotion = false }) {
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const onExitRef = useRef(onExit);

  const [status, setStatus] = useState("ready"); // ready | playing | over
  const [score, setScore] = useState(0);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = COLS * CELL * dpr;
    canvas.height = ROWS * CELL * dpr;
    ctx.scale(dpr, dpr);

    const W = COLS * CELL;
    const H = ROWS * CELL;
    const speed = reduceMotion ? 175 : 130;

    const g = { snake: [], dir: DIRS.right, queue: [], food: { x: 0, y: 0 }, score: 0, alive: false };
    let intervalId = 0;
    let statusRef = "ready";

    const setStatusBoth = (s) => {
      statusRef = s;
      setStatus(s);
    };

    const drawCell = (x, y, color, glow) => {
      const pad = 2;
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = color;
      roundedRect(ctx, x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#070a12";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, H);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(W, y * CELL);
        ctx.stroke();
      }

      drawCell(g.food.x, g.food.y, "#ff7b54", true);
      g.snake.forEach((seg, i) => drawCell(seg.x, seg.y, i === 0 ? "#c084fc" : "#5eead4", i === 0));
    };

    const spawnFood = () => {
      const occupied = new Set(g.snake.map((s) => `${s.x},${s.y}`));
      let cell;
      let guard = 0;
      do {
        cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        guard += 1;
      } while (occupied.has(`${cell.x},${cell.y}`) && guard < 600);
      g.food = cell;
    };

    const stop = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = 0;
      }
    };

    const gameOver = () => {
      g.alive = false;
      stop();
      setStatusBoth("over");
      draw();
    };

    const tick = () => {
      if (!g.alive) return;

      while (g.queue.length) {
        const next = g.queue.shift();
        if (next.x === -g.dir.x && next.y === -g.dir.y) continue;
        if (next.x === g.dir.x && next.y === g.dir.y) continue;
        g.dir = next;
        break;
      }

      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
        gameOver();
        return;
      }

      const eats = head.x === g.food.x && head.y === g.food.y;
      const body = eats ? g.snake : g.snake.slice(0, -1);
      if (body.some((s) => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      g.snake.unshift(head);
      if (eats) {
        g.score += 1;
        setScore(g.score);
        spawnFood();
      } else {
        g.snake.pop();
      }
      draw();
    };

    const start = () => {
      stop();
      const cx = Math.floor(COLS / 2);
      const cy = Math.floor(ROWS / 2);
      g.snake = [
        { x: cx, y: cy },
        { x: cx - 1, y: cy },
        { x: cx - 2, y: cy },
      ];
      g.dir = DIRS.right;
      g.queue = [];
      g.score = 0;
      g.alive = true;
      spawnFood();
      setScore(0);
      setStatusBoth("playing");
      draw();
      intervalId = window.setInterval(tick, speed);
    };

    const turn = (name) => {
      const d = DIRS[name];
      if (!d) return;
      if (statusRef !== "playing") return;
      const last = g.queue.length ? g.queue[g.queue.length - 1] : g.dir;
      if (d.x === -last.x && d.y === -last.y) return; // no 180° reversal
      if (d.x === last.x && d.y === last.y) return;
      if (g.queue.length < 2) g.queue.push(d);
    };

    const onKeyDown = (e) => {
      const dir = KEY_DIRS[e.key];
      if (statusRef === "playing" && dir) {
        e.preventDefault();
        turn(dir);
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && statusRef !== "playing") {
        e.preventDefault();
        start();
      }
    };

    controlsRef.current = { start, turn, exit: () => onExitRef.current?.() };
    window.addEventListener("keydown", onKeyDown);
    draw();

    return () => {
      stop();
      window.removeEventListener("keydown", onKeyDown);
      controlsRef.current = null;
    };
  }, [reduceMotion]);

  const c = () => controlsRef.current;

  return (
    <div className="ws-snake" onClick={(e) => e.stopPropagation()}>
      <div className="ws-snake-head">
        <span className="ws-snake-title">snake.exe</span>
        <span className="ws-snake-score">Score: {score}</span>
      </div>

      <div className="ws-snake-boardwrap">
        <canvas
          ref={canvasRef}
          className="ws-snake-canvas"
          width={COLS * CELL}
          height={ROWS * CELL}
          role="img"
          aria-label="Snake game board"
        />
        {status !== "playing" && (
          <div className="ws-snake-overlay">
            {status === "ready" ? (
              <>
                <p className="ws-snake-msg">Use Arrow keys or W A S D to move.</p>
                <button type="button" className="ws-snake-btn" onClick={() => c()?.start()}>
                  Start (Enter)
                </button>
              </>
            ) : (
              <>
                <p className="ws-snake-msg ws-snake-msg--over">Game over — Score {score}</p>
                <button type="button" className="ws-snake-btn" onClick={() => c()?.start()}>
                  Play again (Enter)
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="ws-snake-controls">
        <div className="ws-dpad" aria-hidden="false">
          <button type="button" className="ws-dpad-up" onClick={() => c()?.turn("up")} aria-label="Move up">▲</button>
          <button type="button" className="ws-dpad-left" onClick={() => c()?.turn("left")} aria-label="Move left">◀</button>
          <button type="button" className="ws-dpad-down" onClick={() => c()?.turn("down")} aria-label="Move down">▼</button>
          <button type="button" className="ws-dpad-right" onClick={() => c()?.turn("right")} aria-label="Move right">▶</button>
        </div>
        <div className="ws-snake-actions">
          <button type="button" onClick={() => c()?.start()}>Restart</button>
          <button type="button" onClick={() => c()?.exit()}>Exit Game</button>
        </div>
      </div>
    </div>
  );
}

SnakeGame.propTypes = {
  onExit: PropTypes.func.isRequired,
  reduceMotion: PropTypes.bool,
};
