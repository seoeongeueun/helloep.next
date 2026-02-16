import { Dropdown, Results } from "./index";
import Image from "next/image";

export function SearchBar() {
  return (
    <div className="flex flex-row justify-between gap-4">
      <form
        className="flex flex-row bg-secondary border-b border-gray px-margin py-2 w-1/2"
        role="search"
        aria-label="검색"
      >
        <label htmlFor="site-search" className="sr-only">
          검색어 입력
        </label>
        <input
          id="site-search"
          type="search"
          placeholder="Search"
          className="flex-1 focus:ml-margin transtion-[margin] duration-150"
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
