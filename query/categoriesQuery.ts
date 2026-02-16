import { getCategories } from "@/actions";
import { queryOptions } from "@tanstack/react-query";

const categoriesKey = {
  all: ["categories"] as const,
};

export const categoriesQueries = {
  all: () =>
    queryOptions({
      queryKey: categoriesKey.all,
      queryFn: async () => getCategories(),
      staleTime: 1000 * 60 * 60 * 3, // 자주 변경되지 않는 데이터이므로 3시간으로 설정
      gcTime: 1000 * 60 * 60 * 24, // 24시간 후에 캐시에서 제거
    }),
};
