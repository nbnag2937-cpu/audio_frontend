"use client";

import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <div className="py-5 px-3 bg-[#FFEAF1] flex items-center gap-2">
      <Image src={"/logo.svg"} alt="logo" width={30} height={30} priority />
      <Link href={"/"} className="font-bold text-xl text-[#D6336C]">
        Audio Không Quảng Cáo
      </Link>
    </div>
  );
}

export default Header;
