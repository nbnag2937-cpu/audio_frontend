import Footer from "@/components/Footer";
import Header from "@/components/Header";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#0D241F] border-y py-5 border-[#24453D] text-[#F0FDF4]">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">Chính sách bảo mật</h1>
          <span className="text-sm text-white/70">
            Cập nhật lần cuối: 01/07/2026
          </span>
          <span>
            Trang <span className="text-white/80 font-bold">Yêu Đời Audio</span>{" "}
            tôn trọng quyền riêng tư của bạn. Chính sách này giải thích chúng
            tôi thu thập, sử dụng và bảo vệ thông tin như thế nào khi bạn truy
            cập website.
          </span>
          <h2 className="text-2xl font-bold">
            1. Thông tin chúng tôi thu thập
          </h2>
          <span className="text-white/70">
            ●{" "}
            <span className="text-white/80 font-bold">
              Thông tin bạn cung cấp:
            </span>{" "}
            địa chỉ email và tên hiển thị khi bạn tự nguyện đăng ký tài khoản
            (không bắt buộc để nghe).
          </span>
          <span className="text-white/70">
            ● <span className="text-white/80 font-bold">Dữ liệu sử dụng:</span>{" "}
            lịch sử nghe, audio đã xem, thao tác cơ bản để cải thiện dịch vụ.
          </span>
          <span className="text-white/70">
            ●{" "}
            <span className="text-white/80 font-bold">
              Dữ liệu kỹ thuật tự động:{" "}
            </span>
            địa chỉ IP, loại trình duyệt, thiết bị, trang tham chiếu và thời
            gian truy cập, được ghi nhận qua cookie và công cụ phân tích.
          </span>
          <h2 className="text-2xl font-bold">
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <span className="text-white/70">
            ● Cung cấp, vận hành và cải thiện dịch vụ nghe audio.
          </span>
          <span className="text-white/70">
            ● Ghi nhớ tuỳ chọn và lịch sử nghe của bạn.
          </span>
          <span className="text-white/70">
            ● Phân tích lượng truy cập để nâng cao chất lượng nội dung.
          </span>
          <span className="text-white/70">
            ● Hiển thị quảng cáo phù hợp nhằm duy trì dịch vụ miễn phí.
          </span>
          <h2 className="text-2xl font-bold">3. Cookie</h2>
          <span className="text-white/70">
            Cookie là các tệp nhỏ lưu trên thiết bị của bạn giúp website ghi nhớ
            tuỳ chọn và đo lường lượng truy cập. Bạn có thể tắt hoặc xoá cookie
            trong cài đặt trình duyệt; tuy nhiên một số tính năng có thể không
            hoạt động đầy đủ.
          </span>
          <h2 className="text-2xl font-bold">
            4. Quảng cáo của bên thứ ba (Google AdSense)
          </h2>
          <span className="text-white/70">
            Chúng tôi sử dụng dịch vụ quảng cáo của bên thứ ba, bao gồm{" "}
            <span className="font-bold text-white/80">Google AdSense</span>, để
            hiển thị quảng cáo trên website. Các điểm quan trọng:
          </span>
          <span className="text-white/70">
            ● Các nhà cung cấp bên thứ ba, trong đó có Google, sử dụng cookie để
            phân phối quảng cáo dựa trên các lần truy cập trước của bạn vào
            website này và các website khác.
          </span>{" "}
          <span className="text-white/70">
            ● Việc Google sử dụng cookie quảng cáo giúp Google và các đối tác
            phân phối quảng cáo phù hợp hơn với bạn.
          </span>{" "}
          <span className="text-white/70">
            ● Bạn có thể tắt quảng cáo được cá nhân hoá bằng cách truy cập{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="https://myadcenter.google.com/home?sasb=true&ref=ad-settings"
            >
              Cài đặt quảng cáo của Google.
            </a>
          </span>{" "}
          <span className="text-white/70">
            ● Bạn cũng có thể từ chối cookie của các nhà cung cấp bên thứ ba tại
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href=" www.aboutads.info/choices."
            >
              {" "}
              www.aboutads.info/choices.
            </a>
          </span>
          <span className="text-white/70">
            Tham khảo thêm cách Google sử dụng dữ liệu tại{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="https://policies.google.com/technologies/partner-sites"
            >
              policies.google.com/technologies/partner-sites.
            </a>
          </span>
          <h2 className="text-2xl font-bold">5. Công cụ phân tích</h2>
          <span className="text-white/70">
            Chúng tôi có thể dùng Google Analytics để hiểu cách người dùng tương
            tác với website. Các dữ liệu này ở dạng tổng hợp, không dùng để nhận
            dạng cá nhân bạn.
          </span>
          <h2 className="text-2xl font-bold">6. Chia sẻ thông tin</h2>
          <span className="text-white/70">
            Chúng tôi <span className="font-bold text-white/80">không bán</span>{" "}
            thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ với các nhà
            cung cấp dịch vụ cần thiết (như đối tác quảng cáo, phân tích) hoặc
            khi pháp luật yêu cầu.
          </span>
          <h2 className="text-2xl font-bold">7. Bảo mật</h2>
          <span className="text-white/70">
            Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu. Tuy nhiên,
            không có phương thức truyền tải hay lưu trữ nào trên Internet an
            toàn tuyệt đối.
          </span>
          <h2 className="text-2xl font-bold">8. Quyền của bạn</h2>
          <span className="text-white/70">
            Bạn có thể yêu cầu xem, chỉnh sửa hoặc xoá dữ liệu cá nhân, cũng như
            xoá tài khoản, bằng cách liên hệ{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mailto:hoa.bi.ngan79vxh@gmail.com"
            >
              hoa.bi.ngan79vxh@gmail.com.
            </a>
          </span>
          <h2 className="text-2xl font-bold">9. Quyền riêng tư của trẻ em</h2>
          <span className="text-white/70">
            Website không hướng đến trẻ em dưới 13 tuổi và chúng tôi không cố ý
            thu thập dữ liệu của trẻ em. Nếu phát hiện, chúng tôi sẽ xoá thông
            tin đó.
          </span>
          <h2 className="text-2xl font-bold">10. Thay đổi chính sách</h2>
          <span className="text-white/70">
            Chính sách này có thể được cập nhật theo thời gian. Mọi thay đổi sẽ
            được đăng tại trang này kèm ngày cập nhật mới.
          </span>
          <h2 className="text-2xl font-bold">11. Liên hệ</h2>
          <span className="text-white/70">
            Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mailto:hoa.bi.ngan79vxh@gmail.com"
            >
              hoa.bi.ngan79vxh@gmail.com.
            </a>
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
