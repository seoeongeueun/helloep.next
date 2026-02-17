"use client";
import { useAppState } from "@/context/AppStateContext";
import { useQuery } from "@tanstack/react-query";
import { postsQueries, tagsQueries, categoriesQueries } from "@/query";
import { useMemo } from "react";
import { Tag } from "@/ui";
import Image from "next/image";

export default function Figures() {
  const { selectedProjectId, language } = useAppState();
  const { data: post } = useQuery({
    ...postsQueries.detail(selectedProjectId ?? 0),
    enabled: !!selectedProjectId,
  });
  const { data: tags } = useQuery(tagsQueries.all());
  const { data: categories } = useQuery(categoriesQueries.all());

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
    <section className="flex flex-col w-full h-full overflow-y-auto">
      <header className="flex flex-row items-start justify-between gap-spacing-10 py-margin pt-0">
        <h2 className="text-[2.5rem] border-none! w-full">
          {language === "ko"
            ? post?.title_ko
            : post?.title_en || post?.title.rendered}
        </h2>
        <time className="h-[2.3rem]">{tagName}</time>
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </figure>
        ))}
      </article>
    </section>
  );
}
