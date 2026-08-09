import {
  fetchAdLink,
  fetchPublicAudioDetail,
  fetchPublicAudios,
  fetchRankedAudios,
  fetchStreamAudio,
  fetchUnlockStatus,
  postAudioCompleted,
  postListenHeartbeat,
  postListenStop,
  postUnlockClick,
  type PaginatedAudios,
  type PublicAudioSort,
  type RankedAudioItem,
  type RankingMetric,
  type RankingPeriod,
} from "@/services/user.service";
import { ApiRequestError } from "@/lib/api-client";
import { AudioItem } from "@/types/audio";

const DEVICE_ID_KEY = "music_device_id";
const UNLOCK_EXPIRES_CACHE_KEY = "music_unlock_expires_at";

export function getOrCreateDeviceId(): string {
  const existing = window.localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const newDeviceId = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
  return newDeviceId;
}

/**
 * Action: lay danh sach audio public (trang chu, tim kiem, phan trang).
 * sort="newest" (mac dinh): moi dang gan day nhat. sort="updated": moi CHINH SUA gan day nhat.
 */
export async function listAudiosAction(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: PublicAudioSort;
}): Promise<PaginatedAudios> {
  return fetchPublicAudios(params);
}

/**
 * Action: lay bang xep hang audio.
 * metric="listening" (mac dinh) -> "dang nghe nhieu" (dua tren so lan bam phat)
 * metric="listened" -> "top luot nghe" (dua tren so lan nghe het bai)
 * period: "today" | "month" | "year" | "all" (mac dinh "today")
 *
 * Vi du dung: getRankedAudiosAction({ metric: "listening", period: "today" })
 */
export async function getRankedAudiosAction(params: {
  metric?: RankingMetric;
  period?: RankingPeriod;
  limit?: number;
}): Promise<RankedAudioItem[]> {
  return fetchRankedAudios(params);
}

/** Action tien loi: audio "dang nghe nhieu" trong ngay hom nay - dung cho widget trang chu */
export async function getTrendingTodayAction(
  limit = 10,
): Promise<RankedAudioItem[]> {
  return fetchRankedAudios({ metric: "listening", period: "today", limit });
}

/** Action tien loi: audio "top luot nghe" trong thang nay - dung cho widget/bang xep hang */
export async function getTopListenedThisMonthAction(
  limit = 10,
): Promise<RankedAudioItem[]> {
  return fetchRankedAudios({ metric: "listened", period: "month", limit });
}

/** Action: lay chi tiet 1 audio (chua co audioUrl, chi de hien thong tin/mo ta) */
export async function getAudioDetailAction(
  audioId: string,
): Promise<AudioItem> {
  return fetchPublicAudioDetail(audioId);
}

/** Action: lay link quang cao de hien thi nut "Xem quang cao de mo khoa" */
export async function getAdLinkAction(): Promise<string> {
  const { adLinkUrl } = await fetchAdLink();
  return adLinkUrl;
}

export async function unlockTodayAction(): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const { expiresAt } = await postUnlockClick(deviceId);
  window.localStorage.setItem(UNLOCK_EXPIRES_CACHE_KEY, expiresAt);
}

export async function checkUnlockStatusAction(): Promise<boolean> {
  const cachedExpiresAt = window.localStorage.getItem(UNLOCK_EXPIRES_CACHE_KEY);
  if (cachedExpiresAt && Date.now() < new Date(cachedExpiresAt).getTime()) {
    return true;
  }

  const deviceId = getOrCreateDeviceId();
  const { unlocked, remainingSeconds } = await fetchUnlockStatus(deviceId);
  if (unlocked) {
    const expiresAt = new Date(
      Date.now() + remainingSeconds * 1000,
    ).toISOString();
    window.localStorage.setItem(UNLOCK_EXPIRES_CACHE_KEY, expiresAt);
  } else {
    window.localStorage.removeItem(UNLOCK_EXPIRES_CACHE_KEY);
  }
  return unlocked;
}

export async function playAudioAction(audioId: string): Promise<AudioItem> {
  const deviceId = getOrCreateDeviceId();
  try {
    return await fetchStreamAudio(audioId, deviceId);
  } catch (error) {
    // Backend noi chua/het unlock -> xoa cache cho dong bo, lan check tiep theo se goi API that
    if (error instanceof ApiRequestError && error.code === "UNLOCK_REQUIRED") {
      window.localStorage.removeItem(UNLOCK_EXPIRES_CACHE_KEY);
    }
    throw error;
  }
}

export async function completeAudioAction(
  audioId: string,
): Promise<{ id: string; totalListened: number }> {
  return postAudioCompleted(audioId);
}

export async function heartbeatListenAction(audioId: string): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  try {
    await postListenHeartbeat(audioId, deviceId);
  } catch {
    // Khong throw - heartbeat that bai 1 nhip khong nghiem trong, backend se tu coi la
    // "het han dang nghe" sau ~45s neu heartbeat tiep tuc that bai lien tuc.
  }
}

export async function stopListenAction(audioId: string): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  try {
    await postListenStop(audioId, deviceId);
  } catch {
    // Best-effort - khong throw len UI, khong lam gian doan trai nghiem nguoi dung.
  }
}
