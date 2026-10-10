import Image from "next/image";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "Sadat Upgrade";

export interface BrandAsset {
  src: string;
  width: number;
  height: number;
}

const LOGO: BrandAsset = { src: "/sadat-upgrade-logo-transparent.png", width: 630, height: 667 };
const LOGO_SOLID: BrandAsset = { src: "/sadat-upgrade-logo.png", width: 630, height: 667 };
const MARK: BrandAsset = { src: "/sadat-upgrade-mark-transparent.png", width: 497, height: 410 };
const MARK_SOLID: BrandAsset = { src: "/sadat-upgrade-mark.png", width: 497, height: 410 };

export interface BrandMarkProps {
  size?: number;
  className?: string;
  priority?: boolean;
  solid?: boolean;
  alt?: string;
}

export function BrandMark({
  size = 36,
  className,
  priority = false,
  solid = false,
  alt = BRAND_NAME,
}: BrandMarkProps) {
  const asset = solid ? MARK_SOLID : MARK;
  const width = Math.round(size * (asset.width / asset.height));
  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={`${width}px`}
      className={cn("block select-none", className)}
      style={{ height: size, width }}
    />
  );
}

export interface BrandLogoProps {
  height?: number;
  className?: string;
  priority?: boolean;
  solid?: boolean;
  alt?: string;
}

export function BrandLogo({
  height = 120,
  className,
  priority = false,
  solid = false,
  alt = BRAND_NAME,
}: BrandLogoProps) {
  const asset = solid ? LOGO_SOLID : LOGO;
  const width = Math.round(height * (asset.width / asset.height));
  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={`${width}px`}
      className={cn("block select-none", className)}
      style={{ height, width }}
    />
  );
}

export interface BrandLockupProps {
  markSize?: number;
  className?: string;
  textClassName?: string;
  priority?: boolean;
  name?: string;
}

export function BrandLockup({
  markSize = 36,
  className,
  textClassName,
  priority = false,
  name = BRAND_NAME,
}: BrandLockupProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark size={markSize} priority={priority} />
      <span className={cn("text-xl font-bold tracking-tight text-gray-900", textClassName)}>
        {name}
      </span>
    </span>
  );
}