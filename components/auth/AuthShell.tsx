"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface AuthShellProps {
  title: string;
  userLabel: string;
  navItems: NavItem[];
  logoutAction: () => Promise<void>;
  logoutRedirect: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  userLabel,
  navItems,
  logoutAction,
  logoutRedirect,
  children,
}: AuthShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push(logoutRedirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#0c1e19] text-zinc-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[#1c3931] bg-[#0f2620] p-6">
        <p className="mb-8 text-lg font-bold text-white">{title}</p>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#1c3931] pt-4">
          <p className="mb-2 truncate text-xs text-zinc-500">{userLabel}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer rounded-lg border border-[#24443a] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
