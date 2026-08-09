"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AdGateModalProps {
  shopeeUrl: string;
  onUnlock: () => void;
  onClose: () => void;
}

function AdGateModal({ shopeeUrl, onUnlock, onClose }: AdGateModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const isLoadingImage =
    Boolean(shopeeUrl) && (isFetching || (!imageUrl && isFetching));

  useEffect(() => {
    if (!shopeeUrl) return;

    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) setIsFetching(true);
    });

    fetch(`/api/og-preview?url=${encodeURIComponent(shopeeUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shopeeUrl]);

  const handleUnlock = () => {
    window.open(shopeeUrl, "_blank", "noopener,noreferrer");
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D241F]/70 px-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl scrollbar-hide">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-[#0D241F]/50 hover:text-[#0D241F]"
          aria-label="Đóng"
        >
          ✕
        </button>

        <p className="pr-6 text-center text-lg font-bold text-[#0D241F]">
          Mời bạn CLICK vào liên kết bên dưới và Mở Ứng Dụng Shopee để mở khóa
          audio!
        </p>

        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block truncate rounded-full border border-[#24453D]/20 bg-[#F0FDF4] px-4 py-2 text-center text-sm text-[#0D241F] hover:bg-[#6ac1ab]/15"
        >
          › {shopeeUrl}
        </a>

        {/* Khối Banner Tự Động Lấy Ảnh */}
        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block overflow-hidden rounded-xl border border-[#24453D]/10 hover:opacity-95"
        >
          <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-[#F0FDF4] to-[#6ac1ab]/30 text-sm text-[#0D241F]/50">
            {isLoadingImage ? (
              <span className="animate-pulse">Đang tải xem trước...</span>
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt="Shopee Preview"
                fill
                className="object-cover"
              />
            ) : (
              <span>Banner quảng cáo</span>
            )}
          </div>
        </a>

        <p className="mt-4 text-center text-sm text-[#0D241F]/70">
          Quảng cáo giúp Yêu Đời Audio luôn miễn phí — mở khóa là nghe được
          ngay.
        </p>

        <div className="mt-3 rounded-xl border border-[#6ac1ab]/40 bg-[#6ac1ab]/10 p-3 text-sm text-[#0D241F]">
          <p>
            Bấm{" "}
            <span className="font-bold">&quot;Mở khóa &amp; nghe&quot;</span> là
            audio <span className="font-bold">tự phát ngay</span>.
          </p>
          <p className="text-[#0D241F]/70">
            Chưa phát? Quay lại bấm nút Phát là được.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          className="mt-4 w-full cursor-pointer rounded-lg bg-[#6ac1ab] py-3 font-bold text-[#0D241F] hover:bg-[#57ad98]"
        >
          Mở khóa &amp; nghe
        </button>

        <p className="mt-3 text-center text-xs text-[#0D241F]/50">
          Lưu ý: Quảng Cáo trên chỉ xuất hiện 1 lần trong ngày, mong Quý độc giả
          ủng hộ.
        </p>
      </div>
    </div>
  );
}

export default AdGateModal;
