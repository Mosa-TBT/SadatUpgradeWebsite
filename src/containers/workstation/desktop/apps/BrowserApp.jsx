import { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHouse,
  FaMagnifyingGlass,
  FaRotateRight,
} from "react-icons/fa6";

const HOME = "about:home";
const searchUrl = (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&ia=web`;

function classify(input) {
  const v = input.trim();
  if (!v) return null;
  const isUrl = /^https?:\/\//i.test(v) || /^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(v);
  if (isUrl) return { type: "url", value: /^https?:/i.test(v) ? v : `https://${v}` };
  return { type: "search", value: v };
}

export default function BrowserApp() {
  const [stack, setStack] = useState([HOME]);
  const [index, setIndex] = useState(0);
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const frameRef = useRef(null);

  const current = stack[index];

  const navigate = (url) => {
    const next = stack.slice(0, index + 1);
    next.push(url);
    setStack(next);
    setIndex(next.length - 1);
  };

  const go = (raw) => {
    const parsed = classify(raw);
    if (!parsed) return;
    setSearch(null);
    if (parsed.type === "search") {
      const url = searchUrl(parsed.value);
      navigate(url);
      setAddress(url);
      setSearch({ query: parsed.value, url });
      setLoading(true);
      try {
        window.open(url, "_blank", "noopener,noreferrer");
      } catch {
        /* pop-up blocked — the Open button below still works */
      }
    } else {
      navigate(parsed.value);
      setAddress(parsed.value);
      setLoading(true);
    }
  };

  const back = () => {
    if (index > 0) {
      setIndex(index - 1);
      setAddress(stack[index - 1] === HOME ? "" : stack[index - 1]);
      setSearch(null);
    }
  };
  const forward = () => {
    if (index < stack.length - 1) {
      setIndex(index + 1);
      setAddress(stack[index + 1] === HOME ? "" : stack[index + 1]);
      setSearch(null);
    }
  };
  const reload = () => setFrameKey((k) => k + 1);
  const home = () => {
    navigate(HOME);
    setAddress("");
    setSearch(null);
  };

  const external = current !== HOME ? current : null;

  return (
    <div className="dt-app dt-browser">
      <form className="dt-browser-bar" onSubmit={(e) => { e.preventDefault(); go(address); }}>
        <button type="button" className="dt-iconbtn" onClick={back} disabled={index === 0} aria-label="Back">
          <FaArrowLeft aria-hidden />
        </button>
        <button
          type="button"
          className="dt-iconbtn"
          onClick={forward}
          disabled={index >= stack.length - 1}
          aria-label="Forward"
        >
          <FaArrowRight aria-hidden />
        </button>
        <button type="button" className="dt-iconbtn" onClick={reload} aria-label="Reload">
          <FaRotateRight aria-hidden />
        </button>
        <button type="button" className="dt-iconbtn" onClick={home} aria-label="Home">
          <FaHouse aria-hidden />
        </button>
        <input
          className="dt-browser-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Search the web or type a URL"
          aria-label="Address and search bar"
        />
        {external && (
          <button
            type="button"
            className="dt-browser-open"
            onClick={() => window.open(external, "_blank", "noopener,noreferrer")}
          >
            Open in new tab
          </button>
        )}
      </form>

      <div className="dt-browser-view">
        {current === HOME ? (
          <div className="dt-browser-home">
            <img src="/susvg.svg" alt="" className="dt-browser-logo" />
            <h3>Sadat Browser</h3>
            <p className="dt-app-note">
              Type a question to run a real web search (opens DuckDuckGo), or
              enter a URL.
            </p>
            <div className="dt-browser-homebox">
              <FaMagnifyingGlass aria-hidden />
              <input
                aria-label="Search the web"
                placeholder="Search the web"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    go(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <button type="button" className="dt-browser-chip" onClick={() => go("Sadat Upgrade digital solutions")}>
              Search: Sadat Upgrade digital solutions
            </button>
          </div>
        ) : (
          <>
            {search && (
              <div className="dt-browser-notice">
                <strong>Real web search:</strong> results for “{search.query}” are opening on
                DuckDuckGo in a new tab.
                <button type="button" className="dt-browser-chip" onClick={() => window.open(search.url, "_blank", "noopener,noreferrer")}>
                  Open results in a new tab
                </button>
              </div>
            )}
            {loading && <div className="dt-browser-loading">Loading…</div>}
            <iframe
              key={frameKey}
              ref={frameRef}
              className="dt-browser-frame"
              title="Browser view"
              src={current}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
            <div className="dt-browser-note">
              Many websites block being shown inside another page (X-Frame-Options /
              CSP), so the frame may stay blank. Use “Open in new tab” for the real page.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
