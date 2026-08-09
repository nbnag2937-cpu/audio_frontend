"use client";

import { AudioPart } from "@/types/audio";
import { formatDuration } from "@/lib/format";

interface EpisodeListProps {
  parts: AudioPart[];
  activePartIndex: number;
  onPlayPart: (index: number) => void;
}

function EpisodeList({ parts, activePartIndex, onPlayPart }: EpisodeListProps) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-bold text-[#F0FDF4]">
        Danh sách tập ({parts.length})
      </h2>
      <div className="flex flex-col gap-3">
        {parts.map((part, index) => {
          const isActive = index === activePartIndex;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => onPlayPart(index)}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-[#6ac1ab] bg-[#6ac1ab]/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span
                className={`text-sm ${isActive ? "text-[#F0FDF4]" : "text-[#F0FDF4]/50"}`}
              >
                Phần {part.partNumber}
              </span>
              <span className="flex flex-1 flex-col">
                <span
                  className={`font-semibold ${
                    isActive ? "text-[#F0FDF4]" : "text-[#F0FDF4]/90"
                  }`}
                >
                  {part.title}
                </span>
                <span className="text-sm text-[#F0FDF4]/50">
                  {formatDuration(part.durationSec)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default EpisodeList;
