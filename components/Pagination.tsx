"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

// 최대 페이지 수를 받아와서 렌더링
type PaginationProps = {
  maxPage: number;
};

// 번호 또는 생략 표시로 구성
type PageItem = number | "ellipsis";

const createPageItems = (currentPage: number, maxPage: number): PageItem[] => {
  // 페이지 수가 7 이하인 경우 모든 페이지 번호 표시
  if (maxPage <= 7) {
    return Array.from({ length: maxPage }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", maxPage];
  }

  if (currentPage >= maxPage - 3) {
    return [
      1,
      "ellipsis",
      maxPage - 4,
      maxPage - 3,
      maxPage - 2,
      maxPage - 1,
      maxPage,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    maxPage,
  ];
};

export default function Pagination({ maxPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    maxPage,
  );

  const pageItems = useMemo(
    () => createPageItems(currentPage, maxPage),
    [currentPage, maxPage],
  );

  // 페이지가 1개 이하인 경우 페이지네이션 표시하지 않음
  if (maxPage <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    // 유효하지 않은 페이지 번호이거나 현재 페이지와 동일한 경우 무시
    if (page < 1 || page > maxPage || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    // 페이지 번호가 1이면 굳이 쿼리 파라미터를 남기지 않음
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url);
  };

  return (
    <nav
      className="flex flex-row items-center justify-center gap-2 py-6"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className={clsx(
          "px-spacing-8 rounded-md transition-colors duration-200 hover:bg-secondary h-full",
          currentPage === 1 ? "hidden" : "block",
        )}
      >
        <Image
          src="/icons/icon_arrow.svg"
          alt="이전 페이지"
          width={12}
          height={12}
          className="rotate-90"
        />
      </button>
      {pageItems.map((item, index) =>
        item === "ellipsis" ? (
          <span
            aria-hidden="true"
            key={`ellipsis-${index}`}
            className="text-white px-1"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${item}`}
            type="button"
            onClick={() => handlePageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={clsx(
              "px-spacing-8 rounded-md transition-colors duration-200",
              item === currentPage
                ? "bg-transparent text-white!"
                : "bg-selected text-white! hover:bg-secondary",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === maxPage}
        aria-label="다음 페이지"
        className={clsx(
          "px-spacing-8 rounded-md transition-colors duration-200 hover:bg-secondary h-full",
          currentPage === maxPage ? "hidden" : "block",
        )}
      >
        <Image
          src="/icons/icon_arrow.svg"
          alt="다음 페이지"
          width={12}
          height={12}
          className="-rotate-90"
        />
      </button>
    </nav>
  );
}
