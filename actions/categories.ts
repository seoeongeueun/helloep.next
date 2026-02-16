import { WPCategoryAndTag } from "@/types";
import { apiRequest, WP_BASE_URL } from "@/lib";

// 기본 post 데이터는 카테고리 id만 반환하기 때문에, 카테고리 정보를 미리 가져와서 id로 매핑할 수 있도록 해야함
export async function getCategories(): Promise<WPCategoryAndTag[]> {
  const categories = await apiRequest<WPCategoryAndTag[]>(
    `${WP_BASE_URL}/categories`,
  );

  return categories;
}
