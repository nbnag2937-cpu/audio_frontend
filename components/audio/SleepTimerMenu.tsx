"use client";

const SLEEP_OPTIONS: ReadonlyArray<{ minutes: number; label: string }> = [
  { minutes: 15, label: "15 phút" },
  { minutes: 30, label: "30 phút" },
  { minutes: 45, label: "45 phút" },
  { minutes: 60, label: "60 phút" },
];

interface SleepTimerMenuProps {
  placement?: "top" | "bottom";
  onSelectMinutes: (minutes: number) => void;
  onSelectEndOfTrack: () => void;
}

function SleepTimerMenu({
  placement = "top",
  onSelectMinutes,
  onSelectEndOfTrack,
}: SleepTimerMenuProps) {
  const positionClass =
    placement === "top" ? "top-full mt-2" : "bottom-full mb-2";

  return (
    <div
      className={`absolute right-0 ${positionClass} z-10 w-56 rounded-xl border border-white/10 bg-[#0D241F] p-4 shadow-lg sm:w-64`}
    >
      <p className="mb-3 text-sm font-semibold text-[#F0FDF4]">
        Hẹn giờ đi ngủ
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SLEEP_OPTIONS.map((option) => (
          <button
            key={option.minutes}
            type="button"
            onClick={() => onSelectMinutes(option.minutes)}
            className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-[#F0FDF4] hover:bg-white/10"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onSelectEndOfTrack}
        className="mt-2 w-full cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-[#F0FDF4] hover:bg-white/10"
      >
        Hết bài này
      </button>
    </div>
  );
}

export default SleepTimerMenu;
