"use client";
import { ExpandButton } from "@/ui";
import Content from "./Content";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import type { SidebarSlug } from "@/types";

//TODO: 페이지 데이터 타입 정의 필요 (현재는 unknown으로 처리)
type SideBarClientProps = {
  defaultData?: unknown;
  defaultSlug?: SidebarSlug;
};

export default function SideBarClient({
  defaultData,
  defaultSlug = "cv",
}: SideBarClientProps) {
  const { activeSlug, selectPage } = useAppState();
  const isPageMode = activeSlug !== null;
  const slugForQuery = activeSlug ?? defaultSlug;

  // prop으로 받은 데이터를 일단 초기 데이터로 설정, activeSlug이 변경되면 해당 슬러그에 맞는 데이터를 새로 패칭
  const { data: pageData } = useQuery({
    ...pagesQueries.bySlug(slugForQuery),
    enabled: isPageMode,
    initialData:
      isPageMode && slugForQuery === defaultSlug ? defaultData : undefined,
  });

  const handleSelect = (slug: SidebarSlug) => {
    selectPage(slug);
  };

  return (
    <>
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <ExpandButton />
        <button
          type="button"
          aria-label="Contact"
          className={activeSlug === "contact" ? "active" : undefined}
          onClick={() => handleSelect("contact")}
        >
          Contact
        </button>
        <button
          type="button"
          aria-label="CV"
          className={activeSlug === "cv" ? "active" : undefined}
          onClick={() => handleSelect("cv")}
        >
          CV
        </button>
        <button
          type="button"
          aria-label="Client"
          className={activeSlug === "client" ? "active" : undefined}
          onClick={() => handleSelect("client")}
        >
          Client
        </button>
      </header>
      <section className="relative flex flex-col justify-start gap-12 p-margin h-[calc(100%-var(--headerH))] overflow-hidden">
        <Content defaultData={pageData} />
      </section>
    </>
  );
}
