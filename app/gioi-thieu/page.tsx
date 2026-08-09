import Footer from "@/components/Footer";
import Header from "@/components/Header";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#0D241F] border-y py-5 border-[#24453D] text-[#F0FDF4]">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">Giới thiệu</h1>
          <span className="text-white/70">
            <span className="font-bold text-white/80">Yêu Đời Audio</span> là
            nền tảng{" "}
            <span className="font-bold text-white/80">
              nghe audio trực tuyến miễn phí
            </span>
            , giúp bạn thưởng thức các nội dung âm thanh mọi lúc, mọi nơi ngay
            trên trình duyệt mà không cần cài đặt ứng dụng và không bắt buộc tạo
            tài khoản.
          </span>

          <h2 className="text-2xl font-bold">Chúng tôi mang đến điều gì</h2>

          <span className="text-white/70">
            ● Kho audio được sắp xếp rõ ràng, tìm kiếm nhanh, phát mượt trên cả
            điện thoại và máy tính.
          </span>
          <span className="text-white/70">
            ● Trình phát hỗ trợ chuyển tập, tua nhanh, chỉnh tốc độ và hẹn giờ
            đi ngủ.
          </span>
          <span className="text-white/70">
            ● Giao diện gọn nhẹ, tải nhanh, tiết kiệm dữ liệu.
          </span>
          <span className="text-white/70">
            ● Lưu lịch sử nghe khi bạn đăng nhập (tuỳ chọn), để nghe tiếp dễ
            dàng.
          </span>

          <h2 className="text-2xl font-bold">Sứ mệnh</h2>
          <span className="text-white/70">
            Chúng tôi mong muốn tạo ra một nơi nghe audio đơn giản, nhanh và
            thân thiện cho người dùng Việt Nam. Nội dung được cập nhật thường
            xuyên và chúng tôi luôn lắng nghe góp ý để cải thiện trải nghiệm.
          </span>
          <span className="text-white/70">
            Mọi câu hỏi hoặc góp ý, vui lòng xem trang{" "}
            <a
              href="lien-he"
              className="text-[#6ac1ab] hover:underline cursor-pointer"
            >
              Liên hệ
            </a>
            . Khi sử dụng Yêu Đời Audio, bạn đồng ý với{" "}
            <a
              href="dieu-khoan-su-dung"
              className="text-[#6ac1ab] hover:underline cursor-pointer"
            >
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a
              href="chinh-sach-bao-mat"
              className="text-[#6ac1ab] hover:underline cursor-pointer"
            >
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
