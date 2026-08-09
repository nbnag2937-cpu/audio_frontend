/**
 * user.service.ts
 * Tang SERVICE cho role USER - goi API THAT tu backend (khop dung README backend:
 * modules "public" va "unlock", khong can token).
 */

import { ApiRequestError } from "@/lib/api-client";
import { AudioItem } from "@/types/audio";

// Backend mount routes duoi tien to "/api" (vd /api/public/audios, /api/unlock/ad-link)
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

export type PublicAudioSort = "newest" | "updated";
export type RankingMetric = "listening" | "listened";
export type RankingPeriod = "today" | "month" | "year" | "all";

export interface UnlockClickResult {
  deviceId: string;
  unlocked: boolean;
  unlockedAt: string;
  expiresAt: string;
}

export interface UnlockStatusResult {
  unlocked: boolean;
  remainingSeconds: number;
}

export interface PaginatedAudios {
  items: AudioItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RankedAudioItem extends AudioItem {
  listenCount: number;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  code?: string;
  message?: string;
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

/** Goi fetch toi backend, parse envelope { success, data } / { success: false, code, message } */
async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    // Danh sach/xep hang/trang thai unlock thay doi lien tuc -> khong cache o Next.js
    cache: "no-store",
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.success) {
    const failure = json as ApiFailure;
    throw new ApiRequestError(
      response.status,
      failure.code ?? "UNKNOWN_ERROR",
      failure.message ?? "Đã có lỗi xảy ra, vui lòng thử lại",
    );
  }

  return json.data;
}

function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

/** GET /api/public/audios - danh sach audio public (status=ready), phan trang + tim kiem */
export function fetchPublicAudios(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: PublicAudioSort;
}): Promise<PaginatedAudios> {
  const query = buildQueryString({
    search: params.search,
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
  });
  return request<PaginatedAudios>(`/public/audios${query}`);
}

/** GET /api/public/audios/ranking - bang xep hang theo luot nghe/dang nghe */
export function fetchRankedAudios(params: {
  metric?: RankingMetric;
  period?: RankingPeriod;
  limit?: number;
}): Promise<RankedAudioItem[]> {
  const query = buildQueryString({
    metric: params.metric,
    period: params.period,
    limit: params.limit,
  });
  return request<RankedAudioItem[]>(`/public/audios/ranking${query}`);
}

/** GET /api/public/audios/:id - chi tiet audio public, parts KHONG co audioUrl */
export function fetchPublicAudioDetail(audioId: string): Promise<AudioItem> {
  return request<AudioItem>(`/public/audios/${audioId}`);
}

/** GET /api/unlock/ad-link - link quang cao de hien nut "Xem quang cao de mo khoa" */
export function fetchAdLink(): Promise<{ adLinkUrl: string }> {
  return request<{ adLinkUrl: string }>("/unlock/ad-link");
}

/** POST /api/unlock/click - ghi nhan mo khoa hom nay cho 1 deviceId */
export function postUnlockClick(deviceId: string): Promise<UnlockClickResult> {
  return request<UnlockClickResult>("/unlock/click", {
    method: "POST",
    body: { deviceId },
  });
}

/** GET /api/unlock/status - kiem tra hom nay deviceId nay da mo khoa chua */
export function fetchUnlockStatus(
  deviceId: string,
): Promise<UnlockStatusResult> {
  const query = buildQueryString({ deviceId });
  return request<UnlockStatusResult>(`/unlock/status${query}`);
}

/**
 * GET /api/public/audios/:id/stream - audio DE PHAT, parts co audioUrl that (R2).
 * Neu chua mo khoa hom nay, backend tra 403 kem code "UNLOCK_REQUIRED" -> request()
 * o tren tu dong nem ApiRequestError, playAudioAction() (trong user.actions.ts) se bat lai.
 */
export function fetchStreamAudio(
  audioId: string,
  deviceId: string,
): Promise<AudioItem> {
  const query = buildQueryString({ deviceId });
  return request<AudioItem>(`/public/audios/${audioId}/stream${query}`);
}

/** POST /api/public/audios/:id/complete - bao da nghe het bai, backend tang totalListened */
export function postAudioCompleted(
  audioId: string,
): Promise<{ id: string; totalListened: number }> {
  return request<{ id: string; totalListened: number }>(
    `/public/audios/${audioId}/complete`,
    {
      method: "POST",
    },
  );
}

/**
 * POST /api/public/audios/:id/listen-heartbeat - bao "van dang nghe" cho 1 deviceId.
 * Goi 1 lan khi bam play, roi lap lai dinh ky (~20s) trong luc audio dang phat.
 */
export function postListenHeartbeat(
  audioId: string,
  deviceId: string,
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/public/audios/${audioId}/listen-heartbeat`, {
    method: "POST",
    body: { deviceId },
  });
}

/**
 * POST /api/public/audios/:id/listen-stop - bao dung nghe NGAY (best-effort).
 * Goi khi pause/dung/chuyen bai/roi trang. Khong bat buoc phai thanh cong - da co
 * co che het han heartbeat o backend lam fallback neu request nay khong toi duoc server.
 */
export function postListenStop(
  audioId: string,
  deviceId: string,
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/public/audios/${audioId}/listen-stop`, {
    method: "POST",
    body: { deviceId },
  });
}
