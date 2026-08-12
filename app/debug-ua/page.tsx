"use client";

import { useEffect, useState } from "react";

export default function DebugUaPage() {
  const [ua, setUa] = useState("");
  const [referrer, setReferrer] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUa(navigator.userAgent || "");
    setReferrer(document.referrer || "(không có)");
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ua);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3F7] p-4 text-black">
      <h1 className="mb-4 text-xl font-bold">Debug: User-Agent hiện tại</h1>

      <p className="mb-1 text-sm font-semibold text-black/70">
        navigator.userAgent:
      </p>
      <div className="mb-4 break-all rounded-lg border border-[#F1D6E0] bg-white p-3 text-sm">
        {ua || "Đang đọc..."}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mb-6 w-full cursor-pointer rounded-lg bg-[#D6336C] py-3 font-bold text-white hover:bg-[#AD1457]"
      >
        {copied ? "Đã sao chép!" : "Sao chép User-Agent"}
      </button>

      <p className="mb-1 text-sm font-semibold text-black/70">
        document.referrer:
      </p>
      <div className="break-all rounded-lg border border-[#F1D6E0] bg-white p-3 text-sm">
        {referrer || "Đang đọc..."}
      </div>
    </div>
  );
}
