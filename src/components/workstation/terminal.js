export const PROMPT_USER = "guest@sadatupgrade";
export const PROMPT_PATH = "~";

const HELP = [
  "Available commands:",
  "  about       who we are and what we do",
  "  services    the services we offer",
  "  projects    recent work in our portfolio",
  "  clients     how our clients feel about us",
  "  contact     how to reach the team",
  "  open <page> navigate to a page (e.g. open services)",
  "  echo <text> print something back",
  "  clear       clear the screen",
  "  help        show this list",
];

const ROUTES = [
  "services",
  "portfolio",
  "pricing",
  "about",
  "contact",
  "careers",
  "blog",
  "login",
];

export function initialLines() {
  return [
    { kind: "head", text: "Sadat Upgrade Workstation  ·  v1.0" },
    { kind: "sys", text: "Secure shell session established." },
    { kind: "sys", text: "Type `help` to see available commands." },
  ];
}

export { ROUTES };

export function runCommand(raw) {
  const input = raw;
  const out = [];
  const trimmed = input.trim();

  if (!trimmed) {
    return { echo: input, lines: [], action: null };
  }

  const [cmd, ...args] = trimmed.split(/\s+/);
  const key = cmd.toLowerCase();

  if (key === "clear") {
    return { echo: input, lines: [], action: { type: "clear" } };
  }

  if (key === "open") {
    const page = (args[0] || "").toLowerCase();
    if (ROUTES.includes(page)) {
      return {
        echo: input,
        lines: [{ kind: "out", text: `Opening /${page} …` }],
        action: { type: "navigate", href: `/${page}` },
      };
    }
    return {
      echo: input,
      lines: [
        {
          kind: "out",
          text: `Nothing to open at "${page || "?"}". Try: ${ROUTES.join(", ")}`,
        },
      ],
      action: null,
    };
  }

  const handlers = {
    help: () => HELP,
    whoami: () => [
      PROMPT_USER,
      "role: visitor  ·  access: public  ·  status: exploring",
    ],
    about: () => [
      "Sadat Upgrade is a digital innovation studio.",
      "We design and build web, mobile and brand experiences",
      "that turn visitors into customers.",
    ],
    services: () => [
      "Our services:",
      "  Web Development · Mobile Apps · UI/UX Design",
      "  Digital Marketing · E-commerce · Analytics & Insights",
    ],
    projects: () => [
      "Featured work:",
      "  E-commerce Platform   · Web Development",
      "  Mobile Banking App    · Mobile App",
      "  SaaS Dashboard        · UI/UX Design",
      "  Fitness App           · Mobile App",
      "  Corporate Rebrand     · Branding",
      "Type `open portfolio` to see them all.",
    ],
    clients: () => [
      "  “Sales have tripled and our customers love it.”  — RetailMax Inc.",
      "  “Intuitive, secure and beautifully built.”        — SecureBank",
      "  “It transformed how our users see their data.”    — DataFlow",
    ],
    contact: () => [
      "Let's build something together.",
      "  email    hello@sadatupgrade.com",
      "  phone    +1 (555) 123-4567",
      "  office   New York, NY 10001",
      "Type `open contact` to start a project.",
    ],
    echo: () => [args.join(" ")],
    date: () => [new Date().toString()],
    pwd: () => [`/home/${PROMPT_USER}`],
    ls: () => [
      "about   services   portfolio   pricing",
      "contact   careers   blog   login",
    ],
    sudo: () => ["Nice try — this workstation belongs to Sadat Upgrade."],
    hello: () => ["Hello there. Type `help` to see what this terminal can do."],
    hi: () => ["Hey. Type `help` to get started."],
  };

  const handler = handlers[key];
  if (handler) {
    return {
      echo: input,
      lines: (handler() || []).map((text) => ({ kind: "out", text })),
      action: null,
    };
  }

  return {
    echo: input,
    lines: [
      { kind: "out", text: `command not found: ${cmd}. Type \`help\` for a list.` },
    ],
    action: null,
  };
}
