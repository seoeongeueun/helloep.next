"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { tagsQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: tags = [] } = useQuery(tagsQueries.all());

  // 태그 이름을 내림차순으로 정렬
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => b.name.localeCompare(a.name));
  }, [tags]);

  // 외부 영역 클릭 시 드롭다운 닫기
  const handleClickOutside = (event: PointerEvent) => {
    if (!(event.target as HTMLElement).closest(".dropdown")) {
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
    <div className="w-full relative">
      <button
        className="dropdown border-b border-b-gray w-full flex flex-row justify-between items-center h-full"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-white pointer-events-none">Year</span>
        <Image
          src="/icons/icon_arrow.svg"
          alt="드롭다운"
          aria-hidden="true"
          className={`${isOpen ? "rotate-180" : ""} transition-transform duration-150 w-4 h-4`}
          width={16}
          height={16}
        />
      </button>
      <ul
        className={`absolute w-full bg-secondary px-margin-s max-h-40 overflow-auto border-b border-b-gray z-20 ${isOpen ? "open pointer-events-auto" : "closed pointer-events-none"}`}
      >
        {sortedTags.map((tag) => (
          <li key={tag.name} className="hover:bg-selected cursor-pointer py-2">
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
