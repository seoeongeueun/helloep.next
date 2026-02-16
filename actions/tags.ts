import { WPTag } from "@/types";
import { apiRequest, WP_BASE_URL } from "@/lib";

// 기본 tags 데이터는 태그 id만 반환하기 때문에, 태그 정보를 미리 가져와서 id로 매핑할 수 있도록 해야함
export async function getTags(): Promise<WPTag[]> {
  const tags = await apiRequest<WPTag[]>(`${WP_BASE_URL}/tags`);

  return tags;
}
