"use client";

import { Dropdown, Results } from "./index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/context/AppStateContext";

export function SearchBar() {
  const router = useRouter();
  const { setViewMode, viewMode } = useAppState();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // 검색어가 바뀌면 페이지는 리셋

    if (searchInput.trim()) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(`/`); // 모든 검색어 및 필터 초기화
  };

  // params가 있는지 확인
  const hasParams = searchParams.toString().length > 0;

  return (
    <div className="flex flex-row justify-between gap-4 text-s">
      <form
        className="flex flex-row-reverse gap-spacing-4 tablet:flex-row tablet:bg-secondary border-b border-gray tablet:px-margin py-2 w-full tablet:w-1/2"
        role="search"
        aria-label="검색"
        onSubmit={handleSearch}
        id="search-filter"
      >
        <div className="flex tablet:hidden flex-row items-center ml-auto gap-spacing-10">
          {hasParams && (
            <button
              type="button"
              aria-label="검색 결과 초기화"
              className="flex flex-rowitems-center text-white! hover:text-gray! h-full"
              onClick={handleReset}
            >
              <Image
                src="/icons/icon_reset.svg"
                alt="초기화"
                aria-hidden="true"
                className="h-full w-auto p-1"
                width={32}
                height={32}
              />
            </button>
          )}
          <button
            type="button"
            aria-label={
              viewMode === "list" ? "이미지 뷰로 변경" : "목록 뷰로 변경"
            }
            className="flex flex-row items-center justify-end justify-self-end"
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          >
            <Image
              src={
                viewMode === "list"
                  ? "/icons/icon_grid.svg"
                  : "/icons/icon_hamburger.svg"
              }
              alt={viewMode === "list" ? "그리드 아이콘" : "햄버거 아이콘"}
              aria-hidden="true"
              width={24}
              height={24}
              className="h-full w-auto"
            />
          </button>
        </div>
        <label htmlFor="site-search" className="sr-only">
          검색어 입력
        </label>
        <input
          id="site-search"
          type="search"
          placeholder="Search"
          className="flex-1 focus:ml-margin transtion-[margin] duration-150"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" aria-label="검색 버튼">
          <Image
            src="/icons/icon_search.svg"
            alt="검색"
            aria-hidden="true"
            width={12}
            height={12}
          />
        </button>
      </form>
      <div className="hidden tablet:flex flex-row w-1/2 gap-4 ">
        <Dropdown />
        <Results />
      </div>
    </div>
  );
}
