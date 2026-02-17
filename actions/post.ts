"use server";

import { ApiError, apiRequestWithHeaders } from "@/lib/apiRequest";
import {
  WP_BASE_URL,
  decodeHtmlEntities,
  extractEnglishTitle,
  parseWpContent,
} from "@/lib";
import { WPPost, ParsedContent } from "@/types";

//id로 단일 포스트 조회
export async function getPostById(
  id: number,
): Promise<(WPPost & ParsedContent) | null> {
  try {
    const response = await apiRequestWithHeaders<WPPost>(
      `${WP_BASE_URL}/posts/${id}`,
    );

    const post = response.data;

    const parsed = parseWpContent(post.content.rendered);

    // HTML 엔티티 디코딩 및 한글/영문 제목 분리
    return {
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

      images: parsed.images,
      content_ko: parsed.content_ko,
      content_en: parsed.content_en,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
