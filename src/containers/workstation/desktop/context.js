import { createContext, useContext } from "react";

// The virtual monitor's fixed design resolution. Everything inside the desktop
// is laid out in this coordinate space and scaled to exactly fill the screen.
export const DESKTOP_W = 960;
export const DESKTOP_H = 600;
export const TASKBAR_H = 46;

export const DesktopContext = createContext(null);
export const useDesktop = () => useContext(DesktopContext);

export const WindowContext = createContext(null);
export const useWindow = () => useContext(WindowContext);
