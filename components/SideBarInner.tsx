"use client";
import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

export default function SideBarInner() {
  const [isMinimized, setIsMinimized] = useState(true);

  //TODO: 실제 데이터로 교체 필요
  const data =
    "세종문화회관의 대표 공연 브랜드 ‘세종시즌’은 매해 다양한 공연 예술을 통해 관객과 소통하는 프로그램입니다.";
  return (
    <article
      className={twMerge(
        clsx(
          "relative z-20 transition-[height] duration-250 flex flex-row items-start py-margin text-s text-white bg-black",
          isMinimized
            ? "h-[5rem] cursor-pointer after:content-[''] after:absolute after:inset-0 after:block after:w-full after:h-full after:bg-black-fade"
            : "h-full",
        ),
      )}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {data}
      <button
        type="button"
        aria-label="더보기"
        className="w-[4rem] h-[4rem] flex items-center justify-center cursor-pointer"
        onClick={() => setIsMinimized((prev) => !prev)}
      >
        <Image
          src="/icons/icon_scroll_top_arrow.svg"
          alt="더보기"
          width={40}
          height={40}
          className={clsx(
            "transition-transform duration-200 w-fit aspect-square",
            isMinimized ? "rotate-0" : "rotate-180",
          )}
        />
      </button>
    </article>
  );
}
