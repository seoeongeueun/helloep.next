"use server";

import { ApiError, apiRequestWithHeaders } from "@/lib/apiRequest";
import { WP_BASE_URL, decodeHtmlEntities, extractEnglishTitle } from "@/lib";
import { WPPost, PostListResponse } from "@/types";

//전체 응답 데이터 중 posts 필드만 추출하는 타입 정의
type WPApiResponse = {
  posts?: WPPost[];
  found?: number;
  [key: string]: unknown;
};

export async function getPosts(
  number: number = 10,
  page: number = 1,
): Promise<PostListResponse> {
  let data: WPApiResponse | WPPost[];
  let totalFromHeader: number | null = null;
  let totalPagesFromHeader: number | null = null;

  try {
    const response = await apiRequestWithHeaders<WPApiResponse | WPPost[]>(
      `${WP_BASE_URL}/posts?number=${number}&page=${page}`,
    );
    data = response.data;

    const totalHeader = response.headers.get("X-WP-Total");
    const totalPagesHeader = response.headers.get("X-WP-TotalPages");

    totalFromHeader = totalHeader ? Number(totalHeader) : null;
    totalPagesFromHeader = totalPagesHeader ? Number(totalPagesHeader) : null;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return {
        posts: [],
        totalCount: 0,
        totalPages: 1,
      };
    }

    throw error;
  }

  let posts: WPPost[] = [];
  let totalCount = 0;

  // 응답이 배열인 경우
  if (Array.isArray(data)) {
    posts = data;
    totalCount = data.length;
  }
  // 응답이 객체이고 posts 필드가 있는 경우
  else if (data.posts) {
    posts = data.posts;
    totalCount =
      typeof data.found === "number" ? data.found : data.posts.length;
  }

  // HTML 엔티티 디코딩 반환
  posts = posts.map((post) => ({
    ...post,
    title: {
      rendered: decodeHtmlEntities(post.title.rendered),
    },
    content: {
      rendered: decodeHtmlEntities(post.content.rendered),
    },
    excerpt: {
      rendered: decodeHtmlEntities(post.excerpt.rendered),
    },
    title_en: extractEnglishTitle(post.title.rendered),
    title_ko: decodeHtmlEntities(post.title.rendered.split("ENG:")[0].trim()),
  }));

  // 헤더에서 totalCount와 totalPages를 추출하되, 유효한 숫자인지 확인
  if (typeof totalFromHeader === "number" && Number.isFinite(totalFromHeader)) {
    totalCount = totalFromHeader;
  }

  const fallbackTotalPages = Math.max(1, Math.ceil(totalCount / number));
  const totalPages =
    typeof totalPagesFromHeader === "number" &&
    Number.isFinite(totalPagesFromHeader)
      ? Math.max(1, totalPagesFromHeader)
      : fallbackTotalPages;

  return {
    posts,
    totalCount,
    totalPages,
  };
}
