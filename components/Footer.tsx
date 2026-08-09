"use client";

import Link from "next/link";

function Footer() {
  return (
    <div className="bg-[#071A16] pt-10 pb-30 px-3 gap-5 text-[#F0FDF4] flex flex-col items-center">
      <div className="flex gap-5 flex-wrap justify-center text-sm ">
        <Link href={"/gioi-thieu"} className="hover:text-[#5c9f8e]">
          Giới thiệu
        </Link>
        <Link href={"/lien-he"} className="hover:text-[#5c9f8e]">
          Liên hệ
        </Link>
        <Link href={"/chinh-sach-bao-mat"} className="hover:text-[#5c9f8e]">
          Chính sách bảo mật
        </Link>
        <Link href={"/dieu-khoan-su-dung"} className="hover:text-[#5c9f8e]">
          Điều khoản sử dụng
        </Link>
        <Link href={"/mien-tru-trach-nhiem"} className="hover:text-[#5c9f8e]">
          Miễn trừ trách nhiệm & Bản quyền
        </Link>
      </div>
      <span className="text-sm">
        © 2026 Yêu đời Audio. Nghe audio trực tuyến miễn phí.
      </span>
    </div>
  );
}

export default Footer;
