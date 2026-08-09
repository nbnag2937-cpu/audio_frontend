import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  getAdminProfileAction,
  logoutAdminAction,
} from "@/actions/admin.actions";
import { AdminNotAuthenticatedError } from "@/lib/error";
import AuthShell from "@/components/auth/AuthShell";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Tổng quan" },
  { href: "/admin/audios", label: "Audio của tôi" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  let account: Awaited<ReturnType<typeof getAdminProfileAction>>;
  try {
    account = await getAdminProfileAction();
  } catch (error) {
    if (error instanceof AdminNotAuthenticatedError) {
      redirect("/admin/login");
    }
    throw error;
  }

  if (account.role !== "ADMIN") {
    redirect("/admin/login?forbidden=1");
  }

  return (
    <AuthShell
      title="Yêu Đời Audio · Admin"
      userLabel={account.email}
      navItems={NAV_ITEMS}
      logoutAction={logoutAdminAction}
      logoutRedirect="/admin/login"
    >
      {children}
    </AuthShell>
  );
}
