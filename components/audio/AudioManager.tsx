"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AudioItem, AudioWithOwner } from "@/types/audio";

import AudioFormModal from "@/components/audio/AudioFormModal";
import Button from "../ui/Button copy";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";

interface AudioManagerProps {
  audios: (AudioItem | AudioWithOwner)[];
  // Prefix route de link sang trang chi tiet, vd "/admin/audios" hoac "/super-admin/audios"
  detailBasePath: string;
  createAction: (formData: FormData) => Promise<AudioItem>;
  updateAction: (
    id: string,
    payload: { title?: string; description?: string },
  ) => Promise<AudioItem>;
  deleteAction: (id: string) => Promise<{ id: string }>;
}

export default function AudioManager({
  audios,
  detailBasePath,
  createAction,
  updateAction,
  deleteAction,
}: AudioManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<AudioItem | null>(null);
  const [deletingAudio, setDeletingAudio] = useState<AudioItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showOwnerColumn = audios.some((audio) => "owner" in audio);

  function openCreate() {
    setEditingAudio(null);
    setFormOpen(true);
  }

  function openEdit(audio: AudioItem) {
    setEditingAudio(audio);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingAudio(null);
  }

  function afterSave() {
    closeForm();
    router.refresh();
  }

  async function handleDelete() {
    if (!deletingAudio) return;
    setDeleting(true);
    try {
      await deleteAction(deletingAudio.id);
      setDeletingAudio(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button className="cursor-pointer" onClick={openCreate}>
          + Tạo audio mới
        </Button>
      </div>

      {audios.length === 0 ? (
        <EmptyState
          title="Chưa có audio nào"
          description="Tạo audio đầu tiên để bắt đầu."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#1e3a32]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#132b24] text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                {showOwnerColumn && (
                  <th className="px-4 py-3 font-medium">Chủ sở hữu</th>
                )}
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Lượt nghe</th>
                <th className="px-4 py-3 font-medium">Đang nghe</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a32]">
              {audios.map((audio) => (
                <tr key={audio.id} className="text-zinc-200">
                  <td className="px-4 py-3">
                    <Link
                      href={`${detailBasePath}/${audio.id}`}
                      className="font-medium text-white hover:text-emerald-400"
                    >
                      {audio.title}
                    </Link>
                  </td>
                  {showOwnerColumn && (
                    <td className="px-4 py-3 text-zinc-400">
                      {"owner" in audio ? audio.owner.name : "—"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <StatusBadge status={audio.status} />
                  </td>
                  <td className="px-4 py-3">{audio.totalListened}</td>
                  <td className="px-4 py-3">{audio.totalListening}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => openEdit(audio)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setDeletingAudio(audio)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AudioFormModal
        open={formOpen}
        audio={editingAudio}
        createAction={createAction}
        updateAction={updateAction}
        onClose={closeForm}
        onSaved={afterSave}
      />

      <ConfirmDialog
        open={deletingAudio !== null}
        title="Xóa audio"
        description={`Bạn có chắc muốn xóa "${deletingAudio?.title}"? Hành động này không thể hoàn tác.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAudio(null)}
      />
    </div>
  );
}
