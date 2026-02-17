"use client";
import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { postsQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { useQuery } from "@tanstack/react-query";

export default function Caption() {
  const [isMinimized, setIsMinimized] = useState(true);
  const { selectedProjectId, language } = useAppState();

  //쿼리 내부에서 enabled로 id가 없으면 쿼리를 실행하지 않아서 그냥 넘겨도 괜찮음
  const { data: post } = useQuery(postsQueries.detail(selectedProjectId));

  return (
    <section
      className={twMerge(
        clsx(
          "absolute z-20 transition-[max-height] flex flex-row items-start py-margin text-s text-white bg-black overflow-hidden after:content-[''] after:absolute after:inset-0 after:transition-colors",
          isMinimized
            ? "max-h-[5rem] duration-200 cursor-pointer after:block after:w-full after:h-full after:bg-black-fade hover:after:bg-black/50"
            : "max-h-full min-h-1/2 duration-100",
        ),
      )}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      <article className="w-full word-keep space-y-spacing-10">
        {(language === "ko" ? post?.content_ko : post?.content_en)?.map(
          (paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ),
        )}
      </article>
      <button
        type="button"
        aria-label="더보기"
        className="relative z-30 w-[4rem] h-[4rem] flex items-center justify-center cursor-pointer"
        onClick={!isMinimized ? () => setIsMinimized(true) : undefined}
      >
        <Image
          src="/icons/icon_scroll_top_arrow.svg"
          alt="더보기"
          width={40}
          height={40}
          className={clsx(
            "transition-transform duration-200 w-fit aspect-square pointer-events-none",
            isMinimized ? "rotate-0" : "rotate-180",
          )}
        />
      </button>
    </section>
  );
}
