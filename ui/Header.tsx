"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppStateContext";
import { useSidebar } from "@/context/SidebarContext";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Header() {
  const { language, setLanguage, selectPage } = useAppState();
  const { toggleSidebar, closeSidebar, isOpen } = useSidebar();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isDetailPage = /^\/\d+$/.test(pathname ?? "");

  const toggleMobileSidebar = () => {
    toggleSidebar();
    //상세 페이지인 경우 params을 유지한 채로 홈 화면으로 리다이렉트
    if (isDetailPage) {
      selectPage("contact");
      router.push(`/?${searchParams.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 border-r shrink-0 font-inter text-gray text-m desktop:px-margin h-headerH border-b border-px border-gray z-50 bg-black">
      <nav
        className="flex flex-row justify-between items-center h-full"
        aria-label="Primary"
      >
        <Link
          href="/"
          aria-label="홈 페이지"
          className="px-margin desktop:px-0 group uppercase text-white! relative [&>span]:transition-opacity [&>span]:duration-150 [&>span]:group-hover:delay-100"
        >
          <span className="group-hover:opacity-0">EVERYDAY PRACTICE</span>
          <span className="inset-0 absolute opacity-0 group-hover:opacity-100">
            일상의실천
          </span>
        </Link>

        <div
          className="gap-1 flex flex-row items-center"
          aria-label="언어 변경"
        >
          <button
            type="button"
            className={language === "ko" ? "active" : ""}
            onClick={() => setLanguage("ko")}
          >
            Kor
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            Eng
          </button>
        </div>

        <a
          href="mailto:hello@everyday-practice.com"
          aria-label="이메일 보내기"
          className="hidden desktop:block"
        >
          hello@everyday-practice.com
        </a>
        <button
          type="button"
          className="block desktop:hidden relative inset-0 w-spacing-40 h-spacing-40 -right-spacing-40 z-50 cursor-pointer"
          onClick={toggleMobileSidebar}
        >
          <span
            className={clsx(
              "absolute top-1/2 left-1/2 transition-transform w-spacing-20 h-px -translate-x-1/2 -translate-y-1/2 bg-[white] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-px before:h-spacing-20 before:bg-[white] before:-translate-x-1/2 before:-translate-y-1/2",
              { "rotate-45": isOpen },
            )}
          ></span>
        </button>
      </nav>
    </header>
  );
}
