"use client";
import { Suspense } from "react";
import { ExpandButton } from "@/ui";
import { useAppState } from "@/context/AppStateContext";
import { useSidebar } from "@/context/SidebarContext";

export default function SideBarHeader() {
  const { activeSlug, selectPage } = useAppState();
  const { isMobile } = useSidebar();

  return (
    <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
      {!isMobile && (
        <Suspense fallback={null}>
          <ExpandButton />
        </Suspense>
      )}
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
  );
}
