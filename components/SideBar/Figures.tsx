"use client";
import { useAppState } from "@/context/AppStateContext";
import { useQuery } from "@tanstack/react-query";
import { postsQueries, tagsQueries, categoriesQueries } from "@/query";
import { useMemo } from "react";
import { Tag } from "@/ui";
import Image from "next/image";
import type { WPPost, ParsedContent } from "@/types";
import clsx from "clsx";

//optional initialData
interface FiguresProps {
  initialData?: WPPost & ParsedContent;
}

export default function Figures({ initialData }: FiguresProps) {
  const { selectedProjectId, language } = useAppState();
  const { data: post } = useQuery({
    ...postsQueries.detail(selectedProjectId ?? 0),
    enabled: !!selectedProjectId,
    initialData,
  });
  const { data: tags } = useQuery(tagsQueries.all());
  const { data: categories } = useQuery(categoriesQueries.all());

  //초기 데이터가 있는 경우 상세페이지기 때문에 조금 다른 css를 부여한다
  const isDetailPage = !!initialData;

  const currentPost = post || initialData;
  const content =
    language === "ko" ||
    !currentPost?.content_en ||
    currentPost.content_en.length === 0
      ? currentPost?.content_ko
      : currentPost?.content_en;

  const tagName = useMemo(() => {
    if (!tags || !currentPost?.tags?.length) return "";
    return tags.find((t) => t.id === currentPost.tags[0])?.name ?? "";
  }, [tags, currentPost]);

  const categoryInfos = useMemo(() => {
    if (!categories || !currentPost?.categories) return [];

    return currentPost.categories.map((catId) =>
      categories.find((cat) => cat.id === catId),
    );
  }, [categories, currentPost]);

  return (
    <section
      className={clsx(
        "flex flex-col w-full h-full overflow-y-auto px-margin pb-margin",
        {
          "p-margin": isDetailPage,
        },
      )}
    >
      <header className="flex flex-row items-start justify-between gap-spacing-10 py-margin">
        <h2 className="text-[2.5rem] border-none! w-full ">
          {language === "ko"
            ? currentPost?.title_ko
            : currentPost?.title_en || currentPost?.title.rendered}
        </h2>
        <time className={clsx("h-[2.3rem]", { "ml-auto": isDetailPage })}>
          {tagName}
        </time>
        <ul className="flex flex-col gap-spacing-3 w-fit">
          {categoryInfos.map((cat, i) => (
            <Tag key={i} color={cat?.color || ""} label={cat?.name || ""} />
          ))}
        </ul>
      </header>
      <article className="space-y-spacing-10 word-keep w-full">
        {currentPost?.images?.map((src, i) => (
          <figure key={i} className="w-full">
            <Image
              src={src}
              alt={`figure-${i}`}
              className="w-full h-auto"
              width={2000}
              height={1000}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 2000px"
            />
          </figure>
        ))}
        <div className="inline-block desktop:hidden desktop:w-0 w-full word-keep space-y-spacing-10">
          {content?.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}
