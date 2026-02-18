"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { postsQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function Caption() {
  const [size, setSize] = useState<0 | 1 | 2>(0); // 0: minimized, 1: expanded, 2: full screen
  const { selectedProjectId, language } = useAppState();

  //쿼리 내부에서 enabled로 id가 없으면 쿼리를 실행하지 않아서 그냥 넘겨도 괜찮음
  const { data: post } = useQuery(postsQueries.detail(selectedProjectId));

  const pathname = usePathname();
  const isDetailPage = /^\/\d+$/.test(pathname ?? "");

  useEffect(() => {
    if (isDetailPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSize(2);
    } else if (size === 2) {
      setSize(0); // 디테일 페이지에서 벗어나면 기본으로
    }
  }, [pathname, isDetailPage, size]);

  if (!post || !post.content_ko) return null;

  const content =
    language === "ko" || !post?.content_en || post.content_en.length === 0
      ? post.content_ko
      : post.content_en;

  return (
    <section
      className={twMerge(
        clsx(
          "absolute bottom-0 z-20 transition-[max-height] duration-1000 flex flex-row items-start py-margin text-s text-white bg-black overflow-hidden",
          "after:content-[''] after:absolute after:inset-0 after:transition-colors",
          {
            "max-h-[5rem] duration-200 cursor-pointer after:block after:w-full after:h-full after:bg-black-fade hover:after:bg-black/50":
              size === 0,
          },
          {
            "max-h-96 min-h-1/2 duration-100": size === 1,
          },
          {
            "max-h-full h-full duration-100": size === 2,
          },
        ),
      )}
      onClick={size === 0 ? () => setSize(1) : undefined}
    >
      <article className="w-full word-keep space-y-spacing-10">
        {content.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </article>
      {size !== 2 && (
        <button
          type="button"
          aria-label="더보기"
          className="relative z-30 w-[4rem] h-[4rem] flex items-center justify-center cursor-pointer"
          onClick={size === 1 ? () => setSize(0) : undefined}
        >
          <Image
            src="/icons/icon_scroll_top_arrow.svg"
            alt="더보기"
            width={40}
            height={40}
            className={clsx(
              "transition-transform duration-200 w-fit aspect-square pointer-events-none",
              size === 0 ? "rotate-0" : "rotate-180",
            )}
          />
        </button>
      )}
    </section>
  );
}
