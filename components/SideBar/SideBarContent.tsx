"use client";
import Caption from "./Caption";
import Figures from "./Figures";
import { useAppState } from "@/context/AppStateContext";
import StaticPageContent from "./StaticPageContent";
import { SidebarSlug, WPPage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "next/navigation";

type SideBarContentProps = {
  data?: WPPage;
};
// 초기 서버 데이터가 있으면 -> ssr로 contact 정보 노출
// projectid가 있으면 -> 프로젝트 정보를 노출
// 다 없으면 query로 activeSlug에 맞는 정보 노출
export default function SideBarContent({ data }: SideBarContentProps) {
  const { selectedProjectId, activeSlug } = useAppState();
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  // activeSlug가 바뀔 때마다 새로운 데이터 가져오기
  const currentSlug = activeSlug || "contact";
  const { data: pageData } = useQuery({
    ...pagesQueries.bySlug(currentSlug),
    enabled: !selectedProjectId, // selectedProjectId가 없을 때만 실행
    initialData: data && data.slug === currentSlug ? data : undefined, // slug가 같을 때만 초기 데이터 사용
  });

  //모바일인 경우 상세페이지로 이동한 경우에만 프로젝트 정보를 노출한다
  const isProjectPage = isMobile && /^\/\d+$/.test(pathname ?? "");

  // selectedProjectId가 있고 데스크톱 or 모바일에서 프로젝트 페이지일 때 프로젝트 정보 표시
  if (selectedProjectId && (!isMobile || isProjectPage)) {
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
