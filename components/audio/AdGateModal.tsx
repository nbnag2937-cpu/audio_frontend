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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B0A18]/60 px-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl scrollbar-hide">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-black/40 hover:text-black"
          aria-label="Đóng"
        >
          ✕
        </button>

        <p className="pr-6 text-center text-lg font-bold text-black">
          Mời bạn CLICK vào liên kết bên dưới và Mở Ứng Dụng Shopee để mở khóa
          audio!
        </p>

        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block truncate rounded-full border border-[#F1D6E0]/40 bg-[#7A1140] px-4 py-2 text-center text-sm text-white hover:bg-[#D6336C]/90"
        >
          › {shopeeUrl}
        </a>

        {/* Khối Banner Tự Động Lấy Ảnh */}
        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block overflow-hidden rounded-xl border border-[#F1D6E0]/60 hover:opacity-95"
        >
          <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-[#7A1140] to-[#D6336C]/40 text-sm text-white/70">
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

        <p className="mt-4 text-center text-sm text-black/60">
          Quảng cáo giúp Audio Không Quảng Cáo luôn miễn phí — mở khóa là nghe
          được ngay.
        </p>

        <div className="mt-3 rounded-xl border border-[#D6336C]/30 bg-[#D6336C]/10 p-3 text-sm text-black">
          <p>
            Bấm{" "}
            <span className="font-bold">&quot;Mở khóa &amp; nghe&quot;</span> là
            audio <span className="font-bold">tự phát ngay</span>.
          </p>
          <p className="text-black/60">
            Chưa phát? Quay lại bấm nút Phát là được.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          className="mt-4 w-full cursor-pointer rounded-lg bg-[#D6336C] py-3 font-bold text-white hover:bg-[#AD1457]"
        >
          Mở khóa &amp; nghe
        </button>

        <p className="mt-3 text-center text-xs text-black/50">
          Lưu ý: Quảng Cáo trên chỉ xuất hiện 1 lần trong ngày, mong Quý độc giả
          ủng hộ.
        </p>
      </div>
    </div>
  );
}

export default AdGateModal;
