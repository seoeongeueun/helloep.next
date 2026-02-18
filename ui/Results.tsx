"use client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useActivePostsQuery } from "@/hooks/useActivePostsQuery";
import { useRouter } from "next/navigation";

export function Results() {
  // postsQuery는 현재 URL의 검색 파라미터에 따라 활성화된 게시물 쿼리를 반환하는 커스텀 훅에서 가져온다
  const { postsQuery } = useActivePostsQuery();
  const { data } = useQuery(postsQuery);
  const router = useRouter();

  const handleReset = () => {
    router.push("/"); // 루트 경로로 이동하여 모든 쿼리 파라미터 제거
  };

  return (
    <div className="flex flex-row items-center justify-between w-full border-b border-b-gray tablet:py-1">
      <span className="flex items-center text-gray ml-auto tablet:ml-0 text-xs tablet:text-s h-[3.6rem] tablet:h-fit">
        {data?.totalCount ?? 0} results
      </span>
      <button
        type="button"
        aria-label="검색 결과 초기화"
        className="hidden tablet:flex flex-row items-center text-white! hover:text-gray!"
        onClick={handleReset}
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
