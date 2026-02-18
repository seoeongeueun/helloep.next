"use client";
import { useSidebar } from "@/context/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { twMerge } from "tailwind-merge";
import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import { usePathname } from "next/navigation";

//csr버전 사이드바 (모바일용)
export default function SideBarMobile() {
  const { isOpen } = useSidebar();
  const { activeSlug, selectedProjectId } = useAppState();
  const pathname = usePathname();

  const { data: pageData } = useQuery(
    pagesQueries.bySlug(activeSlug ?? "contact"),
  );

  const isDetailPage = /^\/\d+$/.test(pathname ?? "");

  return (
    <aside
      className={twMerge(
        "block desktop:hidden fixed left-0 bottom-0 w-[calc(100%-4rem)] h-[calc(100%-var(--headerH))] border-r border-gray desktop:w-[29%] z-50 bg-black",
        "transition-transform duration-500",
        isDetailPage && "translate-y-0", // 디테일 페이지: 항상 보임
        selectedProjectId && isOpen && "translate-y-0", // 프로젝트 모드 열림 (상하)
        selectedProjectId && !isOpen && "translate-y-full", // 프로젝트 모드 닫힘 (상하)
        !selectedProjectId && isOpen && "translate-x-0", // 일반 페이지 열림 (좌우)
        !selectedProjectId && !isOpen && !isDetailPage && "-translate-x-full", // 일반 페이지 닫힘 (좌우)
        selectedProjectId && "w-full",
        !isDetailPage && "h-full",
      )}
    >
      {!selectedProjectId && <SideBarHeader />}
      <SideBarContent data={pageData} />
    </aside>
  );
}
