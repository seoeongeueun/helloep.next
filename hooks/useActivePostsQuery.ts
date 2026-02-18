"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { postsQueries, tagsQueries } from "@/query";
import { categoriesQueries } from "@/query";
import type { PostListResponse } from "@/types";

// 현재 URL의 검색 파라미터에 따라 활성화된 게시물 쿼리를 반환하는 커스텀 훅
export function useActivePostsQuery() {
  const searchParams = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  // URL 파라미터에서 search와 category 가져오기
  const searchParam = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  const yearParam = searchParams.get("year");

  // url의 카테고리 params를 텍스트로 유지하기 위해서 query를 보내기 전에 카테고리 명으로 id를 찾아서 보내는 과정을 거친다
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery(
    categoriesQueries.all(),
  );
  // 태그도 마찬가지
  const { data: tags = [], isLoading: isTagsLoading } = useQuery(
    tagsQueries.all(),
  );

  const activeCategoryId =
    categories.find(
      (cat) => cat.name.toLowerCase() === categoryParam?.toLowerCase(),
    )?.id ?? null;

  const activeTagId =
    tags.find((tag) => tag.name.toLowerCase() === yearParam?.toLowerCase())
      ?.id ?? null;

  // categoryParam이나 yearParam이 있으면 해당 데이터 로딩을 기다린다
  const shouldEnableQuery =
    (!categoryParam || !isCategoriesLoading) && (!yearParam || !isTagsLoading);

  // 모든 필터링 조건을 단일 객체로 통합하여 단순화
  const query = postsQueries.filtered({
    page: currentPage,
    search: searchParam,
    categoryId: activeCategoryId,
    tagId: activeTagId,
  }) as UseQueryOptions<
    PostListResponse,
    Error,
    PostListResponse,
    readonly unknown[]
  >;

  const postsQuery = {
    ...query,
    enabled: shouldEnableQuery,
  };

  return { postsQuery, activeCategoryId, activeTagId };
}
