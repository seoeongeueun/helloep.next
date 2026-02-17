"use client";

import Image from "next/image";
import { useAppState } from "@/context/AppStateContext";

//사이드바 확장 버튼
export function ExpandButton() {
  const { selectedProjectId } = useAppState();

  if (!selectedProjectId) return null;

  return (
    <button
      type="button"
      aria-label="전체 화면으로 보기"
      className="flex flex-row items-center w-[4rem] h-[4rem] mr-auto"
    >
      <Image
        src="/icons/icon_full_expand.svg"
        alt="expand"
        width={24}
        height={24}
        className="w-fit aspect-square"
      />
    </button>
  );
}
