import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  getSuperAdminProfileAction,
  logoutSuperAdminAction,
} from "@/actions/super-admin.actions";
import { SuperAdminNotAuthenticatedError } from "@/lib/error";
import AuthShell from "@/components/auth/AuthShell";

const NAV_ITEMS = [
  { href: "/super-admin/dashboard", label: "Tổng quan" },
  { href: "/super-admin/admins", label: "Quản lý Admin" },
  { href: "/super-admin/audios", label: "Toàn bộ Audio" },
];

export default async function SuperAdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  let account: Awaited<ReturnType<typeof getSuperAdminProfileAction>>;
  try {
    account = await getSuperAdminProfileAction();
  } catch (error) {
    if (error instanceof SuperAdminNotAuthenticatedError) {
      redirect("/super-admin/login");
    }
    throw error;
  }

  if (account.role !== "SUPER_ADMIN") {
    redirect("/super-admin/login?forbidden=1");
  }

  return (
    <AuthShell
      title="Yêu Đời Audio · Super Admin"
      userLabel={account.email}
      navItems={NAV_ITEMS}
      logoutAction={logoutSuperAdminAction}
      logoutRedirect="/super-admin/login"
    >
      {children}
    </AuthShell>
  );
}
