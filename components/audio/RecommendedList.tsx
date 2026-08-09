"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { AudioItem } from "@/types/audio";
import { formatListenCount } from "@/lib/format";
import { Button } from "../ui/button";
import { useRef } from "react";

interface RecommendedListProps {
  items: AudioItem[];
}

function RecommendedList({ items }: RecommendedListProps) {
  const audioContainerRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!audioContainerRef.current) return;

    audioContainerRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Có lẽ bạn sẽ thích</h2>
        <div className="ts-scroll-btn flex items-center gap-2">
          <Button
            onClick={() => {
              scroll("left");
            }}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110  w-10 h-10 cursor-pointer"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => {
              scroll("right");
            }}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110 w-10 h-10 cursor-pointer"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div
        ref={audioContainerRef}
        className="flex scrollbar-hide gap-4 overflow-x-auto pb-2"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${item.id}`}
            className="min-w-55 shrink-0 cursor-pointer rounded-xl border border-[#F1D6E0] bg-white p-4 transition hover:bg-[#D6336C]/5"
          >
            <span className="rounded-md border border-[#F1D6E0] px-2 py-0.5 text-xs text-black/80">
              Audio Full
            </span>
            <h3 className="mt-2 line-clamp-2 font-semibold text-black">
              {item.title}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-xs text-black/60">
              <Headphones size={14} />
              {formatListenCount(item.totalListened)} lượt nghe
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-[#D6336C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6336C]" />
              {item.totalListening} đang nghe
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecommendedList;
