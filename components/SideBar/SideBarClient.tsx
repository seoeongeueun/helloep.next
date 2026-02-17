"use client";

import { useState } from "react";
import { getPages } from "@/actions";
import { ExpandButton } from "@/ui";
import Content from "./Content";

type SidebarSlug = "cv" | "contact" | "client";

//TODO: 페이지 데이터 타입 정의 필요 (현재는 unknown으로 처리)
type SideBarClientProps = {
  defaultData?: unknown;
  defaultSlug?: SidebarSlug;
};

export default function SideBarClient({
  defaultData,
  defaultSlug = "cv",
}: SideBarClientProps) {
  const [activeSlug, setActiveSlug] = useState<SidebarSlug>(defaultSlug);
  const [pageData, setPageData] = useState(defaultData);

  const handleSelect = async (slug: SidebarSlug) => {
    if (slug === activeSlug) return;

    setActiveSlug(slug);
    const data = await getPages({ slug });
    setPageData(data);
  };

  return (
    <>
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <ExpandButton />
        <button
          type="button"
          aria-label="Contact"
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
          onClick={() => handleSelect("client")}
        >
          Client
        </button>
      </header>
      <section className="relative flex flex-col justify-start gap-12 p-margin h-[calc(100%_-_var(--headerH))] overflow-hidden">
        <Content defaultData={pageData} />
      </section>
    </>
  );
}
