"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Image from "next/image";
import { tagsQueries, categoriesQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

type DropdownMode = "year" | "category";

interface DropdownProps {
  mode?: DropdownMode;
}

export const Dropdown = memo(function Dropdown({
  mode = "year",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // mode에 따라 다른 데이터 fetch
  const { data: tags = [] } = useQuery({
    ...tagsQueries.all(),
    enabled: mode === "year",
  });
  const { data: categories = [] } = useQuery({
    ...categoriesQueries.all(),
    enabled: mode === "category",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // mode에 따라 다른 선택 값 가져오기
  const selectedValue = searchParams.get(mode === "year" ? "year" : "category");

  // mode에 따라 적절한 데이터 사용
  const data = mode === "year" ? tags : categories;

  const handleItemSelect = (itemName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = mode === "year" ? "year" : "category";
    params.set(paramKey, itemName);
    params.delete("page"); // 페이지 리셋
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = mode === "year" ? "year" : "category";
    params.delete(paramKey);
    params.delete("page");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  // 데이터를 이름으로 내림차순 정렬
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.name.localeCompare(a.name));
  }, [data]);

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
        <span className="text-gray text-s tablet:text-white pointer-events-none">
          {selectedValue || (mode === "year" ? "Year" : "All")}
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
        className={twMerge(
          "absolute w-full bg-secondary transition-opacity px-margin-s max-h-40 overflow-auto border-b border-b-gray z-20",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <li
          onClick={handleClearSelection}
          className={`hover:bg-selected cursor-pointer py-2 ${!selectedValue ? "bg-selected text-white" : ""}`}
        >
          {mode === "year" ? "Year" : "Category"}
        </li>

        {sortedData.map((item) => (
          <li
            key={item.name}
            className={`hover:bg-selected cursor-pointer py-2 ${selectedValue === item.name ? "bg-selected text-white" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleItemSelect(item.name);
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
});
