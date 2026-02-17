"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { postsQueries } from "@/query";
import { categoriesQueries } from "@/query";
import type { PostListResponse } from "@/types";

// 현재 URL의 검색 파라미터에 따라 활성화된 게시물 쿼리를 반환하는 커스텀 훅
export function useActivePostsQuery() {
  const searchParams = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  // url의 카테고리 params를 텍스트로 유지하기 위해서 query를 보내기 전에 카테고리 명으로 id를 찾아서 보내는 과정을 거친다
  const categoryParam = searchParams.get("category");
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery(
    categoriesQueries.all(),
  );

  const activeCategoryId =
    categories.find(
      (cat) => cat.name.toLowerCase() === categoryParam?.toLowerCase(),
    )?.id ?? null;

  // categoryParam이 있는데 categories가 아직 로드 중이면 쿼리를 비활성화
  const shouldEnableQuery = !categoryParam || !isCategoriesLoading;

  // postsQuery는 현재 페이지와 선택된 카테고리에 따라 적절한 쿼리를 선택
  const postsQuery = useMemo(() => {
    const query =
      activeCategoryId === null
        ? postsQueries.list(currentPage)
        : postsQueries.category(activeCategoryId, currentPage);

    return {
      ...query,
      enabled: shouldEnableQuery,
    } as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  }, [currentPage, activeCategoryId, shouldEnableQuery]);

  return { postsQuery, activeCategoryId };
}
