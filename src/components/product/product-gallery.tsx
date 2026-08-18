"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = React.useState(0);
  const list = images.length > 0 ? images : [""];

  return (
    <div className="overflow-x-clip">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-canvas-alt">
        <Image
          src={list[Math.min(active, list.length - 1)]!}
          alt={`${name} — image ${active + 1} of ${list.length}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      {list.length > 1 ? (
        <div
          className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide"
          role="group"
          aria-label={`${name} images`}
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                i === active
                  ? "border-marigold"
                  : "border-transparent hover:border-gray-200"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
