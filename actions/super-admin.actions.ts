"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createAdminAccount,
  createAudio,
  deleteAdminAccount,
  deleteAudio,
  fetchAllAdmins,
  fetchAllAudios,
  fetchAudioDetail,
  fetchProfile,
  fetchSystemStats,
  login,
  updateAudio,
  type AdminWithStats,
  type AudioWithOwner,
  type SuperAdminAccount,
  type SystemStats,
} from "@/services/super-admin.service";
import { AudioItem } from "@/types/audio";
import { SuperAdminNotAuthenticatedError } from "@/lib/error";

const SUPER_ADMIN_TOKEN_COOKIE = "super_admin_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 ngay

/** Doc token super admin tu cookie, throw SuperAdminNotAuthenticatedError neu chua dang nhap */
async function requireSuperAdminToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUPER_ADMIN_TOKEN_COOKIE)?.value;
  if (!token) throw new SuperAdminNotAuthenticatedError();
  return token;
}
/**
 * Action: dang nhap SUPER_ADMIN.
 * - Goi API login (dung chung endpoint voi Admin)
 * - Luu accessToken vao cookie httpOnly "super_admin_token"
 * - Tra ve thong tin tai khoan (KHONG tra ve token)
 */
export async function loginSuperAdminAction(
  email: string,
  password: string,
): Promise<SuperAdminAccount> {
  const cookieStore = await cookies();
  const { accessToken, account } = await login(email, password);

  cookieStore.set(SUPER_ADMIN_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });

  return account;
}

/** Action: dang xuat SUPER_ADMIN - xoa cookie chua token */
export async function logoutSuperAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SUPER_ADMIN_TOKEN_COOKIE);
}

/** Action: lay thong tin tai khoan super admin dang dang nhap */
export async function getSuperAdminProfileAction(): Promise<SuperAdminAccount> {
  const token = await requireSuperAdminToken();
  return fetchProfile(token);
}

/** Action: cap tai khoan ADMIN moi (trang "Quan ly Admin") */
export async function createAdminAction(payload: {
  email: string;
  password: string;
  name: string;
}): Promise<SuperAdminAccount> {
  const token = await requireSuperAdminToken();
  const admin = await createAdminAccount(token, payload);
  revalidatePath("/super-admin/admins");
  return admin;
}

/** Action: lay danh sach toan bo ADMIN kem thong so (so audio, tong luot nghe) */
export async function listAdminsAction(): Promise<AdminWithStats[]> {
  const token = await requireSuperAdminToken();
  return fetchAllAdmins(token);
}

/** Action: xoa 1 tai khoan ADMIN */
export async function deleteAdminAction(
  adminId: string,
): Promise<{ id: string }> {
  const token = await requireSuperAdminToken();
  const result = await deleteAdminAccount(token, adminId);
  revalidatePath("/super-admin/admins");
  return result;
}

/** Action: xem toan bo audio cua toan bo ADMIN (trang "Theo doi audio toan he thong") */
export async function listAllAudiosAction(): Promise<AudioWithOwner[]> {
  const token = await requireSuperAdminToken();
  return fetchAllAudios(token);
}

/** Action: xem thong ke tong quan he thong (dashboard) */
export async function getSystemStatsAction(): Promise<SystemStats> {
  const token = await requireSuperAdminToken();
  return fetchSystemStats(token);
}

// --- SUPER_ADMIN cung CRUD audio nhu ADMIN ---

/** Action: xem chi tiet 1 audio BAT KY (cua admin nao cung duoc), kem audioUrl de preview */
export async function getAudioDetailAction(
  audioId: string,
): Promise<AudioItem> {
  const token = await requireSuperAdminToken();
  return fetchAudioDetail(token, audioId);
}

/** Action: super admin tu tao audio cho chinh minh (formData can "audioFile", "title", "description") */
export async function createAudioAction(
  formData: FormData,
): Promise<AudioItem> {
  const token = await requireSuperAdminToken();
  const audio = await createAudio(token, formData);
  revalidatePath("/super-admin/audios");
  return audio;
}

/** Action: cap nhat audio cua BAT KY admin nao */
export async function updateAudioAction(
  audioId: string,
  payload: { title?: string; description?: string },
): Promise<AudioItem> {
  const token = await requireSuperAdminToken();
  const audio = await updateAudio(token, audioId, payload);
  revalidatePath("/super-admin/audios");
  return audio;
}

/** Action: xoa audio cua BAT KY admin nao */
export async function deleteAudioAction(
  audioId: string,
): Promise<{ id: string }> {
  const token = await requireSuperAdminToken();
  const result = await deleteAudio(token, audioId);
  revalidatePath("/super-admin/audios");
  return result;
}
