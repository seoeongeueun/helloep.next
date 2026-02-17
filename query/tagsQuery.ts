import { getTags } from "@/actions";
import { queryOptions } from "@tanstack/react-query";

const tagsKey = {
  all: ["tags"] as const,
};

export const tagsQueries = {
  all: () =>
    queryOptions({
      queryKey: tagsKey.all,
      queryFn: async () => getTags(),
      staleTime: 1000 * 60 * 60 * 3, // 자주 변경되지 않는 데이터이므로 3시간으로 설정
      gcTime: 1000 * 60 * 60 * 24, // 24시간 후에 캐시에서 제거
    }),
};
