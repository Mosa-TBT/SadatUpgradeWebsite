// A safe, predefined in-memory filesystem for the simulated desktop.
// It never touches the visitor's real files or the host machine.

export const FILE_SYSTEM = {
  name: "This PC",
  type: "folder",
  children: [
    {
      name: "Documents",
      type: "folder",
      children: [
        {
          name: "About Sadat Upgrade.txt",
          type: "text",
          content:
            "Sadat Upgrade is an IT services company focused on transforming ideas\n" +
            "into practical digital solutions. From modern websites and custom software\n" +
            "to mobile applications and AI-powered experiences, we help businesses\n" +
            "simplify their work, strengthen their digital presence, and grow.",
        },
        {
          name: "Services.md",
          type: "text",
          content:
            "# Our Services\n\n" +
            "- Web Development\n" +
            "- Mobile App Development\n" +
            "- UI/UX Design\n" +
            "- Digital Marketing\n" +
            "- Custom Software\n" +
            "- AI & Intelligent Automation\n",
        },
      ],
    },
    {
      name: "Projects",
      type: "folder",
      children: [
        {
          name: "Time Travel Caravan",
          type: "folder",
          children: [
            {
              name: "overview.txt",
              type: "text",
              content:
                "A modern tourism platform showcasing Afghanistan's landmarks and culture,\n" +
                "built to help travelers discover destinations through an engaging experience.",
            },
          ],
        },
        {
          name: "MCIT Task Management System",
          type: "folder",
          children: [
            {
              name: "overview.txt",
              type: "text",
              content:
                "A web-based task planning, reporting and monitoring system for the Ministry\n" +
                "of Communications and Information Technology (Laravel + Next.js + MySQL).",
            },
          ],
        },
        {
          name: "Danisha Zad",
          type: "folder",
          children: [
            {
              name: "overview.txt",
              type: "text",
              content: "A digital project featured in the Sadat Upgrade portfolio.",
            },
          ],
        },
        {
          name: "ACF APR System",
          type: "folder",
          children: [
            {
              name: "overview.txt",
              type: "text",
              content:
                "A reporting and workflow platform supporting ACF's APR operations\n" +
                "(Laravel + Next.js + Kobo integration).",
            },
          ],
        },
      ],
    },
    {
      name: "Images",
      type: "folder",
      children: [{ name: "sadat-upgrade.svg", type: "image", src: "/susvg.svg" }],
    },
    {
      name: "readme.txt",
      type: "text",
      content:
        "Welcome to the Sadat Upgrade virtual computer.\n\n" +
        "Everything here is a safe, client-side simulation — nothing runs on a real\n" +
        "operating system. Try the Terminal (type `help` or `snake`) and the Browser.",
    },
  ],
};

export function resolvePath(parts) {
  let node = FILE_SYSTEM;
  for (const part of parts) {
    if (!node.children) return node;
    const next = node.children.find((c) => c.name === part && c.type === "folder");
    if (!next) return node;
    node = next;
  }
  return node;
}

export function fileKind(file) {
  if (file.type === "image") return "image";
  if (file.type === "text") return "text";
  return "file";
}

/** Recursively search the virtual FS by name; returns [{ node, path }]. */
export function searchFileSystem(node, query, path = []) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  const step = (current, currentPath) => {
    for (const child of current.children || []) {
      const childPath = [...currentPath, child.name];
      if (child.name.toLowerCase().includes(q)) results.push({ node: child, path: childPath });
      if (child.type === "folder") step(child, childPath);
    }
  };
  step(node, path);
  return results.slice(0, 12);
}
