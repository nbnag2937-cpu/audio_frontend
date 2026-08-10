import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Mail } from "lucide-react";

function page() {
  return (
    <div>
      <Header />
      <div className="bg-[#FFF3F7] border-y py-5 border-[#F1D6E0] text-black">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-70">
          <h1 className="text-4xl font-bold">Liên hệ</h1>
          <span className="text-black/70">
            Rất mong nhận được phản hồi từ bạn. Nếu có câu hỏi, góp ý, đề nghị
            hợp tác quảng cáo hoặc yêu cầu liên quan đến bản quyền, hãy liên hệ
            với đội ngũ
          </span>

          <h2 className="text-2xl font-bold">Chúng tôi hỗ trợ những gì</h2>
          <span className="text-black/70">
            ● Góp ý về nội dung, tính năng và trải nghiệm nghe.
          </span>
          <span className="text-black/70">
            ● Báo lỗi kỹ thuật (không phát được, sai thông tin…).
          </span>
          <span className="text-black/70">
            ● Hợp tác quảng cáo, truyền thông.
          </span>
          <span className="text-black/70">
            ● Yêu cầu gỡ nội dung vi phạm bản quyền — xem thêm trang{" "}
            <a
              className="text-[#D6336C] hover:underline cursor-pointer"
              href="mien-tru-trach-nhiem"
            >
              Miễn trừ trách nhiệm & Bản quyền
            </a>
            .
          </span>
          <span className="text-black/70">
            Chúng tôi cố gắng phản hồi trong vòng{" "}
            <span className="text-black/70 font-bold">3–5 ngày làm việc</span>.
            Cảm ơn bạn đã đồng hành cùng Audio Không Quảng Cáo.
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
