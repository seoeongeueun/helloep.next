"use client";

import Image from "next/image";
import { useAppState } from "@/context/AppStateContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

//사이드바 확장 버튼
export function ExpandButton() {
  const { selectedProjectId } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!selectedProjectId) return null;

  const isDetailPage = /^\/\d+$/.test(pathname ?? "");

  //기존 params를 유지하면서 목록/상세 페이지로 전환
  const handleClick = () => {
    const params = searchParams.toString();
    const queryString = params ? `?${params}` : "";
    const targetPath = isDetailPage ? "/" : `/${selectedProjectId}`;
    router.push(`${targetPath}${queryString}`);
  };

  return (
    <button
      type="button"
      aria-label={isDetailPage ? "목록으로 돌아가기" : "전체 화면으로 보기"}
      onClick={handleClick}
      className="flex flex-row items-center w-[4rem] h-[4rem] mr-auto"
    >
      <Image
        src={
          isDetailPage
            ? "/icons/icon_full_contract.svg"
            : "/icons/icon_full_expand.svg"
        }
        alt={isDetailPage ? "contract" : "expand"}
        width={24}
        height={24}
        className="w-fit aspect-square"
      />
    </button>
  );
}
