"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createAudio,
  deleteAudio,
  fetchAudioDetail,
  fetchMyAudios,
  fetchProfile,
  login,
  updateAudio,
  type AdminAccount,
} from "@/services/admin.service";
import { AudioItem } from "@/types/audio";
import { AdminNotAuthenticatedError } from "@/lib/error";

const ADMIN_TOKEN_COOKIE = "admin_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 ngay

/** Doc token admin tu cookie, throw AdminNotAuthenticatedError neu chua dang nhap */
async function requireAdminToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) throw new AdminNotAuthenticatedError();
  return token;
}

/**
 * Action: dang nhap ADMIN.
 * - Goi API login
 * - Luu accessToken vao cookie httpOnly "admin_token"
 * - Tra ve thong tin tai khoan (KHONG tra ve token, vi FE khong can dung truc tiep token)
 */
export async function loginAdminAction(
  email: string,
  password: string,
): Promise<AdminAccount> {
  const cookieStore = await cookies();
  const { accessToken, account } = await login(email, password);

  cookieStore.set(ADMIN_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });

  return account;
}

/** Action: dang xuat ADMIN - xoa cookie chua token */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
}

/** Action: lay thong tin tai khoan admin dang dang nhap (dung cho header/avatar...) */
export async function getAdminProfileAction(): Promise<AdminAccount> {
  const token = await requireAdminToken();
  return fetchProfile(token);
}

/** Action: lay danh sach audio cua chinh admin dang dang nhap (trang "Audio cua toi") */
export async function getMyAudiosAction(): Promise<AudioItem[]> {
  const token = await requireAdminToken();
  return fetchMyAudios(token);
}

/** Action: xem chi tiet 1 audio cua chinh minh (kem audioUrl de preview lai truoc khi luu) */
export async function getAudioDetailAction(
  audioId: string,
): Promise<AudioItem> {
  const token = await requireAdminToken();
  return fetchAudioDetail(token, audioId);
}

/**
 * Action: tao audio moi.
 * formData PHAI co field "audioFile" (File), "title" (string), "description" (tuy chon).
 * Vi du goi tu Client Component (form upload):
 *   const formData = new FormData(formElement);
 *   await createAudioAction(formData);
 */
export async function createAudioAction(
  formData: FormData,
): Promise<AudioItem> {
  const token = await requireAdminToken();
  const audio = await createAudio(token, formData);
  // Lam moi cache trang danh sach audio cua admin sau khi tao moi
  revalidatePath("/admin/audios");
  return audio;
}

/** Action: cap nhat title/description cua 1 audio */
export async function updateAudioAction(
  audioId: string,
  payload: { title?: string; description?: string },
): Promise<AudioItem> {
  const token = await requireAdminToken();
  const audio = await updateAudio(token, audioId, payload);
  revalidatePath("/admin/audios");
  revalidatePath(`/admin/audios/${audioId}`);
  return audio;
}

/** Action: xoa 1 audio (xoa ca file tren R2) */
export async function deleteAudioAction(
  audioId: string,
): Promise<{ id: string }> {
  const token = await requireAdminToken();
  const result = await deleteAudio(token, audioId);
  revalidatePath("/admin/audios");
  return result;
}
