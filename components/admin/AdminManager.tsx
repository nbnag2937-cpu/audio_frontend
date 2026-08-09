"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminWithStats,
  SuperAdminAccount,
} from "@/services/super-admin.service";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Button from "../ui/Button copy";
import Input from "../ui/Input copy";

interface AdminManagerProps {
  admins: AdminWithStats[];
  createAction: (payload: {
    email: string;
    password: string;
    name: string;
  }) => Promise<SuperAdminAccount>;
  deleteAction: (id: string) => Promise<{ id: string }>;
}

export default function AdminManager({
  admins,
  createAction,
  deleteAction,
}: AdminManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createAction({ name, email, password });
      setFormOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo tài khoản");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteAction(deletingId);
      setDeletingId(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setFormOpen(true)}>+ Cấp tài khoản Admin</Button>
      </div>

      {admins.length === 0 ? (
        <EmptyState
          title="Chưa có Admin nào"
          description="Cấp tài khoản Admin đầu tiên để bắt đầu."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#1e3a32]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#132b24] text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tên</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Số audio</th>
                <th className="px-4 py-3 font-medium">Tổng lượt nghe</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a32]">
              {admins.map((admin) => (
                <tr key={admin.id} className="text-zinc-200">
                  <td className="px-4 py-3 font-medium text-white">
                    {admin.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{admin.email}</td>
                  <td className="px-4 py-3">{admin.stats.totalAudios}</td>
                  <td className="px-4 py-3">{admin.stats.totalListened}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      onClick={() => setDeletingId(admin.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        title="Cấp tài khoản Admin"
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Tên</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Tạo"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Xóa tài khoản Admin"
        description="Bạn có chắc muốn xóa tài khoản Admin này? Hành động này không thể hoàn tác."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
