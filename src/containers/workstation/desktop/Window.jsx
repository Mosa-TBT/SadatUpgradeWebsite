import { useRef } from "react";
import PropTypes from "prop-types";
import { FaMinus, FaRegWindowMaximize, FaXmark } from "react-icons/fa6";
import { DESKTOP_H, DESKTOP_W, TASKBAR_H, WindowContext, useDesktop } from "./context";

export default function Window({ win, children }) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow, scale } = useDesktop();
  const drag = useRef(null);
  const s = scale || 1;

  const onTitleDown = (e) => {
    focusWindow(win.id);
    if (win.maximized) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onTitleMove = (e) => {
    if (!drag.current) return;
    const dx = (e.clientX - drag.current.sx) / s;
    const dy = (e.clientY - drag.current.sy) / s;
    const x = Math.min(Math.max(0, drag.current.ox + dx), DESKTOP_W - win.w);
    const y = Math.min(Math.max(0, drag.current.oy + dy), DESKTOP_H - TASKBAR_H - win.h);
    moveWindow(win.id, x, y);
  };
  const onTitleUp = (e) => {
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const style = win.maximized
    ? { left: 0, top: 0, width: DESKTOP_W, height: DESKTOP_H - TASKBAR_H, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      className="dt-window"
      style={style}
      hidden={win.minimized}
      aria-label={win.title}
      onPointerDown={() => focusWindow(win.id)}
    >
      <header
        className="dt-titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="dt-titlebar-text">{win.title}</span>
        <span className="dt-winbtns">
          <button type="button" className="dt-winbtn" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} aria-label="Minimize">
            <FaMinus aria-hidden />
          </button>
          <button type="button" className="dt-winbtn" onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} aria-label={win.maximized ? "Restore" : "Maximize"}>
            <FaRegWindowMaximize aria-hidden />
          </button>
          <button type="button" className="dt-winbtn dt-winbtn--close" onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} aria-label="Close">
            <FaXmark aria-hidden />
          </button>
        </span>
      </header>
      <div className="dt-window-body">
        <WindowContext.Provider value={win}>{children}</WindowContext.Provider>
      </div>
    </section>
  );
}

Window.propTypes = {
  win: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
    z: PropTypes.number,
    minimized: PropTypes.bool,
    maximized: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node,
};
