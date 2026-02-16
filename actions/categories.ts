import { WPCategory } from "@/types";
import { apiRequest } from "@/lib";

// 기본 post 데이터는 카테고리 id만 반환하기 때문에, 카테고리 정보를 미리 가져와서 id로 매핑할 수 있도록 해야함
export async function getCategories(): Promise<WPCategory[]> {
  const categories = await apiRequest<WPCategory[]>("/categories");

  return categories;
}
