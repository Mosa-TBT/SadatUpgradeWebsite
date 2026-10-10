import * as THREE from "three";
import type { ScreenLine } from "./terminal";

const W = 1536;
const H = 912;

const PROMPT_USER = "guest@sadatupgrade";
const PROMPT_PATH = "~";

export interface TerminalScreenState {
  lines: ScreenLine[];
  value: string;
  active: boolean;
  caretOn: boolean;
}

const COLORS = {
  barBg: "rgba(9,13,23,0.82)",
  border: "rgba(148,163,184,0.14)",
  text: "#e2e8f0",
  dim: "#8ea2c0",
  faint: "#64748b",
  sys: "#7c8aa5",
  head: "#7c8aa5",
  user: "#5eead4",
  path: "#c084fc",
  caret: "#7dd3fc",
  out: "#a3b3c9",
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
): number {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x - spacing;
}

export function createScreenRenderer(
  { width = W, height = H }: { width?: number; height?: number } = {},
): {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
  draw: (state: TerminalScreenState) => void;
  setLogo: (img: HTMLImageElement) => void;
} {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to acquire 2D canvas context for workstation screen");
  }
  const renderingContext: CanvasRenderingContext2D = ctx;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  let logo: HTMLImageElement | null = null;

  function setLogo(img: HTMLImageElement): void {
    logo = img;
  }

  function drawBar(): number {
    const bh = 84;
    renderingContext.fillStyle = COLORS.barBg;
    renderingContext.fillRect(0, 0, width, bh);
    renderingContext.strokeStyle = COLORS.border;
    renderingContext.lineWidth = 2;
    renderingContext.beginPath();
    renderingContext.moveTo(0, bh);
    renderingContext.lineTo(width, bh);
    renderingContext.stroke();

    const dots = ["#ff5f57", "#febc2e", "#28c840"];
    dots.forEach((c, i) => {
      renderingContext.fillStyle = c;
      renderingContext.beginPath();
      renderingContext.arc(48 + i * 34, bh / 2, 12, 0, Math.PI * 2);
      renderingContext.fill();
    });

    const logoH = 40;
    const logoW = logo ? (logo.width / logo.height) * logoH : 0;
    let textX = 178;
    if (logo) {
      renderingContext.drawImage(logo, 150, (bh - logoH) / 2, logoW, logoH);
      textX = 150 + logoW + 18;
    }
    renderingContext.fillStyle = COLORS.dim;
    renderingContext.font = "500 25px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    renderingContext.textBaseline = "middle";
    renderingContext.textAlign = "left";
    renderingContext.fillText("sadatupgrade — zsh — 80×24", textX, bh / 2 + 1);

    return bh;
  }

  function drawWelcome(bh: number): void {
    const cy = bh + (height - bh) * 0.36;
    if (logo) {
      const lh = 240;
      const lw = (logo.width / logo.height) * lh;
      renderingContext.drawImage(logo, (width - lw) / 2, cy - lh / 2, lw, lh);
    }
    renderingContext.textAlign = "center";
    renderingContext.textBaseline = "alphabetic";
    renderingContext.fillStyle = "#f1f5f9";
    renderingContext.font = "700 62px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    renderingContext.fillText("Sadat Upgrade", width / 2, cy + 210);

    renderingContext.fillStyle = COLORS.faint;
    renderingContext.font = "600 22px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const tw = renderingContext.measureText("INTERACTIVE WORKSTATION").width;
    drawTracked(renderingContext, "INTERACTIVE WORKSTATION", (width - tw) / 2, cy + 258, 7);

    const pw = 468;
    const ph = 64;
    const px = (width - pw) / 2;
    const py = cy + 320;
    roundRect(renderingContext, px, py, pw, ph, ph / 2);
    renderingContext.fillStyle = "rgba(148,163,184,0.09)";
    renderingContext.fill();
    renderingContext.strokeStyle = "rgba(148,163,184,0.3)";
    renderingContext.lineWidth = 2;
    renderingContext.stroke();
    renderingContext.fillStyle = "#cbd5e1";
    renderingContext.font = "500 24px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    renderingContext.textAlign = "center";
    renderingContext.textBaseline = "middle";
    renderingContext.fillText("Click the laptop to start typing", width / 2, py + ph / 2 + 1);
    renderingContext.textBaseline = "alphabetic";
  }

  function drawPrompt(ctx2: CanvasRenderingContext2D, x: number, y: number): number {
    ctx2.fillStyle = COLORS.user;
    ctx2.fillText(PROMPT_USER, x, y);
    x += ctx2.measureText(PROMPT_USER).width;
    ctx2.fillStyle = COLORS.faint;
    ctx2.fillText(":", x, y);
    x += ctx2.measureText(":").width;
    ctx2.fillStyle = COLORS.path;
    ctx2.fillText(PROMPT_PATH, x, y);
    x += ctx2.measureText(PROMPT_PATH).width;
    ctx2.fillStyle = COLORS.faint;
    ctx2.fillText("$", x, y);
    x += ctx2.measureText("$").width + 14;
    return x;
  }

  function drawTerminal(bh: number, state: TerminalScreenState): void {
    const padX = 66;
    const top = bh + 54;
    const lineH = 42;
    const font = "27px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    const inputH = 74;
    const bottom = height - 46;
    const maxLines = Math.floor((bottom - top - inputH) / lineH);

    const visible = state.lines.slice(-Math.max(0, maxLines));
    renderingContext.textAlign = "left";
    renderingContext.textBaseline = "alphabetic";
    renderingContext.font = font;

    let y = top + 30;
    for (const line of visible) {
      if (line.kind === "in") {
        let x = padX;
        x = drawPrompt(renderingContext, x, y);
        renderingContext.fillStyle = COLORS.text;
        renderingContext.fillText(line.text, x, y);
      } else if (line.kind === "head") {
        renderingContext.fillStyle = COLORS.head;
        renderingContext.fillText(line.text, padX, y);
      } else if (line.kind === "sys") {
        renderingContext.fillStyle = COLORS.sys;
        renderingContext.fillText(line.text, padX, y);
      } else {
        renderingContext.fillStyle = COLORS.out;
        renderingContext.fillText(line.text, padX, y);
      }
      y += lineH;
    }

    const iy = bottom - 24;
    let x = padX;
    x = drawPrompt(renderingContext, x, iy);
    renderingContext.fillStyle = COLORS.text;
    renderingContext.font = font;
    renderingContext.fillText(state.value, x, iy);

    if (state.value.length === 0 || state.caretOn) {
      const w = renderingContext.measureText(state.value).width;
      renderingContext.fillStyle = COLORS.caret;
      renderingContext.fillRect(x + w + 3, iy - 27, 4, 34);
    }
  }

  function draw(state: TerminalScreenState): void {
    const g = renderingContext.createRadialGradient(
      width * 0.85,
      0,
      0,
      width * 0.6,
      height * 0.4,
      width,
    );
    g.addColorStop(0, "#16233d");
    g.addColorStop(0.5, "#0b1120");
    g.addColorStop(1, "#070a12");
    renderingContext.fillStyle = g;
    renderingContext.fillRect(0, 0, width, height);

    const bh = drawBar();

    if (state.active) {
      drawTerminal(bh, state);
    } else {
      drawWelcome(bh);
    }

    renderingContext.fillStyle = "rgba(255,255,255,0.015)";
    for (let yy = 0; yy < height; yy += 4) {
      renderingContext.fillRect(0, yy, width, 1);
    }

    const v = renderingContext.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.3,
      width / 2,
      height / 2,
      height * 0.95,
    );
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.55)");
    renderingContext.fillStyle = v;
    renderingContext.fillRect(0, 0, width, height);

    texture.needsUpdate = true;
  }

  return { canvas, texture, draw, setLogo };
}