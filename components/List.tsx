"use client";

import { WPPost } from "@/types";
import { stripHtmlTags } from "@/lib";
import { Tag } from "@/ui";
import { categoriesQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";
import { tagsQueries } from "@/query";
import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";

interface CardProps {
  post: WPPost;
}

//TODO: 카테고리 ID를 실제 카테고리 이름과 매핑하는 로직 필요
export default function List({ post }: CardProps) {
  const { data: categories } = useQuery(categoriesQueries.all());
  const { data: tags } = useQuery(tagsQueries.all());
  const { setSelectedProjectId, language } = useAppState();

  // post의 카테고리 id로 카테고리 데이터를 찾아서 카테고리 배열을 재생성
  const categoryInfos = useMemo(() => {
    if (!categories || !post.categories) return [];

    return post.categories.map((catId) =>
      categories.find((cat) => cat.id === catId),
    );
  }, [categories, post.categories]);

  //혼용 주의 (TODO: 명칭 수정 고려) - tag는 연도 정보를 가지고 있다
  const tagName = useMemo(() => {
    if (!tags || !post.tags?.length) return "";

    //tag는 연도 정보로 사용하고 있기 때문에 배열이어도 첫 번째 값만 사용하고 그 외는 오류로 간주
    return tags.find((t) => t.id === post.tags[0])?.name ?? "";
  }, [tags, post.tags]);

  return (
    <article
      className="w-full flex flex-row items-start justify-between gap-spacing-10 hover:bg-secondary border-b border-gray transtion-colors duration-200 cursor-pointer py-spacing-6"
      onClick={() => setSelectedProjectId(post.id)}
    >
      <div className="flex flex-wrap w-1/2 items-center h-full gap-x-spacing-10">
        <h3 className="border-none!">
          {language === "ko"
            ? post.title_ko
            : post.title_en || post.title.rendered}
        </h3>
        <div className="flex items-center gap-spacing-3 h-[2.3rem]">
          {categoryInfos.map((cat, i) => (
            <Tag key={i} color={cat?.color || ""} label={cat?.name || ""} />
          ))}
        </div>
      </div>
      <div className="w-1/2 flex flex-row gap-spacing-10 *:w-full">
        <time>{tagName}</time>
        <p className="break-keep">{stripHtmlTags(post.excerpt.rendered)}</p>
      </div>
    </article>
  );
}
