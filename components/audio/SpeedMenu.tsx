"use client";

import { PLAYBACK_RATES, PlaybackRate } from "@/types/audio";

interface SpeedMenuProps {
  value: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
}

function SpeedMenu({ value, onChange }: SpeedMenuProps) {
  const activeIndex = PLAYBACK_RATES.indexOf(value);

  return (
    <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-xl border border-[#F1D6E0] bg-white p-4 shadow-lg sm:w-72">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-black">
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
        className="w-full cursor-pointer accent-[#D6336C]"
      />
      <div className="mb-3 flex justify-between text-xs text-black/50">
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
                ? "border-[#D6336C] bg-[#D6336C]/12 text-black"
                : "border-[#F1D6E0] text-black/70 hover:bg-[#D6336C]/8"
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
