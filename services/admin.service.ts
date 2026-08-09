/**
 * admin.service.ts
 * Tang SERVICE cho role ADMIN - CHI goi API, KHONG dung cookie.
 * token (JWT) duoc truyen vao tu ben ngoai (action se lo viec doc/ghi token trong cookie).
 *
 * UI KHONG duoc import file nay truc tiep - luon di qua admin.actions.ts
 */
import { apiFetch } from "@/lib/api-client";
import { AudioItem } from "@/types/audio";

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export interface LoginResult {
  accessToken: string;
  account: AdminAccount;
}

/** POST /api/auth/login - dang nhap, tra ve accessToken (JWT) + thong tin tai khoan */
export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/** GET /api/auth/me - lay thong tin tai khoan dang dang nhap (dung token de xac thuc) */
export function fetchProfile(token: string): Promise<AdminAccount> {
  return apiFetch<AdminAccount>("/api/auth/me", { token });
}

/** GET /api/audios/mine - danh sach audio cua chinh admin dang dang nhap */
export function fetchMyAudios(token: string): Promise<AudioItem[]> {
  return apiFetch<AudioItem[]>("/api/audios/mine", { token });
}

/** GET /api/audios/:id - chi tiet 1 audio cua chinh minh (kem audioUrl de preview lai) */
export function fetchAudioDetail(
  token: string,
  audioId: string,
): Promise<AudioItem> {
  return apiFetch<AudioItem>(`/api/audios/${audioId}`, { token });
}

/**
 * POST /api/audios - tao audio moi (multipart/form-data).
 * formData PHAI co field "audioFile" (File) va "title" (string), "description" la tuy chon.
 */
export function createAudio(
  token: string,
  formData: FormData,
): Promise<AudioItem> {
  return apiFetch<AudioItem>("/api/audios", {
    method: "POST",
    token,
    body: formData,
  });
}

/** PUT /api/audios/:id - cap nhat title/description */
export function updateAudio(
  token: string,
  audioId: string,
  payload: { title?: string; description?: string },
): Promise<AudioItem> {
  return apiFetch<AudioItem>(`/api/audios/${audioId}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

/** DELETE /api/audios/:id - xoa audio (xoa ca file tren R2) */
export function deleteAudio(
  token: string,
  audioId: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/api/audios/${audioId}`, {
    method: "DELETE",
    token,
  });
}
