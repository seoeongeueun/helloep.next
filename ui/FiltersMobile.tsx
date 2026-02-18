import { Dropdown, SearchBar } from "./index";

export function FiltersMobile() {
  return (
    <nav
      className="flex tablet:hidden sticky top-0 font-inter px-margin backdrop-blur-[2px] bg-black-80 text-m flex-col z-50"
      aria-label="필터"
    >
      <SearchBar />
      <div className="flex flex-row gap-spacing-10 h-[3.6rem] text-s">
        <Dropdown mode="category" />
        <Dropdown mode="year" />
      </div>
    </nav>
  );
}
