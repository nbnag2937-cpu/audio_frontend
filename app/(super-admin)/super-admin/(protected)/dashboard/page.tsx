import { getSystemStatsAction } from "@/actions/super-admin.actions";
import StatCard from "@/components/ui/StatCard";

export default async function SuperAdminDashboardPage() {
  const stats = await getSystemStatsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Tổng quan hệ thống</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Số liệu toàn bộ nền tảng Yêu Đời Audio
      </p>

      {/* Cac field ben duoi (totalAdmins, totalAudios, totalListened, totalListening) la du doan
          dua theo ten hop ly - kiem tra lai dung theo kieu SystemStats thuc te trong
          services/super-admin.service.ts va sua ten field neu khac. */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng số Admin" value={stats.totalAdmins} />
        <StatCard label="Tổng số Audio" value={stats.totalAudios} />
        <StatCard label="Tổng lượt nghe" value={stats.totalListened} />
        <StatCard label="Đang nghe" value={stats.totalListening} />
      </div>
    </div>
  );
}
