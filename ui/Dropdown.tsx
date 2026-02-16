"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

//TODO: 임시로 하드코딩한 드롭다운 필터 값 => 추후 API 연동 시 동적으로 렌더링하도록 수정 필요
const dropdownOptions: { value: string; label: string }[] = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
];

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

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
        {dropdownOptions.map((option) => (
          <li key={option.value} className="hover:bg-selected cursor-pointer">
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
