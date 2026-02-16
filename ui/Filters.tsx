"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueries } from "@/query/categoriesQuery";
import { useState } from "react";

export function Filters() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { data: categories = [] } = useQuery(categoriesQueries.all());

  const handleCategoryClick = (categoryId: number | null) => {
    //TODO: 필터링 로직 추가 필요
    setActiveCategory(categoryId);
  };

  return (
    <nav
      className="sticky top-headerH font-inter px-margin py-2 backdrop-blur-[2px] bg-black-80 text-m flex flex-row itmes-start justify-between z-50"
      aria-label="필터"
    >
      <ul className="flex flex-wrap gap-x-4" aria-label="필터 목록">
        <li>
          <button
            type="button"
            className={activeCategory === null ? "active" : ""}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={activeCategory === category.id ? "active" : ""}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
      <div
        role="group"
        aria-label="정렬 옵션"
        className="shrink-0 w-[5.6rem] tablet:w-[8.6rem]"
      >
        <button
          type="button"
          className="flex flex-row items-center justify-end justify-self-end"
        >
          <Image
            src="/icons/icon_list.svg"
            alt="리스트 아이콘"
            aria-hidden="true"
            width={16}
            height={16}
          />
          <span className="ml-px">list</span>
        </button>
      </div>
    </nav>
  );
}
