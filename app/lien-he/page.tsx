import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail } from "lucide-react";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#0D241F] border-y py-5 border-[#24453D] text-[#F0FDF4]">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">Liên hệ</h1>
          <span className="text-white/70">
            Rất mong nhận được phản hồi từ bạn. Nếu có câu hỏi, góp ý, đề nghị
            hợp tác quảng cáo hoặc yêu cầu liên quan đến bản quyền, hãy liên hệ
            với đội ngũ{" "}
            <span className="text-white/70 font-bold">Yêu Đời Audio</span> qua
            email:
          </span>
          <div className="flex items-center gap-1">
            <Mail />
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mailto:hoa.bi.ngan79vxh@gmail.com"
            >
              hoa.bi.ngan79vxh@gmail.com
            </a>{" "}
          </div>

          <h2 className="text-2xl font-bold">Chúng tôi hỗ trợ những gì</h2>
          <span className="text-white/70">
            ● Góp ý về nội dung, tính năng và trải nghiệm nghe.
          </span>
          <span className="text-white/70">
            ● Báo lỗi kỹ thuật (không phát được, sai thông tin…).
          </span>
          <span className="text-white/70">
            ● Hợp tác quảng cáo, truyền thông.
          </span>
          <span className="text-white/70">
            ● Yêu cầu gỡ nội dung vi phạm bản quyền — xem thêm trang{" "}
            <a
              className="text-[#6ac1ab] hover:underline cursor-pointer"
              href="mien-tru-trach-nhiem"
            >
              Miễn trừ trách nhiệm & Bản quyền
            </a>
            .
          </span>
          <span className="text-white/70">
            Chúng tôi cố gắng phản hồi trong vòng{" "}
            <span className="text-white/70 font-bold">3–5 ngày làm việc</span>.
            Cảm ơn bạn đã đồng hành cùng Yêu Đời Audio.
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
