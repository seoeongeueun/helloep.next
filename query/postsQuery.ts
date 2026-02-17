import { getPosts } from "@/actions/posts";
import { queryOptions } from "@tanstack/react-query";
import { POSTS_PER_PAGE } from "@/lib";

const postsKey = {
  all: ["posts"] as const,
  list: (page?: number) =>
    [...postsKey.all, "list", { page: page ?? 1 }] as const,
  search: (query: string, page?: number) =>
    [...postsKey.all, "search", { page: page ?? 1, query }] as const,
  category: (categoryId: number, page?: number) =>
    [...postsKey.all, "category", { page: page ?? 1, categoryId }] as const,
};

/**
 * postsQueries 객체는 게시글 데이터를 가져오는 쿼리
 * page 번호는 값이 없는 경우 1로 간주
 * - list: 페이지 번호를 기반으로 게시글 목록을 가져오는 쿼리
 * - search: 검색어와 페이지 번호를 기반으로 게시글 목록을 가져오는 쿼리
 * - category: 카테고리 id와 페이지 번호를 기반으로 게시글 목록을 가져오는 쿼리
 * placeholderData 옵션을 통해 페이지 전환 시 이전 데이터를 유지하도록 설정하여 사용자 경험을 개선합니다.
 */
export const postsQueries = {
  list: (page?: number) => {
    return queryOptions({
      queryKey: postsKey.list(page ?? 1),
      queryFn: async () =>
        getPosts({ page: page ?? 1, perPage: POSTS_PER_PAGE }),
      placeholderData: (previousData) => previousData, // 페이지 전환 시 이전 데이터 유지
    });
  },
  search: (query: string, page?: number) => {
    return queryOptions({
      queryKey: postsKey.search(query, page ?? 1),
      queryFn: async () =>
        getPosts({ page: page ?? 1, perPage: POSTS_PER_PAGE, search: query }),
      placeholderData: (previousData) => previousData,
    });
  },
  category: (categoryId: number, page?: number) => {
    return queryOptions({
      queryKey: postsKey.category(categoryId, page ?? 1),
      queryFn: async () =>
        getPosts({
          page: page ?? 1,
          perPage: POSTS_PER_PAGE,
          categoryId,
        }),
      placeholderData: (previousData) => previousData,
    });
  },
};
