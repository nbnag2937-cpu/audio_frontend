import Footer from "@/components/Footer";
import Header from "@/components/Header";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#0D241F] border-y py-5 border-[#24453D] text-[#F0FDF4]">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">
            Miễn trừ trách nhiệm & Bản quyền
          </h1>
          <span className="text-sm text-white/70">
            Cập nhật lần cuối: 01/07/2026
          </span>
          <h2 className="text-2xl font-bold">Miễn trừ trách nhiệm</h2>
          <span className="text-white/70">
            Nội dung trên{" "}
            <span className="font-bold text-white/80">Yêu Đời Audio</span> được
            cung cấp nhằm mục đích giải trí và tham khảo cá nhân. Chúng tôi nỗ
            lực bảo đảm thông tin chính xác nhưng không cam kết về tính đầy đủ,
            kịp thời hay phù hợp cho một mục đích cụ thể nào.
          </span>
          <span className="text-white/70">
            Website có thể chứa quảng cáo và liên kết đến bên thứ ba. Chúng tôi
            không chịu trách nhiệm về nội dung, sản phẩm, dịch vụ của các bên
            đó; việc bạn tương tác với họ là hoàn toàn tự nguyện và tự chịu rủi
            ro.
          </span>
          <h2 className="text-2xl font-bold">
            Bản quyền & quy trình gỡ nội dung (DMCA)
          </h2>
          <span className="text-white/70">
            Chúng tôi tôn trọng quyền sở hữu trí tuệ và mong muốn xử lý nhanh
            các khiếu nại bản quyền hợp lệ. Nếu bạn là chủ sở hữu (hoặc đại diện
            hợp pháp) và cho rằng một nội dung trên website vi phạm bản quyền
            của bạn, vui lòng gửi email tới{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mailto:hoa.bi.ngan79vxh@gmail.com"
            >
              hoa.bi.ngan79vxh@gmail.com
            </a>{" "}
            kèm các thông tin:
          </span>
          <span className="text-white/70">
            ● Thông tin liên hệ của bạn (họ tên, email, số điện thoại nếu có).
          </span>
          <span className="text-white/70">
            ● Mô tả nội dung được bảo hộ và đường dẫn (URL) tới nội dung vi phạm
            trên website.
          </span>
          <span className="text-white/70">
            ● Bằng chứng bạn là chủ sở hữu hoặc được uỷ quyền hợp pháp.
          </span>
          <span className="text-white/70">
            ● Cam kết thông tin cung cấp là chính xác và trung thực.
          </span>
          <span className="text-white/70">
            Sau khi nhận được yêu cầu hợp lệ, chúng tôi sẽ xem xét và{" "}
            <span className="font-bold text-white/80">
              gỡ bỏ nội dung vi phạm trong thời gian sớm nhất
            </span>{" "}
            (thường trong vòng 48–72 giờ làm việc). Cảm ơn bạn đã giúp Yêu Đời
            Audio tuân thủ đúng quy định về bản quyền.
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
