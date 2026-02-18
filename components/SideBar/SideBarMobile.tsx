"use client";
import { useSidebar } from "@/context/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { twMerge } from "tailwind-merge";
import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";

//csr버전 사이드바 (모바일용)
export default function SideBarMobile() {
  const { isOpen } = useSidebar();
  const { activeSlug, selectedProjectId } = useAppState();

  const { data: pageData } = useQuery(
    pagesQueries.bySlug(activeSlug ?? "contact"),
  );

  // 모바일용 상황별 다른 애니메이션 추가
  const animationClass = `animate-slide${isOpen ? "In" : "Out"}${selectedProjectId ? "Vertical" : "Horizontal"}`;

  return (
    <aside
      className={twMerge(
        "block desktop:hidden fixed left-0 bottom-0 w-[calc(100%-4rem)] h-[calc(100%-var(--headerH))] border-r border-gray desktop:w-[29%] z-50 bg-black",
        animationClass,
        selectedProjectId && "w-full ",
      )}
    >
      {!selectedProjectId && <SideBarHeader />}
      <SideBarContent data={pageData} />
    </aside>
  );
}
