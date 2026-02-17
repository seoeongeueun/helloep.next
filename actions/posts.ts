"use server";

import { apiRequest } from "@/lib/apiRequest";
import { WP_BASE_URL, decodeHtmlEntities, extractEnglishTitle } from "@/lib";
import { WPPost } from "@/types";

//전체 응답 데이터 중 posts 필드만 추출하는 타입 정의
type WPApiResponse = {
  posts?: WPPost[];
  found?: number;
  [key: string]: unknown;
};

export async function getPosts(
  number: number = 10,
  page: number = 1,
): Promise<WPPost[]> {
  const data = await apiRequest<WPApiResponse | WPPost[]>(
    `${WP_BASE_URL}/posts?number=${number}&page=${page}`,
  );

  let posts: WPPost[] = [];

  // 응답이 배열인 경우
  if (Array.isArray(data)) {
    posts = data;
  }
  // 응답이 객체이고 posts 필드가 있는 경우
  else if (data.posts) {
    posts = data.posts;
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
  }));

  return posts;
}
