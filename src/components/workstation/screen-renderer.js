import * as THREE from "three";

const W = 1536;
const H = 912;

const PROMPT_USER = "guest@sadatupgrade";
const PROMPT_PATH = "~";

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

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawTracked(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x - spacing;
}

export function createScreenRenderer({ width = W, height = H } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  let logo = null;

  function setLogo(img) {
    logo = img;
  }

  function drawBar() {
    const bh = 84;
    ctx.fillStyle = COLORS.barBg;
    ctx.fillRect(0, 0, width, bh);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, bh);
    ctx.lineTo(width, bh);
    ctx.stroke();

    const dots = ["#ff5f57", "#febc2e", "#28c840"];
    dots.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(48 + i * 34, bh / 2, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    const logoH = 40;
    const logoW = logo ? (logo.width / logo.height) * logoH : 0;
    let textX = 178;
    if (logo) {
      ctx.drawImage(logo, 150, (bh - logoH) / 2, logoW, logoH);
      textX = 150 + logoW + 18;
    }
    ctx.fillStyle = COLORS.dim;
    ctx.font = "500 25px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("sadatupgrade — zsh — 80×24", textX, bh / 2 + 1);

    return bh;
  }

  function drawWelcome(bh) {
    const cy = bh + (height - bh) * 0.36;
    if (logo) {
      const lh = 240;
      const lw = (logo.width / logo.height) * lh;
      ctx.drawImage(logo, (width - lw) / 2, cy - lh / 2, lw, lh);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "700 62px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    ctx.fillText("Sadat Upgrade", width / 2, cy + 210);

    ctx.fillStyle = COLORS.faint;
    ctx.font = "600 22px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const tw = ctx.measureText("INTERACTIVE WORKSTATION").width;
    drawTracked(
      ctx,
      "INTERACTIVE WORKSTATION",
      (width - tw) / 2,
      cy + 258,
      7
    );

    const pw = 468;
    const ph = 64;
    const px = (width - pw) / 2;
    const py = cy + 320;
    roundRect(ctx, px, py, pw, ph, ph / 2);
    ctx.fillStyle = "rgba(148,163,184,0.09)";
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 24px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click the laptop to start typing", width / 2, py + ph / 2 + 1);
    ctx.textBaseline = "alphabetic";
  }

  function drawTerminal(bh, state) {
    const padX = 66;
    const top = bh + 54;
    const lineH = 42;
    const font = "27px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    const inputH = 74;
    const bottom = height - 46;
    const maxLines = Math.floor((bottom - top - inputH) / lineH);

    const visible = state.lines.slice(-Math.max(0, maxLines));
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = font;

    let y = top + 30;
    for (const line of visible) {
      if (line.kind === "in") {
        let x = padX;
        x = drawPrompt(ctx, x, y);
        ctx.fillStyle = COLORS.text;
        ctx.fillText(line.text, x, y);
      } else if (line.kind === "head") {
        ctx.fillStyle = COLORS.head;
        ctx.fillText(line.text, padX, y);
      } else if (line.kind === "sys") {
        ctx.fillStyle = COLORS.sys;
        ctx.fillText(line.text, padX, y);
      } else {
        ctx.fillStyle = COLORS.out;
        ctx.fillText(line.text, padX, y);
      }
      y += lineH;
    }

    // Input row pinned near the bottom
    const iy = bottom - 24;
    let x = padX;
    x = drawPrompt(ctx, x, iy);
    ctx.fillStyle = COLORS.text;
    ctx.font = font;
    ctx.fillText(state.value, x, iy);

    if (state.value.length === 0 || state.caretOn) {
      const w = ctx.measureText(state.value).width;
      ctx.fillStyle = COLORS.caret;
      ctx.fillRect(x + w + 3, iy - 27, 4, 34);
    }
  }

  function drawPrompt(ctx, x, y) {
    ctx.fillStyle = COLORS.user;
    ctx.fillText(PROMPT_USER, x, y);
    x += ctx.measureText(PROMPT_USER).width;
    ctx.fillStyle = COLORS.faint;
    ctx.fillText(":", x, y);
    x += ctx.measureText(":").width;
    ctx.fillStyle = COLORS.path;
    ctx.fillText(PROMPT_PATH, x, y);
    x += ctx.measureText(PROMPT_PATH).width;
    ctx.fillStyle = COLORS.faint;
    ctx.fillText("$", x, y);
    x += ctx.measureText("$").width + 14;
    return x;
  }

  function draw(state) {
    // screen base
    const g = ctx.createRadialGradient(
      width * 0.85,
      0,
      0,
      width * 0.6,
      height * 0.4,
      width
    );
    g.addColorStop(0, "#16233d");
    g.addColorStop(0.5, "#0b1120");
    g.addColorStop(1, "#070a12");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const bh = drawBar();

    if (state.active) {
      drawTerminal(bh, state);
    } else {
      drawWelcome(bh);
    }

    // subtle scanlines
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    for (let yy = 0; yy < height; yy += 4) {
      ctx.fillRect(0, yy, width, 1);
    }

    // vignette
    const v = ctx.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.3,
      width / 2,
      height / 2,
      height * 0.95
    );
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, width, height);

    texture.needsUpdate = true;
  }

  return { canvas, texture, draw, setLogo };
}
