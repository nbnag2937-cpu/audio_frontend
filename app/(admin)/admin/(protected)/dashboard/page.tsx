import { getMyAudiosAction } from "@/actions/admin.actions";
import StatCard from "@/components/ui/StatCard";

export default async function AdminDashboardPage() {
  const audios = await getMyAudiosAction();
  const totalListened = audios.reduce(
    (sum, audio) => sum + audio.totalListened,
    0,
  );
  const totalListening = audios.reduce(
    (sum, audio) => sum + audio.totalListening,
    0,
  );
  const readyCount = audios.filter((audio) => audio.status === "ready").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Tổng quan</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Thống kê nhanh cho audio của bạn
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng số audio" value={audios.length} />
        <StatCard label="Audio sẵn sàng" value={readyCount} />
        <StatCard label="Tổng lượt nghe" value={totalListened} />
        <StatCard label="Đang nghe" value={totalListening} />
      </div>
    </div>
  );
}
