"use client";

import { useState } from "react";

/**
 * TAM THOI dung de debug UA that cua TikTok webview tren dien thoai.
 * Hien 1 nut nho goc man hinh, bam vao se xem duoc navigator.userAgent + document.referrer
 * ma KHONG can dieu huong sang trang khac (huu ich vi TikTok webview thuong khoa thanh dia chi).
 * XOA component nay (va cho goi no trong layout.tsx) sau khi debug xong.
 */
export default function DebugUaBadge() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const referrer = typeof document !== "undefined" ? document.referrer : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ua);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-[200] cursor-pointer rounded-full bg-[#D6336C] px-3 py-2 text-xs font-bold text-white shadow-lg"
      >
        UA
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[200] rounded-xl border border-[#F1D6E0] bg-white p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-black">Debug User-Agent</p>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="cursor-pointer text-black/50 hover:text-black"
        >
          ✕
        </button>
      </div>

      <p className="mb-1 text-xs font-semibold text-black/60">
        navigator.userAgent:
      </p>
      <div className="mb-3 max-h-24 overflow-y-auto break-all rounded-lg bg-[#FFF3F7] p-2 text-xs text-black">
        {ua}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mb-3 w-full cursor-pointer rounded-lg bg-[#D6336C] py-2 text-sm font-bold text-white hover:bg-[#AD1457]"
      >
        {copied ? "Đã sao chép!" : "Sao chép User-Agent"}
      </button>

      <p className="mb-1 text-xs font-semibold text-black/60">
        document.referrer:
      </p>
      <div className="break-all rounded-lg bg-[#FFF3F7] p-2 text-xs text-black">
        {referrer || "(không có)"}
      </div>
    </div>
  );
}
