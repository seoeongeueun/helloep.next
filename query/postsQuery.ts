import { getPosts } from "@/actions/posts";
import { getPostById } from "@/actions/post";
import { queryOptions } from "@tanstack/react-query";
import { POSTS_PER_PAGE } from "@/lib";

type FilterParams = {
  page?: number;
  search?: string | null;
  categoryId?: number | null;
  tagId?: number | null;
};

const postsKey = {
  all: ["posts"] as const,
  detail: (id: number) => [...postsKey.all, "detail", id] as const,
  filtered: (filters: FilterParams) => [...postsKey.all, "filtered", filters] as const,
};

/**
 * postsQueries 객체는 게시글 데이터를 가져오는 쿼리
 * - detail: ID로 단일 게시글을 가져오는 쿼리
 * - filtered: 검색어, 카테고리, 태그, 페이지를 조합한 필터링 쿼리 (모든 파라미터 optional)
 * placeholderData 옵션을 통해 페이지 전환 시 이전 데이터를 유지하도록 설정하여 사용자 경험을 개선합니다.
 */
export const postsQueries = {
  detail: (id: number | null) => {
    return queryOptions({
      queryKey: postsKey.detail(id!),
      queryFn: async () => getPostById(id!),
      enabled: !!id, // id가 유효한 경우에만 쿼리 실행
    });
  },
  filtered: (filters: FilterParams) => {
    const { page = 1, search, categoryId, tagId } = filters;
    return queryOptions({
      queryKey: postsKey.filtered(filters),
      queryFn: async () =>
        getPosts({
          page,
          perPage: POSTS_PER_PAGE,
          ...(search && { search }),
          ...(categoryId && { categoryId }),
          ...(tagId && { tagId }),
        }),
      placeholderData: (previousData) => previousData,
    });
  },
};
