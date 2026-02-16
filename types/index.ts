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
export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export interface WPCategory extends WPTag {
  color?: string; //카테고리 description에서 받아올 색상 정보 추가
}

//목록 뷰 타입
export type ViewMode = "grid" | "list";
