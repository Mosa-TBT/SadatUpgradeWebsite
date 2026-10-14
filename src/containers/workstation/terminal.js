// Simulated, client-side "PowerShell-style" terminal for the Sadat Upgrade
// website. This is a demonstration only: it runs a fixed whitelist of safe
// commands and never executes real shell/PowerShell/JS or contacts a backend.

export const PROMPT_USER = "guest@sadatupgrade";
export const PROMPT_PATH = "~";

export const initialLines = () => [
  { kind: "head", text: "Sadat Upgrade Workstation  ·  v1.0" },
  { kind: "sys", text: "Simulated session — no real commands are executed." },
  { kind: "sys", text: "Type `help` to see available commands." },
];

const SERVICES = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "Custom Software",
  "AI & Intelligent Automation",
];

const PROJECTS = [
  ["Time Travel Caravan", "Tourism & Travel"],
  ["MCIT Task Management System", "Government & Enterprise"],
  ["Danisha Zad", "Digital Solutions"],
  ["ACF APR System", "NGO & Reporting"],
];

const HELP = [
  "Available commands:",
  "  help        show available commands",
  "  about       learn about Sadat Upgrade",
  "  projects    view projects",
  "  services    view services",
  "  contact     display contact information",
  "  snake       start the Snake game",
  "  clear       clear terminal output",
  "  whoami      show the current session user",
  "  echo <text> print something back",
];

/**
 * Run one line of input against the command whitelist.
 * @param {string} raw - the raw input line
 * @returns {{ echo: string, lines: {kind:string,text:string}[], action: null | {type:"clear"} | {type:"scroll", href:string} }}
 */
export function runCommand(raw) {
  const input = raw;
  const trimmed = raw.trim();

  if (!trimmed) return { echo: input, lines: [], action: null };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const key = cmd.toLowerCase();

  if (key === "clear") {
    return { echo: input, lines: [], action: { type: "clear" } };
  }

  if (key === "snake") {
    return {
      echo: input,
      lines: [
        { kind: "sys", text: "Starting Snake…" },
        { kind: "out", text: "Controls: Arrow keys or W A S D · Enter to start/restart." },
      ],
      action: { type: "snake" },
    };
  }

  if (key === "open") {
    const page = (args[0] || "").toLowerCase();
    const map = { services: "#services", about: "#about", projects: "#portfolio", portfolio: "#portfolio", contact: "#contact", work: "#portfolio" };
    if (map[page]) {
      return {
        echo: input,
        lines: [{ kind: "out", text: `Scrolling to ${page} …` }],
        action: { type: "scroll", href: map[page] },
      };
    }
    return {
      echo: input,
      lines: [{ kind: "out", text: `Nothing to open at "${page || "?"}". Try: ${Object.keys(map).join(", ")}` }],
      action: null,
    };
  }

  const out = (lines) => ({ echo: input, lines: lines.map((text) => ({ kind: "out", text })), action: null });

  const handlers = {
    help: () => HELP,
    whoami: () => [PROMPT_USER, "role: visitor  ·  access: public  ·  status: exploring"],
    about: () => [
      "Sadat Upgrade is a digital innovation company.",
      "We turn ideas into practical digital solutions — modern websites,",
      "custom software, mobile apps, UI/UX, and AI-powered experiences.",
    ],
    services: () => ["Our services:", ...SERVICES.map((s) => `  · ${s}`)],
    projects: () => [
      "Featured work:",
      ...PROJECTS.map(([name, cat]) => `  · ${name}  (${cat})`),
      "Type `open projects` to view them on the page.",
    ],
    contact: () => [
      "Let's build something together.",
      "  email   info@sadaatupgrade.com",
      "  web     sadaatupgrade.com",
      "Type `open contact` to jump to the contact form.",
    ],
    echo: () => [args.join(" ")],
    date: () => [new Date().toString()],
    pwd: () => [`/home/${PROMPT_USER}`],
    ls: () => ["about   services   projects   contact"],
    sudo: () => ["Nice try — this workstation is a simulated demo."],
    hi: () => ["Hey. Type `help` to get started."],
    hello: () => ["Hello there. Type `help` to see what this terminal can do."],
  };

  const handler = handlers[key];
  if (handler) return out(handler());

  return out([`command not found: ${cmd}. Type \`help\` for a list.`]);
}
