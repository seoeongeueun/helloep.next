import { getPosts } from "@/actions/posts";
import { queryOptions } from "@tanstack/react-query";

const postsKey = {
  all: ["posts"] as const,
  list: (page: number, perPage: number) =>
    [...postsKey.all, "list", { page, perPage }] as const,
};

// 더미데이터의 양을 고려해서 디폴트로 10개씩 가져오도록 설정
export const postsQueries = {
  list: (page: number = 1, perPage: number = 10) =>
    queryOptions({
      queryKey: postsKey.list(page, perPage),
      queryFn: async () => getPosts(perPage, page),
      placeholderData: (previousData) => previousData, // 페이지 전환 시 이전 데이터 유지
    }),
};
