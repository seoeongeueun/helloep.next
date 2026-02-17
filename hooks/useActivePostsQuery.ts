"use client";

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

  // URL 파라미터에서 search와 category 가져오기
  const searchParam = searchParams.get("search");
  const categoryParam = searchParams.get("category");

  // url의 카테고리 params를 텍스트로 유지하기 위해서 query를 보내기 전에 카테고리 명으로 id를 찾아서 보내는 과정을 거친다
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery(
    categoriesQueries.all(),
  );

  const activeCategoryId =
    categories.find(
      (cat) => cat.name.toLowerCase() === categoryParam?.toLowerCase(),
    )?.id ?? null;

  // categoryParam이 있으면 categories 로딩을 기다린다
  const shouldEnableQuery = !categoryParam || !isCategoriesLoading;

  // postsQuery는 현재 페이지와 선택된 카테고리/검색어에 따라 적절한 쿼리를 선택
  let query: UseQueryOptions<
    PostListResponse,
    Error,
    PostListResponse,
    readonly unknown[]
  >;

  /**
   * 주어진 params에 따라 어떤 쿼리가 활성화되어야 하는지 결정하는 로직
   * - search 검색어 + 카테고리 선택: 검색 + 카테고리 필터링 쿼리
   * - search 검색어만 있는 경우: 검색 쿼리
   * - 카테고리 선택만 있는 경우: 카테고리 필터링 쿼리
   * - 둘 다 없는 경우: 기본 게시물 목록 쿼리
   */
  if (searchParam && activeCategoryId !== null) {
    query = postsQueries.searchCategory(
      searchParam,
      activeCategoryId,
      currentPage,
    ) as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  } else if (searchParam) {
    query = postsQueries.search(searchParam, currentPage) as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  } else if (activeCategoryId !== null) {
    query = postsQueries.category(
      activeCategoryId,
      currentPage,
    ) as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  } else {
    query = postsQueries.list(currentPage) as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  }

  const postsQuery = {
    ...query,
    enabled: shouldEnableQuery,
  };

  return { postsQuery, activeCategoryId };
}
