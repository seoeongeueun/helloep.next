"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueries } from "@/query/categoriesQuery";
import { useAppState } from "@/context/AppStateContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Filters() {
  const { data: categories = [] } = useQuery(categoriesQueries.all());
  const { setViewMode, viewMode } = useAppState();

  // 현재 URL에서 쿼리 파라미터를 읽어서 현재 선택된 카테고리를 결정
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("category");

  const handleCategoryClick = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // 카테고리 바꾸면 page는 리셋
    params.delete("page");

    if (categoryName === null) {
      params.delete("category");
    } else {
      params.set("category", categoryName.toLowerCase());
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url);
  };

  return (
    <nav
      className="sticky top-0 font-inter px-margin py-2 backdrop-blur-[2px] bg-black-80 text-m flex flex-row itmes-start justify-between z-50"
      aria-label="필터"
    >
      <ul className="flex flex-wrap gap-x-4" aria-label="필터 목록">
        <li>
          <button
            type="button"
            className={currentFilter === null ? "active" : ""}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={
                currentFilter === category.name.toLowerCase() ? "active" : ""
              }
              onClick={() => handleCategoryClick(category.name)}
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
          aria-label={
            viewMode === "list" ? "이미지 뷰로 변경" : "목록 뷰로 변경"
          }
          className="flex flex-row items-center justify-end justify-self-end"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        >
          <Image
            src="/icons/icon_list.svg"
            alt="리스트 아이콘"
            aria-hidden="true"
            width={16}
            height={16}
          />
          <span className="ml-px">{viewMode === "list" ? "img" : "list"}</span>
        </button>
      </div>
    </nav>
  );
}
