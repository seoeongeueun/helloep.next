"use client";
import Caption from "./Caption";
import Figures from "./Figures";
import { useAppState } from "@/context/AppStateContext";
import StaticPageContent from "./StaticPageContent";
import { SidebarSlug, WPPage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";

type SideBarContentProps = {
  data?: WPPage;
};
// 초기 서버 데이터가 있으면 -> ssr로 contact 정보 노출
// projectid가 있으면 -> 프로젝트 정보를 노출
// 다 없으면 query로 activeSlug에 맞는 정보 노출
export default function SideBarContent({ data }: SideBarContentProps) {
  const { selectedProjectId, activeSlug } = useAppState();

  // activeSlug가 바뀔 때마다 새로운 데이터 가져오기
  const currentSlug = activeSlug || "contact";
  const { data: pageData } = useQuery({
    ...pagesQueries.bySlug(currentSlug),
    enabled: !selectedProjectId, // selectedProjectId가 없을 때만 실행
    initialData: data && data.slug === currentSlug ? data : undefined, // slug가 같을 때만 초기 데이터 사용
  });

  // selectedProjectId가 있으면 선택된 프로젝트, 없으면 기본 정적 페이지 데이터 표시
  if (selectedProjectId) {
    return (
      <>
        <Figures />
        <Caption />
      </>
    );
  }

  // 페이지 데이터가 없으면 null 반환
  if (!pageData) {
    return null;
  }

  // 정적 페이지 컨텐츠 표시
  return (
    <StaticPageContent data={pageData} slug={currentSlug as SidebarSlug} />
  );
}
