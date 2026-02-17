import type { DefaultOptions } from "@tanstack/react-query";

export const WP_BASE_URL = `https://public-api.wordpress.com/wp/v2/sites/${process.env.NEXT_PUBLIC_WP_SITE}`;

// queryclient 기본 캐싱타임 설정
export const QUERY_CLIENT_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000 * 30, // 30분
    gcTime: 60 * 1000 * 60 * 2, // 2시간
    refetchOnWindowFocus: false,
    retry: 1,
  },
};
