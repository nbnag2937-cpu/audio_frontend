"use client";

import Link from "next/link";

function Footer() {
  return (
    <div className="bg-[#FFEAF1] pt-10 pb-30 px-3 gap-5 text-black flex flex-col items-center">
      <div className="flex gap-5 flex-wrap justify-center text-sm ">
        <Link href={"/gioi-thieu"} className="hover:text-[#D6336C]">
          Giới thiệu
        </Link>
        <Link href={"/lien-he"} className="hover:text-[#D6336C]">
          Liên hệ
        </Link>
        <Link href={"/chinh-sach-bao-mat"} className="hover:text-[#D6336C]">
          Chính sách bảo mật
        </Link>
        <Link href={"/dieu-khoan-su-dung"} className="hover:text-[#D6336C]">
          Điều khoản sử dụng
        </Link>
        <Link href={"/mien-tru-trach-nhiem"} className="hover:text-[#D6336C]">
          Miễn trừ trách nhiệm & Bản quyền
        </Link>
      </div>
      <span className="text-sm">
        © 2026 Audio Không Quảng Cáo. Nghe audio trực tuyến miễn phí.
      </span>
    </div>
  );
}

export default Footer;
