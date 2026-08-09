"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="py-5 px-3 bg-[#071A16] flex items-center gap-2">
      <Image src={"/logo.svg"} alt="logo" width={30} height={30} priority />
      <Link href={"/"} className="font-bold text-xl text-[#F0FDF4]">
        Yêu Đời Audio
      </Link>
    </div>
  );
}

export default Header;
