import { AudioStatus } from "@/types/audio";

const STATUS_LABEL: Record<AudioStatus, string> = {
  ready: "Sẵn sàng",
  processing: "Đang xử lý",
  failed: "Lỗi",
};

const STATUS_CLASSES: Record<AudioStatus, string> = {
  ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  processing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function StatusBadge({ status }: { status: AudioStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
