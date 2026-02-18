"use client";
import { useSidebar } from "@/context/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { twMerge } from "tailwind-merge";
import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

//csr버전 사이드바 (모바일용)
export default function SideBarMobile() {
  const { isOpen, openSidebar, closeSidebar, isMobile } = useSidebar();
  const { activeSlug } = useAppState();
  const pathname = usePathname();
  const isDetailPage = /^\/\d+$/.test(pathname ?? "");

  const { data: pageData } = useQuery(
    pagesQueries.bySlug(activeSlug ?? "contact"),
  );

  // 페이지별 사이드바 상태 관리
  useEffect(() => {
    if (isDetailPage) {
      openSidebar(); // 상세페이지에서 열기
    } else {
      closeSidebar(); // 홈페이지에서 닫기
    }
  }, [pathname]);

  return (
    <aside
      className={twMerge(
        "block desktop:hidden fixed left-0 bottom-0 w-[calc(100%-4rem)] h-[calc(100%-var(--headerH))] border-r border-gray desktop:w-[29%] z-50 bg-black",
        isOpen ? "animate-slideInHorizontal" : "animate-slideOutHorizontal",
        isDetailPage ? "w-full" : "h-full",
      )}
    >
      {!isDetailPage && <SideBarHeader />}
      <SideBarContent data={pageData} />
    </aside>
  );
}
