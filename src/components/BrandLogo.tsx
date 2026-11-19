"use client";

import { useState } from "react";

type LogoSize = "sm" | "md" | "lg" | "preview" | "xl";

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-sm",
  preview: "h-14 w-14 text-lg",
  xl: "h-16 w-16 text-xl",
};

export default function BrandLogo({
  logoUrl,
  logoText,
  alt,
  accentColor = "#c8a66a",
  size = "md",
  className = "",
}: {
  logoUrl?: string | null;
  logoText: string;
  alt: string;
  accentColor?: string;
  size?: LogoSize;
  className?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const trimmedUrl = (logoUrl || "").trim();
  const showImage = Boolean(trimmedUrl && failedUrl !== trimmedUrl);

  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full border font-semibold ${SIZE_CLASSES[size]} ${
        showImage ? "bg-[#0a0c0b]/60 p-1" : ""
      } ${className}`}
      style={{
        borderColor: accentColor,
        color: accentColor,
      }}
    >
      {showImage ? (
        <img
          src={trimmedUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(trimmedUrl)}
          className="h-full w-full rounded-full object-contain"
        />
      ) : (
        <span>{logoText || "Q"}</span>
      )}
    </span>
  );
}
