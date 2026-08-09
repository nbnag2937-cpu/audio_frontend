const AD_GATE_STORAGE_KEY = "audio-ad-unlocked-date";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasUnlockedToday(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AD_GATE_STORAGE_KEY) === getTodayKey();
  } catch {
    return false;
  }
}

export function markUnlockedToday(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AD_GATE_STORAGE_KEY, getTodayKey());
  } catch {
    // bỏ qua nếu trình duyệt chặn (private mode...)
  }
}
