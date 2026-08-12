"use client";

import { useState } from "react";

const TIKTOK_UA_PATTERN = /musical_ly|tiktok|trill|aweme|bytedance/i;

function isTikTokInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const ua =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    "";
  const referrer = document.referrer || "";

  return (
    TIKTOK_UA_PATTERN.test(ua) ||
    referrer.includes("tiktok.com") ||
    referrer.includes("tiktok")
  );
}

type CheckerState = {
  isOpen: boolean;
  currentUrl: string;
};

function getInitialState(): CheckerState {
  if (typeof window === "undefined") {
    return { isOpen: false, currentUrl: "" };
  }
  const detected = isTikTokInAppBrowser();
  return {
    isOpen: detected,
    currentUrl: detected ? window.location.href : "",
  };
}

export default function TikTokChecker() {
  const [state] = useState<CheckerState>(getInitialState);
  const [copied, setCopied] = useState(false);

  const { isOpen, currentUrl } = state;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#2B0A18]/60 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl scrollbar-hide">
        <h2 className="text-center text-2xl font-bold text-black">
          Bạn đang mở trong TikTok
        </h2>

        <p className="mt-3 text-center text-black/70">
          Trình duyệt trong TikTok{" "}
          <span className="font-bold text-black">không nghe audio được</span>.
          Hãy mở bằng{" "}
          <span className="font-bold text-[#D6336C]">Safari / Chrome</span>{" "}
          (trình duyệt ngoài) để tiếp tục nghe.
        </p>

        <div className="mt-5 rounded-xl border border-[#D6336C]/30 bg-[#D6336C]/8 p-4">
          <p className="font-bold text-[#D6336C]">
            Cách mở bằng trình duyệt ngoài:
          </p>
          <p className="mt-2 text-black">
            <span className="font-bold text-[#D6336C]">1.</span> Bấm nút{" "}
            <span className="font-bold">•••</span> ở góc trên bên phải
          </p>
          <p className="mt-1 text-black">
            <span className="font-bold text-[#D6336C]">2.</span> Chọn{" "}
            <span className="font-bold">&quot;Mở trong trình duyệt&quot;</span>
          </p>
        </div>

        <p className="mt-5 text-center text-sm text-black/40">— hoặc —</p>

        <p className="mt-4 text-sm text-black/70">Sao chép liên kết:</p>
        <div className="mt-2 break-all rounded-lg border border-[#F1D6E0] bg-[#FFF3F7] px-4 py-3 text-sm text-black/70">
          {currentUrl}
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="mt-3 w-full cursor-pointer rounded-lg bg-[#D6336C] py-3 font-bold text-white hover:bg-[#AD1457]"
        >
          {copied ? "Đã sao chép!" : "Sao chép liên kết"}
        </button>

        <p className="mt-3 text-center text-sm text-black/50">
          Rồi dán vào trình duyệt để mở.
        </p>
      </div>
    </div>
  );
}
