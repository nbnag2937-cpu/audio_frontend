import LoginForm from "@/components/auth/LoginForm";
import { loginAdminAction } from "@/actions/admin.actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const { forbidden } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1e19] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">Đăng nhập Admin</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Quản lý audio của bạn trên Audio Không Quảng Cáo
        </p>

        {forbidden && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Tài khoản này không có quyền Admin. Vui lòng đăng nhập bằng đúng tài
            khoản.
          </p>
        )}

        <LoginForm
          loginAction={loginAdminAction}
          redirectTo="/admin/dashboard"
        />
      </div>
    </div>
  );
}
