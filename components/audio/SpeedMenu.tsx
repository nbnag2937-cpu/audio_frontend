"use client";

import { PLAYBACK_RATES, PlaybackRate } from "@/types/audio";

interface SpeedMenuProps {
  value: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
}

function SpeedMenu({ value, onChange }: SpeedMenuProps) {
  const activeIndex = PLAYBACK_RATES.indexOf(value);

  return (
    <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-xl border border-white/10 bg-[#0D241F] p-4 shadow-lg sm:w-72">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[#F0FDF4]">
        <span>Tốc độ phát</span>
        <span>{value}x</span>
      </div>

      <input
        type="range"
        min={0}
        max={PLAYBACK_RATES.length - 1}
        step={1}
        value={activeIndex}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(PLAYBACK_RATES[Number(e.target.value)])
        }
        className="w-full cursor-pointer accent-[#6ac1ab]"
      />
      <div className="mb-3 flex justify-between text-xs text-[#F0FDF4]/50">
        <span>0.25x</span>
        <span>2x</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PLAYBACK_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => onChange(rate)}
            className={`cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
              rate === value
                ? "border-[#6ac1ab] bg-[#6ac1ab]/15 text-[#F0FDF4]"
                : "border-white/10 text-[#F0FDF4]/70 hover:bg-white/10"
            }`}
          >
            {rate === 1 ? "Chuẩn" : `${rate}x`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SpeedMenu;
