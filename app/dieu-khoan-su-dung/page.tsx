import Footer from "@/components/Footer";
import Header from "@/components/Header";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#0D241F] border-y py-5 border-[#24453D] text-[#F0FDF4]">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">Điều khoản sử dụng</h1>
          <span className="text-sm text-white/70">
            Cập nhật lần cuối: 01/07/2026
          </span>
          <span>
            Bằng việc truy cập và sử dụng{" "}
            <span className="text-white/80 font-bold">Yêu Đời Audio</span>, bạn
            đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng
            ngừng sử dụng website.
          </span>
          <h2 className="text-2xl font-bold">1. Chấp nhận điều khoản</h2>
          <span className="text-white/70">
            Việc bạn tiếp tục sử dụng website đồng nghĩa với việc chấp nhận toàn
            bộ điều khoản này và các cập nhật sau đó.
          </span>
          <h2 className="text-2xl font-bold">2. Sử dụng dịch vụ</h2>
          <span className="text-white/70">
            ● Website cung cấp nội dung audio phục vụ nhu cầu giải trí và nghe
            cá nhân, phi thương mại.
          </span>
          <span className="text-white/70">
            ● Bạn không được sao chép, phân phối lại, khai thác thương mại nội
            dung khi chưa được phép.
          </span>
          <span className="text-white/70">
            ● Không sử dụng website cho mục đích vi phạm pháp luật, phá hoại hệ
            thống hoặc gây hại cho người dùng khác.
          </span>
          <h2 className="text-2xl font-bold">3. Tài khoản</h2>
          <span className="text-white/70">
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động
            diễn ra dưới tài khoản của mình. Vui lòng thông báo cho chúng tôi
            nếu nghi ngờ tài khoản bị truy cập trái phép.
          </span>
          <h2 className="text-2xl font-bold">4. Sở hữu trí tuệ & nội dung</h2>
          <span className="text-white/70">
            Các quyền sở hữu trí tuệ đối với nội dung thuộc về chủ sở hữu hợp
            pháp tương ứng. Nếu bạn cho rằng nội dung nào vi phạm bản quyền, vui
            lòng xem trang{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mien-tru-trach-nhiem"
            >
              Miễn trừ trách nhiệm & Bản quyền
            </a>{" "}
            để yêu cầu gỡ bỏ.
          </span>
          <h2 className="text-2xl font-bold">
            5. Quảng cáo & liên kết bên thứ ba
          </h2>
          <span className="text-white/70">
            Website có thể hiển thị quảng cáo và liên kết đến bên thứ ba. Chúng
            tôi không kiểm soát và không chịu trách nhiệm về nội dung, sản phẩm
            hay chính sách của các bên đó.
          </span>
          <h2 className="text-2xl font-bold">6. Miễn trừ bảo đảm</h2>
          <span className="text-white/70">
            Dịch vụ được cung cấp “nguyên trạng” và “theo khả năng sẵn có”.
            Chúng tôi không bảo đảm website luôn hoạt động liên tục, không lỗi
            hay không bị gián đoạn.
          </span>
          <h2 className="text-2xl font-bold">7. Giới hạn trách nhiệm</h2>
          <span className="text-white/70">
            Trong phạm vi pháp luật cho phép, Yêu Đời Audio không chịu trách
            nhiệm cho bất kỳ thiệt hại gián tiếp hay phát sinh nào từ việc sử
            dụng hoặc không thể sử dụng website.
          </span>
          <h2 className="text-2xl font-bold">8. Thay đổi điều khoản</h2>
          <span className="text-white/70">
            Chúng tôi có thể cập nhật điều khoản bất cứ lúc nào. Phiên bản mới
            có hiệu lực ngay khi đăng tải.
          </span>
          <h2 className="text-2xl font-bold">9. Liên hệ</h2>
          <span className="text-white/70">
            Mọi câu hỏi về điều khoản, vui lòng liên hệ{" "}
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
