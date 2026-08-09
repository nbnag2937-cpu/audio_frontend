"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface HomeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function HomeError({ error, reset }: HomeErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0D241F] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <AlertTriangle size={28} />
      </div>

      <h1 className="text-xl font-semibold text-[#F0FDF4]">
        Không thể tải trang
      </h1>

      <p className="max-w-md text-sm text-[#F0FDF4]/60">
        Đã có lỗi xảy ra khi tải danh sách audio. Vui lòng thử lại.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-[#6ac1ab] px-5 py-2.5 font-semibold text-[#0D241F] hover:bg-[#57ad98]"
      >
        <RotateCcw size={18} />
        Thử lại
      </button>
    </div>
  );
}

export default HomeError;
