import LoginForm from "@/components/auth/LoginForm";
import { loginSuperAdminAction } from "@/actions/super-admin.actions";

export default async function SuperAdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const { forbidden } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1e19] px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">
          Đăng nhập Super Admin
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          Quản trị toàn bộ hệ thống Audio Không Quảng Cáo
        </p>

        {forbidden && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Tài khoản này không có quyền Super Admin. Vui lòng đăng nhập bằng
            đúng tài khoản.
          </p>
        )}

        <LoginForm
          loginAction={loginSuperAdminAction}
          redirectTo="/super-admin/dashboard"
        />
      </div>
    </div>
  );
}
