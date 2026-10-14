
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  FaFolder,
  FaMagnifyingGlass,
  FaPowerOff,
  FaXmark,
} from "react-icons/fa6";
import { DESKTOP_W, DesktopContext } from "./context";
import Window from "./Window";
import { APPS, DESKTOP_ICONS, PINNED, getApp } from "./appRegistry";
import { FILE_SYSTEM, searchFileSystem } from "./virtualFs";
import "./Desktop.css";

const DESKTOP_H = 600;

const WALLPAPERS = [
  {
    id: "aurora",
    label: "Aurora",
    css: "radial-gradient(120% 95% at 18% 8%, #2a1554, rgba(11,13,26,0) 60%), radial-gradient(85% 70% at 88% 92%, rgba(255,123,84,0.7), rgba(7,10,18,0) 58%), linear-gradient(160deg, #0b0d1a, #070a12)",
  },
  {
    id: "ocean",
    label: "Ocean",
    css: "radial-gradient(70% 60% at 82% 18%, rgba(16,185,129,0.7), rgba(7,18,31,0) 60%), linear-gradient(160deg, #0b2a4a, #06121f 72%)",
  },
  {
    id: "ember",
    label: "Ember",
    css: "radial-gradient(90% 80% at 82% 12%, rgba(255,123,84,0.7), rgba(11,13,18,0) 58%), radial-gradient(70% 60% at 8% 92%, rgba(178,107,255,0.6), rgba(11,13,18,0) 60%), #0b0d12",
  },
  {
    id: "slate",
    label: "Slate",
    css: "linear-gradient(160deg, #1a1e28, #0a0c11)",
  },
];

export default function Desktop({ onClose }) {
  const [windows, setWindows] = useState([]);
  const [startOpen, setStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState("aurora");
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const [toastMsg, setToastMsg] = useState("");
  const [prefs, setPrefs] = useState({
    transparency: true,
    animations: true,
  });

  const [viewportSize, setViewportSize] = useState({
    width: DESKTOP_W,
    height: DESKTOP_H,
  });

  const zRef = useRef(10);
  const idRef = useRef(0);
  const toastTimer = useRef(0);
  const viewportRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 20000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  // Measure the viewport without scaling the desktop root.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;

    const apply = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;

      if (width <= 0 || height <= 0) return;

      setViewportSize((previous) => {
        if (
          previous.width === width &&
          previous.height === height
        ) {
          return previous;
        }

        return { width, height };
      });
    };

    apply();

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(apply);
      resizeObserver.observe(el);
    } else {
      window.addEventListener("resize", apply);
    }

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  const nextZ = () => {
    zRef.current += 1;
    return zRef.current;
  };

  const toast = (message) => {
    setToastMsg(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(""), 2200);
  };

  const setPref = (key, value) => {
    setPrefs((previous) => ({ ...previous, [key]: value }));
  };

  const openApp = (appId, payload) => {
    const meta = getApp(appId);
    if (!meta || !meta.component) return;

    setStartOpen(false);

    setWindows((previous) => {
      if (meta.singleInstance) {
        const existing = previous.find((item) => item.appId === appId);

        if (existing) {
          return previous.map((item) =>
            item.id === existing.id
              ? { ...item, minimized: false, z: nextZ() }
              : item
          );
        }
      }

      const id = (idRef.current += 1);
      const position = previous.length % 5;

      return [
        ...previous,
        {
          id,
          appId,
          title: meta.title,
          payload: payload || null,
          x: 70 + position * 26,
          y: 44 + position * 22,
          w: meta.w,
          h: meta.h,
          z: nextZ(),
          minimized: false,
          maximized: false,
        },
      ];
    });
  };

  const closeWindow = (id) => {
    setWindows((previous) => previous.filter((item) => item.id !== id));
  };

  const minimizeWindow = (id) => {
    setWindows((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, minimized: true } : item
      )
    );
  };

  const toggleMaximize = (id) => {
    setWindows((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, maximized: !item.maximized, z: nextZ() }
          : item
      )
    );
  };

  const focusWindow = (id) => {
    setWindows((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, minimized: false, z: nextZ() }
          : item
      )
    );
  };

  const moveWindow = (id, x, y) => {
    setWindows((previous) =>
      previous.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;

      const target = event.target;

      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (startOpen) {
        setStartOpen(false);
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, onClose]);

  const activeWin =
    windows
      .filter((item) => !item.minimized)
      .sort((a, b) => a.z - b.z)
      .slice(-1)[0] || null;

  const wallpaperCss = (
    WALLPAPERS.find((item) => item.id === wallpaper) || WALLPAPERS[0]
  ).css;

  const clock = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString();

  const appMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    return APPS.filter((app) =>
      app.title.toLowerCase().includes(query)
    );
  }, [search]);

  const fileMatches = useMemo(
    () => (search.trim() ? searchFileSystem(FILE_SYSTEM, search) : []),
    [search]
  );

  const contextValue = {
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
    wallpaper,
    setWallpaper,
    wallpapers: WALLPAPERS,
    prefs,
    setPref,
    // The root is no longer CSS-scaled, so pointer coordinates are 1:1.
    scale: 1,
  };

  return (
    <DesktopContext.Provider value={contextValue}>
      <div className="dt-viewport" ref={viewportRef}>
        <div
          className="dt-root"
          data-transparency={prefs.transparency ? "on" : "off"}
          data-animations={prefs.animations ? "on" : "off"}
          style={{
            width: `${viewportSize.width}px`,
            height: `${viewportSize.height}px`,
            transform: "none",
            zoom: 1,
            background: wallpaperCss,
          }}
          onPointerDown={() => {
            setStartOpen(false);
            setSelectedIcon(null);
          }}
        >
          <div className="dt-icons">
            {DESKTOP_ICONS.map((id) => {
              const app = getApp(id);
              if (!app) return null;
              const Icon = app.icon;

              return (
                <button
                  key={id}
                  type="button"
                  className="dt-icon"
                  data-selected={selectedIcon === id}
                  aria-label={`Open ${app.title}`}
                  onClick={() => setSelectedIcon(id)}
                  onDoubleClick={() => openApp(id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      openApp(id);
                    }
                  }}
                >
                  <span className="dt-icon-glyph">
                    <Icon aria-hidden />
                  </span>
                  <span className="dt-icon-label">{app.title}</span>
                </button>
              );
            })}
          </div>

          {windows.map((item) => {
            const meta = getApp(item.appId);
            const AppComponent = meta?.component;

            if (!AppComponent) return null;

            return (
              <Window key={item.id} win={item}>
                <AppComponent />
              </Window>
            );
          })}

          {startOpen && (
            <div
              className="dt-startmenu"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <label className="dt-startmenu-search">
                <FaMagnifyingGlass aria-hidden />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search apps and files"
                  aria-label="Search apps and files"
                />
              </label>

              {search.trim() ? (
                <div className="dt-startmenu-results">
                  {appMatches.length > 0 && (
                    <>
                      <div className="dt-startmenu-sub">Apps</div>
                      {appMatches.map((app) => {
                        const Icon = app.icon;

                        return (
                          <button
                            key={app.id}
                            type="button"
                            className="dt-startmenu-item"
                            onClick={() => {
                              openApp(app.id);
                              setSearch("");
                            }}
                          >
                            <Icon aria-hidden /> {app.title}
                          </button>
                        );
                      })}
                    </>
                  )}

                  {fileMatches.length > 0 && (
                    <>
                      <div className="dt-startmenu-sub">Files</div>
                      {fileMatches.map((result) => (
                        <button
                          key={result.path.join("/")}
                          type="button"
                          className="dt-startmenu-item"
                          onClick={() => {
                            openApp("preview", { file: result.node });
                            setSearch("");
                          }}
                        >
                          <FaFolder aria-hidden /> {result.node.name}
                          <span className="dt-startmenu-path">
                            {result.path.slice(0, -1).join(" / ")}
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {appMatches.length === 0 && fileMatches.length === 0 && (
                    <div className="dt-empty">No results.</div>
                  )}
                </div>
              ) : (
                <>
                  <div className="dt-startmenu-sub">Pinned</div>

                  <div className="dt-pinned-grid">
                    {PINNED.map((id) => {
                      const app = getApp(id);
                      if (!app) return null;
                      const Icon = app.icon;

                      return (
                        <button
                          key={id}
                          type="button"
                          className="dt-pinned"
                          onClick={() => openApp(id)}
                        >
                          <Icon aria-hidden />
                          <span>{app.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="dt-startmenu-sub">All apps</div>

                  <div className="dt-startmenu-apps">
                    {APPS.filter((app) => app.id !== "preview").map((app) => {
                      const Icon = app.icon;

                      return (
                        <button
                          key={app.id}
                          type="button"
                          className="dt-startmenu-item"
                          onClick={() => openApp(app.id)}
                        >
                          <Icon aria-hidden /> {app.title}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="dt-power">
                <button
                  type="button"
                  className="dt-power-btn"
                  onClick={() => toast("Lock is a simulated demo action.")}
                  aria-label="Lock"
                >
                  {"\u{1F512}"}
                </button>

                <button
                  type="button"
                  className="dt-power-btn"
                  onClick={() => toast("Restart is a simulated demo action.")}
                  aria-label="Restart"
                >
                  {"\u21BB"}
                </button>

                <button
                  type="button"
                  className="dt-power-btn"
                  onClick={onClose}
                  aria-label="Shut down (close the desktop)"
                >
                  <FaPowerOff aria-hidden />
                </button>
              </div>
            </div>
          )}

          <div className="dt-taskbar">
            <button
              type="button"
              className={`dt-start${startOpen ? " is-open" : ""}`}
              onClick={() => setStartOpen((open) => !open)}
              aria-label="Start"
              aria-expanded={startOpen}
            >
              <span className="dt-start-glyph" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>

            <div
              className="dt-task-apps"
              role="toolbar"
              aria-label="Pinned and running applications"
            >
              {PINNED.map((id) => {
                const app = getApp(id);
                if (!app) return null;
                const Icon = app.icon;
                const running = windows.filter((item) => item.appId === id);
                const isActive = activeWin && activeWin.appId === id;

                return (
                  <button
                    key={id}
                    type="button"
                    className={
                      "dt-task-app" +
                      (isActive ? " is-active" : "") +
                      (running.length ? " is-running" : "")
                    }
                    title={app.title}
                    aria-label={app.title}
                    onClick={() => {
                      const item = [...running].sort((a, b) => b.z - a.z)[0];

                      if (item) {
                        if (!item.minimized && isActive) {
                          minimizeWindow(item.id);
                        } else {
                          focusWindow(item.id);
                        }
                      } else {
                        openApp(id);
                      }
                    }}
                  >
                    <Icon aria-hidden />
                  </button>
                );
              })}
            </div>

            <div className="dt-tray">
              <button
                type="button"
                className="dt-tray-exit"
                onClick={onClose}
                aria-label="Exit the virtual desktop back to the 3D view"
              >
                <FaXmark aria-hidden /> Exit
              </button>

              <span className="dt-tray-clock">{clock}</span>
              <span className="dt-tray-date">{date}</span>
            </div>
          </div>

          {toastMsg && (
            <div className="dt-toast" role="status">
              {toastMsg}
            </div>
          )}
        </div>
      </div>
    </DesktopContext.Provider>
  );
}

Desktop.propTypes = {
  onClose: PropTypes.func.isRequired,
};
