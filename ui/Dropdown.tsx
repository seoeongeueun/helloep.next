"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { tagsQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: tags = [] } = useQuery(tagsQueries.all());

  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 선택된 year 값
  const selectedYear = searchParams.get("year");

  const handleTagSelect = (tagName: string) => {
    console.log(tagName);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", tagName);
    params.delete("page"); // 페이지 리셋
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("year");
    params.delete("page");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  // 태그 이름을 내림차순으로 정렬
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => b.name.localeCompare(a.name));
  }, [tags]);

  // 외부 영역 클릭 시 드롭다운 닫기
  const handleClickOutside = (event: PointerEvent) => {
    if (!(event.target as HTMLElement).closest(".dropdown-wrapper")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative dropdown-wrapper">
      <button
        className="dropdown border-b border-b-gray w-full flex flex-row justify-between items-center h-full"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-white pointer-events-none">
          {selectedYear || "Year"}
        </span>
        <div className="flex items-center gap-2">
          <Image
            src="/icons/icon_arrow.svg"
            alt="드롭다운"
            aria-hidden="true"
            className={`${isOpen ? "rotate-180" : ""} transition-transform duration-150 w-4 h-4`}
            width={16}
            height={16}
          />
        </div>
      </button>
      <ul
        className={`absolute w-full bg-secondary px-margin-s max-h-40 overflow-auto border-b border-b-gray z-20 ${isOpen ? "open pointer-events-auto" : "closed pointer-events-none"}`}
      >
        <li
          onClick={handleClearSelection}
          className={`hover:bg-selected cursor-pointer py-2 ${!selectedYear ? "bg-selected text-white" : ""}`}
        >
          Year
        </li>

        {sortedTags.map((tag) => (
          <li
            key={tag.name}
            className={`hover:bg-selected cursor-pointer py-2 ${selectedYear === tag.name ? "bg-selected text-white" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTagSelect(tag.name);
            }}
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
