"use client";
import { useAppState } from "@/context/AppStateContext";
import { useQuery } from "@tanstack/react-query";
import { postsQueries, tagsQueries, categoriesQueries } from "@/query";
import { useMemo, useEffect } from "react";
import { Tag } from "@/ui";
import Image from "next/image";
import type { WPPost, ParsedContent } from "@/types";
import clsx from "clsx";

//optional initialData
interface FiguresProps {
  initialData?: WPPost & ParsedContent;
}

export default function Figures({ initialData }: FiguresProps) {
  const { selectedProjectId, language, selectProject } = useAppState();
  const { data: post } = useQuery({
    ...postsQueries.detail(selectedProjectId ?? 0),
    enabled: !!selectedProjectId,
    initialData,
  });
  const { data: tags } = useQuery(tagsQueries.all());
  const { data: categories } = useQuery(categoriesQueries.all());

  //초기 데이터가 있는 경우 상세페이지기 때문에 조금 다른 css를 부여한다
  const isDetailPage = !!initialData;

  const tagName = useMemo(() => {
    if (!tags || !post?.tags?.length) return "";
    return tags.find((t) => t.id === post.tags[0])?.name ?? "";
  }, [tags, post]);

  const categoryInfos = useMemo(() => {
    if (!categories || !post?.categories) return [];

    return post.categories.map((catId) =>
      categories.find((cat) => cat.id === catId),
    );
  }, [categories, post]);

  return (
    <section
      className={clsx("flex flex-col w-full h-full overflow-y-auto", {
        "p-margin": isDetailPage,
      })}
    >
      <header className="flex flex-row items-start justify-between gap-spacing-10 py-margin pt-0">
        <h2 className="text-[2.5rem] border-none! w-full">
          {language === "ko"
            ? post?.title_ko
            : post?.title_en || post?.title.rendered}
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
      <article className="space-y-spacing-10">
        {post?.images.map((src, i) => (
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
      </article>
    </section>
  );
}
