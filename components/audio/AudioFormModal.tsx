"use client";

import { FormEvent, useState } from "react";
import { AudioItem } from "@/types/audio";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Input from "../ui/Input copy";
import Button from "../ui/Button copy";

interface AudioFormModalProps {
  open: boolean;
  audio: AudioItem | null;
  createAction: (formData: FormData) => Promise<AudioItem>;
  updateAction: (
    id: string,
    payload: { title?: string; description?: string; adLinkUrl?: string },
  ) => Promise<AudioItem>;
  onClose: () => void;
  onSaved: () => void;
}

export default function AudioFormModal(props: AudioFormModalProps) {
  if (!props.open) return null;
  return <AudioFormModalContent key={props.audio?.id ?? "create"} {...props} />;
}

function AudioFormModalContent({
  open,
  audio,
  createAction,
  updateAction,
  onClose,
  onSaved,
}: AudioFormModalProps) {
  const isEdit = audio !== null;
  const [title, setTitle] = useState(audio?.title ?? "");
  const [description, setDescription] = useState(audio?.description ?? "");
  const [adLinkUrl, setAdLinkUrl] = useState(audio?.adLinkUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit && audio) {
        await updateAction(audio.id, { title, description, adLinkUrl });
      } else {
        if (!file) {
          setError("Vui lòng chọn file audio");
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.set("audioFile", file);
        formData.set("title", title);
        formData.set("description", description);
        if (adLinkUrl) {
          formData.set("adLinkUrl", adLinkUrl);
        }
        await createAction(formData);
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Chỉnh sửa audio" : "Tạo audio mới"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Tiêu đề</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Mô tả</label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">
            Link quảng cáo mở khóa (Shopee, ...)
          </label>
          <Input
            type="url"
            value={adLinkUrl}
            onChange={(event) => setAdLinkUrl(event.target.value)}
            placeholder="https://s.shopee.vn/xxxxxxxx"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Để trống sẽ dùng link quảng cáo mặc định của hệ thống.
          </p>
        </div>
        {!isEdit && (
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              File audio
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#06140f]"
              required
            />
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
