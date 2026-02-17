"use server";

import { ApiError, apiRequestWithHeaders } from "@/lib/apiRequest";
import { WP_BASE_URL, parseWpTableSections } from "@/lib";
import { WPPage, SidebarSlug } from "@/types";

// slug을 기준으로 페이지 데이터를 가져오는 함수
export async function getPages({
  slug,
}: {
  slug: SidebarSlug;
}): Promise<unknown> {
  try {
    const response = await apiRequestWithHeaders<WPPage[]>(
      `${WP_BASE_URL}/pages?slug=${slug}`,
    );

    const page = response.data[0]; // slug는 고유하므로 첫 번째 요소를 사용

    //cv나 contact 페이지인 경우 테이블 섹션을 파싱하여 추가 정보로 활용
    if (
      (slug.toLowerCase() === "cv" || slug.toLowerCase() === "contact") &&
      response.data.length > 0
    ) {
      page.tableSections = parseWpTableSections(page.content.rendered);
    }

    return page;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      // 페이지가 없거나 잘못된 요청인 경우 빈 배열 반환
      return [];
    }
    // 그 외의 에러는 상위로 던져서 처리
    throw error;
  }
}
