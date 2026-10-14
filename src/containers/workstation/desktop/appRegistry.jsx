import {
  FaCircleInfo,
  FaFile,
  FaFolder,
  FaGear,
  FaGlobe,
  FaTerminal,
} from "react-icons/fa6";
import FileExplorer from "./apps/FileExplorer";
import TerminalApp from "./apps/TerminalApp";
import SettingsApp from "./apps/SettingsApp";
import AboutApp from "./apps/AboutApp";
import BrowserApp from "./apps/BrowserApp";
import PreviewApp from "./apps/PreviewApp";

// Central application registry. `component` is rendered inside a window.
export const APPS = [
  { id: "explorer", title: "File Explorer", icon: FaFolder, component: FileExplorer, w: 600, h: 380, singleInstance: true },
  { id: "terminal", title: "Terminal", icon: FaTerminal, component: TerminalApp, w: 560, h: 380, singleInstance: true },
  { id: "browser", title: "Browser", icon: FaGlobe, component: BrowserApp, w: 700, h: 450, singleInstance: true },
  { id: "settings", title: "Settings", icon: FaGear, component: SettingsApp, w: 460, h: 360, singleInstance: true },
  { id: "about", title: "About this computer", icon: FaCircleInfo, component: AboutApp, w: 470, h: 400, singleInstance: true },
  { id: "preview", title: "Preview", icon: FaFile, component: PreviewApp, w: 540, h: 380, singleInstance: false },
];

export const DESKTOP_ICONS = ["explorer", "terminal", "browser", "about", "settings"];
export const PINNED = ["explorer", "terminal", "browser", "settings"];

export const getApp = (id) => APPS.find((a) => a.id === id);
