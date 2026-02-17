"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { postsQueries } from "@/query/postsQuery";

export function Results() {
  const { data } = useQuery(postsQueries.list());

  return (
    <div className="flex flex-row items-center justify-between w-full border-b border-b-gray py-1">
      <span className="text-gray">{data?.totalCount ?? 0} results</span>
      <button
        type="button"
        aria-label="검색 결과 초기화"
        className="flex flex-row items-center text-white! hover:text-gray!"
      >
        Reset
        <Image
          src="/icons/icon_reset.svg"
          alt="초기화"
          aria-hidden="true"
          className="ml-1 w-fit h-auto"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
}
