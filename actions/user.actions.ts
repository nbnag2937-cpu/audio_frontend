"use client";

/**
 * user.actions.ts
 * Tang ACTION cho role USER. UI chi duoc goi cac ham trong file nay (KHONG goi thang user.service.ts).
 *
 * Vi sao la "use client" thay vi Next.js Server Action ("use server")?
 * -> deviceId phai luu trong LOCALSTORAGE (chi ton tai o trinh duyet), Server Action chay tren server
 *    nen KHONG the doc/ghi localStorage. Vi vay nhom action nay la ham client thuong, UI (Client Component)
 *    goi truc tiep, khong phai qua co che <form action={...}> cua Server Action.
 *
 * localStorage keys su dung:
 *   - "music_device_id"    : UUID dinh danh thiet bi, tao 1 lan duy nhat, dung mai ve sau
 *   - "music_unlock_date"  : ngay (YYYY-MM-DD) gan nhat da xac nhan mo khoa thanh cong,
 *                            dung de CACHE, tranh phai goi API kiem tra unlock moi lan vao trang
 */

import {
  fetchAdLink,
  fetchPublicAudioDetail,
  fetchPublicAudios,
  fetchRankedAudios,
  fetchStreamAudio,
  fetchUnlockStatus,
  postAudioCompleted,
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
const UNLOCK_DATE_CACHE_KEY = "music_unlock_date";

/** Tra ve ngay hien tai dang YYYY-MM-DD theo UTC - PHAI khop cach tinh ngay ben backend */
function getTodayDateKeyUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Lay deviceId trong localStorage, neu chua co thi tu tao 1 UUID moi va luu lai.
 * Goi ham nay o dau moi action can deviceId - khong can UI tu quan ly.
 */
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

/**
 * Action: goi SAU KHI nguoi dung da bam vao link quang cao (vd: sau khi tab quang cao duoc mo).
 * Ghi nhan mo khoa cho hom nay tren server, dong thoi cache lai ngay hom nay vao localStorage
 * de cac lan check unlock tiep theo trong ngay khong can goi API nua.
 */
export async function unlockTodayAction(): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  await postUnlockClick(deviceId);
  window.localStorage.setItem(UNLOCK_DATE_CACHE_KEY, getTodayDateKeyUTC());
}

/**
 * Action: kiem tra hom nay da mo khoa chua.
 * Uu tien doc cache trong localStorage truoc (nhanh, khong goi API);
 * chi goi API that su khi chua co cache hoac cache la cua ngay khac (hom qua).
 */
export async function checkUnlockStatusAction(): Promise<boolean> {
  const today = getTodayDateKeyUTC();
  const cachedDate = window.localStorage.getItem(UNLOCK_DATE_CACHE_KEY);
  if (cachedDate === today) return true;

  const deviceId = getOrCreateDeviceId();
  const { unlocked } = await fetchUnlockStatus(deviceId);
  if (unlocked) {
    window.localStorage.setItem(UNLOCK_DATE_CACHE_KEY, today);
  }
  return unlocked;
}

/**
 * Action: phat 1 audio - tra ve AudioItem kem parts co audioUrl.
 * Neu chua mo khoa hom nay, backend tra ve loi code "UNLOCK_REQUIRED" -> action nem lai loi nay
 * (giu nguyen ApiRequestError) de UI bat va hien lai nut quang cao thay vi phat nhac.
 *
 * Vi du dung trong Client Component:
 *   try {
 *     const audio = await playAudioAction(id);
 *     // phat audio.parts[0].audioUrl ...
 *   } catch (err) {
 *     if (err instanceof ApiRequestError && err.code === "UNLOCK_REQUIRED") {
 *       // hien modal/nut "Xem quang cao de mo khoa"
 *     }
 *   }
 */
export async function playAudioAction(audioId: string): Promise<AudioItem> {
  const deviceId = getOrCreateDeviceId();
  try {
    const audio = await fetchStreamAudio(audioId, deviceId);
    // Goi thanh cong nghia la chac chan da unlock -> cap nhat luon cache cho chac
    window.localStorage.setItem(UNLOCK_DATE_CACHE_KEY, getTodayDateKeyUTC());
    return audio;
  } catch (error) {
    // Backend noi chua unlock (vd: cache localStorage cu, hoac sang ngay moi) -> xoa cache cho dong bo
    if (error instanceof ApiRequestError && error.code === "UNLOCK_REQUIRED") {
      window.localStorage.removeItem(UNLOCK_DATE_CACHE_KEY);
    }
    throw error;
  }
}

/** Action: bao da nghe het 1 audio (goi luc bat su kien "ended" cua the <audio>/<video>) */
export async function completeAudioAction(
  audioId: string,
): Promise<{ id: string; totalListened: number }> {
  return postAudioCompleted(audioId);
}
