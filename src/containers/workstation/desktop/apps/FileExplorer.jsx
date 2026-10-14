import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaHouse,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { FILE_SYSTEM, fileKind, resolvePath, searchFileSystem } from "../virtualFs";
import { useDesktop, useWindow } from "../context";

const SIDEBAR = [
  { name: "This PC", path: [], icon: FaHouse },
  { name: "Documents", path: ["Documents"], icon: FaFolder },
  { name: "Projects", path: ["Projects"], icon: FaFolder },
  { name: "Images", path: ["Images"], icon: FaFolder },
];

const samePath = (a, b) => a.length === b.length && a.every((s, i) => s === b[i]);

export default function FileExplorer() {
  const { openApp } = useDesktop();
  const win = useWindow();
  const [path, setPath] = useState(win?.payload?.path || []);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const node = useMemo(() => resolvePath(path), [path]);
  const results = useMemo(() => (query.trim() ? searchFileSystem(FILE_SYSTEM, query) : null), [query]);

  const items = results
    ? results.map((r) => ({ node: r.node, path: r.path }))
    : (node.children || []).map((c) => ({ node: c, path: [...path, c.name] }));

  const openItem = (item, itemPath) => {
    if (item.type === "folder") {
      setPath(itemPath);
      setSelected(null);
      setQuery("");
    } else {
      openApp("preview", { file: item });
    }
  };

  return (
    <div className="dt-app dt-explorer">
      <aside className="dt-explorer-side">
        <div className="dt-explorer-side-title">Quick access</div>
        {SIDEBAR.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.name}
              type="button"
              className={"dt-explorer-side-item" + (samePath(s.path, path) ? " is-active" : "")}
              onClick={() => {
                setPath(s.path);
                setSelected(null);
                setQuery("");
              }}
            >
              <Icon aria-hidden />
              <span>{s.name}</span>
            </button>
          );
        })}
      </aside>

      <div className="dt-explorer-main">
        <div className="dt-explorer-toolbar">
          <button
            type="button"
            className="dt-iconbtn"
            onClick={() => setPath(path.slice(0, -1))}
            disabled={!path.length}
            aria-label="Back"
          >
            <FaArrowLeft aria-hidden />
          </button>
          <nav className="dt-breadcrumb" aria-label="Current path">
            <button type="button" className="dt-crumb" onClick={() => setPath([])}>
              This PC
            </button>
            {path.map((seg, i) => (
              <span key={seg} className="dt-crumb-wrap">
                <FaChevronRight aria-hidden className="dt-crumb-sep" />
                <button type="button" className="dt-crumb" onClick={() => setPath(path.slice(0, i + 1))}>
                  {seg}
                </button>
              </span>
            ))}
          </nav>
          <label className="dt-search">
            <FaMagnifyingGlass aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files"
              aria-label="Search files"
            />
          </label>
        </div>

        <div className="dt-explorer-list">
          {items.length === 0 && <div className="dt-empty">No items found.</div>}
          {items.map(({ node: item, path: itemPath }) => {
            const kind = fileKind(item);
            return (
              <button
                key={itemPath.join("/")}
                type="button"
                className={"dt-file" + (selected === item.name ? " is-selected" : "")}
                onClick={() => setSelected(item.name)}
                onDoubleClick={() => openItem(item, itemPath)}
                title={itemPath.join(" / ")}
              >
                {item.type === "folder" ? (
                  <FaFolder aria-hidden className="dt-file-icon dt-file-icon--folder" />
                ) : (
                  <FaFile aria-hidden className={"dt-file-icon dt-file-icon--" + kind} />
                )}
                <span className="dt-file-name">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="dt-explorer-status">
          {items.length} item{items.length === 1 ? "" : "s"}
          {results ? " (search results)" : ""}
        </div>
      </div>
    </div>
  );
}
