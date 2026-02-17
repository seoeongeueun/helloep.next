"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppStateContext";

export function Header() {
  const { language, setLanguage } = useAppState();

  return (
    <header className="sticky top-0 shrink-0 font-inter text-gray text-m px-margin h-headerH border-b border-px border-gray z-50 bg-black">
      <nav
        className="flex flex-row justify-between items-center h-full"
        aria-label="Primary"
      >
        <Link
          href="/"
          aria-label="홈 페이지"
          className="group uppercase text-white! relative [&>span]:transition-opacity [&>span]:duration-150 [&>span]:group-hover:delay-100"
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

        <a href="mailto:hello@everyday-practice.com" aria-label="이메일 보내기">
          hello@everyday-practice.com
        </a>
      </nav>
    </header>
  );
}
