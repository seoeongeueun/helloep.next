import Image from "next/image";

//TODO: 임시로 하드코딩 필터링 => 나중에 api로 받아올 예정
const filters: { name: string; value: string }[] = [
  { name: "All", value: "all" },
  { name: "Graphic", value: "graphic" },
  { name: "Editorial", value: "editorial" },
  { name: "Website", value: "website" },
];

export function Filters() {
  return (
    <nav
      className="sticky top-headerH px-margin py-2 backdrop-blur-[2px] bg-black-80 text-m flex flex-row itmes-start justify-between z-50"
      aria-label="필터"
    >
      <ul className="flex flex-wrap gap-x-4" aria-label="필터 목록">
        {filters.map((filter) => (
          <li key={filter.value}>
            <button
              type="button"
              className={`${filter.value === "all" ? "active" : ""}`}
            >
              {filter.name}
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
