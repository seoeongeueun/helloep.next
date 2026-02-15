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
  jetpack_featured_media_url: string;
}
