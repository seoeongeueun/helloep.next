"use server";

import { ApiError, apiRequestWithHeaders } from "@/lib/apiRequest";
import {
  WP_BASE_URL,
  decodeHtmlEntities,
  extractEnglishTitle,
  POSTS_PER_PAGE,
} from "@/lib";
import { WPPost, PostListResponse } from "@/types";

//전체 응답 데이터 중 posts 필드만 추출하는 타입 정의
type WPApiResponse = {
  posts?: WPPost[];
  found?: number;
  [key: string]: unknown;
};

// 타입에 따라서 호출하는 기준이 다르기 때문에 별도의 optional 인터페이스로 정의
type GetPostsParams = {
  perPage?: number;
  page?: number;
  search?: string;
  categoryId?: number;
};

export async function getPosts(
  params: GetPostsParams = {},
): Promise<PostListResponse> {
  const { perPage = POSTS_PER_PAGE, page = 1, search, categoryId } = params;
  let data: WPApiResponse | WPPost[];
  let totalFromHeader: number | null = null;
  let totalPagesFromHeader: number | null = null;

  try {
    const query = new URLSearchParams({
      number: String(perPage),
      page: String(page),
    });

    if (search?.trim()) query.set("search", search.trim());
    if (typeof categoryId === "number")
      query.set("categories", String(categoryId));

    //검색어 검색 범위를 제목+클라이언트(excerpt) 제한
    //본문으로는 검색하지 않는다.
    const response = await apiRequestWithHeaders<WPApiResponse | WPPost[]>(
      `${WP_BASE_URL}/posts?${query.toString()}${search ? "&search_columns[]=post_title&search_columns[]=post_excerpt" : ""}`,
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
    title_en: decodeHtmlEntities(extractEnglishTitle(post.title.rendered)),
    title_ko: decodeHtmlEntities(post.title.rendered.split("ENG:")[0].trim()),
  }));

  // 헤더에서 totalCount와 totalPages를 추출하되, 유효한 숫자인지 확인
  if (typeof totalFromHeader === "number" && Number.isFinite(totalFromHeader)) {
    totalCount = totalFromHeader;
  }

  const fallbackTotalPages = Math.max(1, Math.ceil(totalCount / perPage));
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
