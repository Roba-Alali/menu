"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export default function DishImage({
  src,
  alt,
  className = "",
  accentColor = "#c8a66a",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  accentColor?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1d2422] to-[#0e1211] p-3 text-center ${className}`}
      >
        <UtensilsCrossed size={22} style={{ color: accentColor }} className="opacity-70" />
        <span className="mt-2 line-clamp-1 text-[11px] text-[#9aa6a1]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
