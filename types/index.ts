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
  title_en?: string; // 기존 title에서 영문 제목을 추출해서 저장
  title_ko?: string; // 기존 title에서 영문을 제외한 부분
}

//기본 wpPost를 가공해서 렌더링할 포스트 타입
export type ParsedContent = {
  images: string[];
  content_ko: string[];
  content_en: string[];
};

//카테고리 및 태그 정보 (공용 사용)
export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export interface WPCategory extends WPTag {
  color?: string; //카테고리 description에서 받아올 색상 정보 추가
}

//posts의 pagination을 위해 posts 총 개수와 페이지 정보를 포함하도록 정의
export type PostListResponse = {
  posts: WPPost[];
  totalCount: number;
  totalPages: number;
};

//CV 페이지의 테이블 섹션 타입 정의
type TableSectionItem = { year: string; label: string };
export type TableSection = { title: string; items: TableSectionItem[] };

//목록 뷰 타입
export type ViewMode = "grid" | "list";

//언어 선택
export type LanguageMode = "ko" | "en";

//페이지 종류
export type SidebarSlug = "cv" | "contact" | "client";
