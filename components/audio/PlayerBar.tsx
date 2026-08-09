"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Gauge, Moon } from "lucide-react";
import { PlaybackRate } from "@/types/audio";
import { formatDuration } from "@/lib/format";
import SpeedMenu from "./SpeedMenu";
import SleepTimerMenu from "./SleepTimerMenu";

interface PlayerBarProps {
  title: string;
  statusLabel: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  sleepLabel: string | null;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
  onChangeRate: (rate: PlaybackRate) => void;
  onSelectSleepMinutes: (minutes: number) => void;
  onSelectSleepEndOfTrack: () => void;
}

type OpenMenu = "speed" | "sleep" | null;

function PlayerBar({
  title,
  statusLabel,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  sleepLabel,
  onTogglePlay,
  onSeek,
  onSkipPrev,
  onSkipNext,
  onChangeRate,
  onSelectSleepMinutes,
  onSelectSleepEndOfTrack,
}: PlayerBarProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#F1D6E0] bg-[#FFF3F7]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-2 px-3 py-2.5 sm:px-6 sm:py-3 md:px-8 lg:px-20 xl:px-70">
        <div className="min-w-0 sm:hidden">
          <p className="truncate text-sm font-semibold text-black">{title}</p>
          <p className="truncate text-xs text-black/50">{statusLabel}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate font-semibold text-black">{title}</p>
            <p className="truncate text-sm text-black/50">{statusLabel}</p>
          </div>

          <div className="flex flex-1 items-center justify-center gap-2 sm:flex-none sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onSkipPrev}
              className="cursor-pointer text-black/70 hover:text-black"
              aria-label="Về đầu tập"
            >
              <SkipBack size={20} />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#D6336C] text-white hover:bg-[#AD1457] sm:h-11 sm:w-11"
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              type="button"
              onClick={onSkipNext}
              className="cursor-pointer text-black/70 hover:text-black"
              aria-label="Audio tiếp theo"
            >
              <SkipForward size={20} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((current) =>
                    current === "speed" ? null : "speed",
                  )
                }
                className="flex cursor-pointer items-center gap-1 rounded-full border border-[#F1D6E0] px-2.5 py-1 text-xs text-black sm:px-3 sm:py-1.5 sm:text-sm"
              >
                <Gauge size={16} />
                {playbackRate}x
              </button>
              {openMenu === "speed" && (
                <SpeedMenu
                  value={playbackRate}
                  onChange={(rate) => {
                    onChangeRate(rate);
                    setOpenMenu(null);
                  }}
                />
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((current) =>
                    current === "sleep" ? null : "sleep",
                  )
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F1D6E0] text-black sm:h-9 sm:w-9"
                aria-label="Hẹn giờ đi ngủ"
              >
                <Moon size={16} />
              </button>
              {openMenu === "sleep" && (
                <SleepTimerMenu
                  placement="bottom"
                  onSelectMinutes={(minutes) => {
                    onSelectSleepMinutes(minutes);
                    setOpenMenu(null);
                  }}
                  onSelectEndOfTrack={() => {
                    onSelectSleepEndOfTrack();
                    setOpenMenu(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-black/60 sm:gap-3">
          <span className="w-8 shrink-0 text-right sm:w-auto sm:text-left">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(currentTime, duration)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSeek(Number(e.target.value))
            }
            className="h-1 flex-1 cursor-pointer accent-[#D6336C]"
          />
          <span className="w-8 shrink-0 sm:w-auto">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {sleepLabel && (
        <p className="mx-auto w-full max-w-360 px-3 pb-2 text-xs text-[#D6336C] sm:px-6 md:px-8 lg:px-20 xl:px-70">
          Hẹn giờ: {sleepLabel}
        </p>
      )}
    </div>
  );
}

export default PlayerBar;
