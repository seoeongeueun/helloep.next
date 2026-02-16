//wp public api에서 반환되는 응답 데이터 중 사용할 필드만 정의
export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  categories: number[];
  tags: number[];
  jetpack_featured_media_url: string;
}

//카테고리 및 태그 정보 (공용 사용)
export interface WPCategoryAndTag {
  id: number;
  name: string;
  slug: string;
}

//목록 뷰 타입
export type ViewMode = "grid" | "list";
