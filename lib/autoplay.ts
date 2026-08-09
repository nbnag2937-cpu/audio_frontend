const AUTOPLAY_FLAG_KEY = "audio-autoplay-next";

export function markAutoplayNext(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(AUTOPLAY_FLAG_KEY, "1");
  } catch {
    // bỏ qua nếu trình duyệt chặn storage
  }
}

export function consumeAutoplayNext(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const shouldAutoplay =
      window.sessionStorage.getItem(AUTOPLAY_FLAG_KEY) === "1";
    if (shouldAutoplay) window.sessionStorage.removeItem(AUTOPLAY_FLAG_KEY);
    return shouldAutoplay;
  } catch {
    return false;
  }
}
