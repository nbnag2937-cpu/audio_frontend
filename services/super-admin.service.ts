/**
 * super-admin.service.ts
 * Tang SERVICE cho role SUPER_ADMIN - CHI goi API, KHONG dung cookie.
 * token (JWT) duoc truyen vao tu ben ngoai (action se lo viec doc/ghi token trong cookie).
 *
 * UI KHONG duoc import file nay truc tiep - luon di qua super-admin.actions.ts
 */
import { apiFetch } from "@/lib/api-client";
import { AudioItem } from "@/types/audio";

export interface SuperAdminAccount {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export interface LoginResult {
  accessToken: string;
  account: SuperAdminAccount;
}

export interface AdminWithStats {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  stats: { totalAudios: number; totalListening: number; totalListened: number };
}

export interface SystemStats {
  totalAdmins: number;
  totalAudios: number;
  totalListening: number;
  totalListened: number;
}

export interface AudioWithOwner extends AudioItem {
  owner: { id: string; name: string; email: string };
}

/** POST /api/auth/login - dang nhap (dung chung endpoint voi ADMIN, backend tu phan biet qua role trong token) */
export function login(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/** GET /api/auth/me - lay thong tin tai khoan dang dang nhap */
export function fetchProfile(token: string): Promise<SuperAdminAccount> {
  return apiFetch<SuperAdminAccount>("/api/auth/me", { token });
}

/** POST /api/super-admin/admins - cap tai khoan ADMIN moi */
export function createAdminAccount(
  token: string,
  payload: { email: string; password: string; name: string },
): Promise<SuperAdminAccount> {
  return apiFetch<SuperAdminAccount>("/api/super-admin/admins", {
    method: "POST",
    token,
    body: payload,
  });
}

/** GET /api/super-admin/admins - danh sach toan bo ADMIN kem thong so (so audio, luot nghe) */
export function fetchAllAdmins(token: string): Promise<AdminWithStats[]> {
  return apiFetch<AdminWithStats[]>("/api/super-admin/admins", { token });
}

/** DELETE /api/super-admin/admins/:id - xoa 1 tai khoan ADMIN (audio cua admin do cung bi xoa theo) */
export function deleteAdminAccount(
  token: string,
  adminId: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/api/super-admin/admins/${adminId}`, {
    method: "DELETE",
    token,
  });
}

/** GET /api/super-admin/audios - toan bo audio cua toan bo ADMIN, kem thong tin chu so huu */
export function fetchAllAudios(token: string): Promise<AudioWithOwner[]> {
  return apiFetch<AudioWithOwner[]>("/api/super-admin/audios", { token });
}

/** GET /api/super-admin/stats - thong ke tong quan toan he thong */
export function fetchSystemStats(token: string): Promise<SystemStats> {
  return apiFetch<SystemStats>("/api/super-admin/stats", { token });
}

// --- SUPER_ADMIN cung CRUD audio nhu ADMIN (dung chung endpoint /api/audios, backend tu cho phep) ---

/** GET /api/audios/:id - xem chi tiet 1 audio BAT KY (cua admin nao cung xem duoc, kem audioUrl) */
export function fetchAudioDetail(
  token: string,
  audioId: string,
): Promise<AudioItem> {
  return apiFetch<AudioItem>(`/api/audios/${audioId}`, { token });
}

/** POST /api/audios - super admin tu tao audio cho chinh minh (multipart/form-data) */
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

/** PUT /api/audios/:id - cap nhat audio cua BAT KY admin nao */
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

/** DELETE /api/audios/:id - xoa audio cua BAT KY admin nao */
export function deleteAudio(
  token: string,
  audioId: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/api/audios/${audioId}`, {
    method: "DELETE",
    token,
  });
}
