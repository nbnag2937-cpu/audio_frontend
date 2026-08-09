"use client";

interface AdGateModalProps {
  shopeeUrl: string;
  onUnlock: () => void;
  onClose: () => void;
}

function AdGateModal({ shopeeUrl, onUnlock, onClose }: AdGateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D241F]/70 px-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
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
          className="mt-4 block cursor-pointer rounded-full border border-[#24453D]/20 bg-[#F0FDF4] px-4 py-2 text-center text-sm text-[#0D241F] hover:bg-[#6ac1ab]/15"
        >
          › {shopeeUrl}
        </a>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#24453D]/10">
          <div className="flex h-40 items-center justify-center bg-linear-to-br from-[#F0FDF4] to-[#6ac1ab]/30 text-sm text-[#0D241F]/50">
            Banner quảng cáo
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-[#0D241F]/40 line-through">299.000đ</p>
              <p className="text-lg font-bold text-red-500">145.250đ</p>
            </div>
            <div className="h-14 w-14 rounded bg-[#F0FDF4]" />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-[#0D241F]/70">
          Quảng cáo giúp Yêu Đời Audio luôn miễn phí — mở khóa là nghe được
          ngay.
        </p>

        <div className="mt-3 rounded-xl border border-[#6ac1ab]/40 bg-[#6ac1ab]/10 p-3 text-sm text-[#0D241F]">
          <p>
            Bấm <span className="font-bold">“Mở khóa &amp; nghe”</span> là audio{" "}
            <span className="font-bold">tự phát ngay</span>.
          </p>
          <p className="text-[#0D241F]/70">
            Chưa phát? Quay lại bấm nút Phát là được.
          </p>
        </div>

        <button
          type="button"
          onClick={onUnlock}
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
