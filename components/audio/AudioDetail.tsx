import Link from "next/link";
import { AudioItem } from "@/types/audio";
import StatusBadge from "../ui/StatusBadge";

interface AudioDetailProps {
  audio: AudioItem;
  backHref: string;
}

export default function AudioDetail({ audio, backHref }: AudioDetailProps) {
  return (
    <div>
      <Link
        href={backHref}
        className="text-sm text-zinc-400 hover:text-emerald-400"
      >
        ← Quay lại
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{audio.title}</h1>
          {audio.description && (
            <p className="mt-1 text-sm text-zinc-400">{audio.description}</p>
          )}
        </div>
        <StatusBadge status={audio.status} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Lượt nghe" value={audio.totalListened} />
        <Stat label="Đang nghe" value={audio.totalListening} />
        <Stat label="Số phần" value={audio.parts.length} />
        <Stat
          label="Ngày tạo"
          value={new Date(audio.createdAt).toLocaleDateString("vi-VN")}
        />
      </div>

      <div className="mt-8 space-y-4">
        {audio.parts.map((part) => (
          <div
            key={part.id}
            className="rounded-2xl border border-[#1e3a32] bg-[#132b24] p-4"
          >
            <p className="text-sm font-medium text-white">
              Phần {part.partNumber} · {part.title}
            </p>
            <p className="text-xs text-zinc-500">
              {Math.round(part.durationSec / 60)} phút
            </p>
            {part.audioUrl && (
              <audio controls className="mt-3 w-full">
                <source src={part.audioUrl} />
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#1e3a32] bg-[#132b24] p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
