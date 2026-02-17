"use client";

import { Dropdown, Results } from "./index";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

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

  return (
    <div className="flex flex-row justify-between gap-4">
      <form
        className="flex flex-row bg-secondary border-b border-gray px-margin py-2 w-1/2"
        role="search"
        aria-label="검색"
        onSubmit={handleSearch}
      >
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
      <div className="flex flex-row w-1/2 gap-4 ">
        <Dropdown />
        <Results />
      </div>
    </div>
  );
}
