"use server";

import { ApiError, apiRequestWithHeaders } from "@/lib/apiRequest";
import { WP_BASE_URL, parseWpPostDetail } from "@/lib";
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

    return parseWpPostDetail(post);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
