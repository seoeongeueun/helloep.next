"use client";
import { useSidebar } from "@/context/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import { pagesQueries } from "@/query";
import { useAppState } from "@/context/AppStateContext";
import { clsx } from "clsx";
import Content from "./Content";
import { twMerge } from "tailwind-merge";

//csr버전 사이드바 (모바일용)
export default function SideBarMobile() {
  const { isOpen } = useSidebar();
  const { activeSlug, selectPage } = useAppState();

  const { data: pageData } = useQuery(
    pagesQueries.bySlug(activeSlug ?? "contact"),
  );

  return (
    <aside
      className={twMerge(
        "block desktop:hidden fixed left-0 w-[calc(100%-4rem)] border-r border-gray desktop:w-[29%] z-50 bg-black h-full",
        isOpen ? "animate-slideInHorizontal" : "animate-slideOutHorizontal",
      )}
    >
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <button
          type="button"
          aria-label="Contact"
          className={activeSlug === "contact" ? "active" : undefined}
          onClick={() => selectPage("contact")}
        >
          Contact
        </button>
        <button
          type="button"
          aria-label="CV"
          className={activeSlug === "cv" ? "active" : undefined}
          onClick={() => selectPage("cv")}
        >
          CV
        </button>
        <button
          type="button"
          aria-label="Client"
          className={activeSlug === "client" ? "active" : undefined}
          onClick={() => selectPage("client")}
        >
          Client
        </button>
      </header>
      <section
        className={clsx(
          "relative flex flex-col justify-start gap-12 p-margin h-[calc(100%-var(--headerH))] overflow-hidden",
          { "overflow-y-auto": activeSlug === "client" },
        )}
      >
        <Content defaultData={pageData} />
      </section>
    </aside>
  );
}
