"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MousePointerClick, Rotate3d, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const WorkstationExperience = dynamic(
  () => import("./workstation-experience"),
  { ssr: false, loading: () => <BrandedLoader /> },
);

export type DeviceQuality = "high" | "low";

export interface DeviceProfile {
  reduceMotion: boolean;
  mobile: boolean;
  quality: DeviceQuality;
}

function BrandedLoader() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
      <div className="ws-hint">
        <BrandMark size={46} />
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Sparkles className="h-4 w-4 animate-pulse text-blue-500" />
        Loading workstation…
      </div>
    </div>
  );
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function getDeviceProfile(): DeviceProfile {
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  const cores =
    typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
  const memory =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8
      : 8;
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;
  const mobile = coarse || narrow;
  const lowPower = cores <= 4 || memory <= 4;
  return { reduceMotion, mobile, quality: mobile || lowPower ? "low" : "high" };
}

export interface WorkstationStageProps {
  className?: string;
  heightClass?: string;
}

export default function WorkstationStage({ className, heightClass }: WorkstationStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<DeviceProfile>({
    reduceMotion: false,
    mobile: false,
    quality: "high",
  });
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusKey, setFocusKey] = useState(0);

  useEffect(() => {
    setSupported(detectWebGL());
    setProfile(getDeviceProfile());
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMounted(true);
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const requestFocus = useCallback(() => setFocusKey((k) => k + 1), []);
  const showScene = mounted && supported !== false;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[1.75rem] border border-white/70 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.45)]",
          heightClass || "h-[340px] sm:h-[420px] lg:h-[520px]",
        )}
        style={{
          background:
            "radial-gradient(120% 95% at 50% 0%, #ffffff 0%, #eef2fa 52%, #e2e9f5 100%)",
        }}
      >
        {showScene && (
          <WorkstationExperience
            quality={profile.quality}
            reduceMotion={profile.reduceMotion}
            inView={inView}
            focusKey={focusKey}
            onFocusChange={setFocused}
          />
        )}

        {supported === false && <WebGLFallback />}

        {showScene && (
          <>
            <div className="pointer-events-none absolute left-5 top-5 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-500 backdrop-blur">
                <Rotate3d className="h-3.5 w-3.5" />
                Drag to orbit
              </span>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center transition-opacity duration-300"
              style={{ opacity: focused ? 0 : 1 }}
            >
              <button
                type="button"
                onClick={requestFocus}
                aria-pressed={focused}
                style={{ pointerEvents: focused ? "none" : "auto" }}
                className="ws-hint inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <MousePointerClick className="h-4 w-4" />
                Click the laptop to start typing
              </button>
            </div>
          </>
        )}
      </div>

      <p className="sr-only">
        An interactive 3D workstation for Sadat Upgrade. Drag with the mouse or
        touch to orbit the desk. Click the laptop and use your keyboard to type
        commands into a simulated terminal. Press Escape to stop typing.
      </p>
    </div>
  );
}

function WebGLFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
      <BrandMark size={48} />
      <h3 className="text-xl font-semibold text-slate-800">
        The 3D workstation isn&apos;t available on this device
      </h3>
      <p className="max-w-md text-slate-600">
        Your browser doesn&apos;t support WebGL, so we&apos;ve skipped the
        interactive preview. Everything else on the page works just as you
        expect.
      </p>
    </div>
  );
}