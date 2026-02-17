"use client";

import { useEffect, useMemo } from "react";
import Card from "./Card";
import List from "./List";
import { SearchBar } from "@/ui";
import { WPPost } from "@/types";
import type { ViewMode, PostListResponse } from "@/types";
import { postsQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import clsx from "clsx";
import { categoriesQueries } from "@/query";

export default function CardList({ viewMode }: { viewMode: ViewMode }) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  // url의 카테고리 params를 텍스트로 유지하기 위해서 query를 보내기 전에 카테고리 명으로 id를 찾아서 보내는 과정을 거친다
  const categoryParam = searchParams.get("category");
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery(
    categoriesQueries.all(),
  );
  const activeCategoryId =
    categories.find(
      (cat) => cat.name.toLowerCase() === categoryParam?.toLowerCase(),
    )?.id ?? null;

  // categoryParam이 있는데 categories가 아직 로드 중이면 쿼리를 비활성화
  const shouldEnableQuery = !categoryParam || !isCategoriesLoading;

  // postsQuery는 현재 페이지와 선택된 카테고리에 따라 적절한 쿼리를 선택하여 게시글 데이터를 가져오는 역할을 한다
  const postsQuery = useMemo(() => {
    const query =
      activeCategoryId === null
        ? postsQueries.list(currentPage)
        : postsQueries.category(activeCategoryId, currentPage);
    return {
      ...query,
      enabled: shouldEnableQuery,
    } as UseQueryOptions<
      PostListResponse,
      Error,
      PostListResponse,
      readonly unknown[]
    >;
  }, [currentPage, activeCategoryId, shouldEnableQuery]);

  const { data, isLoading, isError } = useQuery(postsQuery);

  useEffect(() => {
    requestAnimationFrame(() => {
      const scrollContainer = document.getElementById("main-scroll");
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [currentPage, activeCategoryId]);

  const renderSkeleton = () => {
    const skeletonItems = Array.from({ length: 10 }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className={
          viewMode === "list"
            ? "py-2 bg-secondary animate-pulse text-transparent w-full border-b border-gray"
            : "bg-secondary animate-pulse text-transparent w-full h-[50vh]"
        }
      >
        <p aria-hidden="true">filler</p>
      </div>
    ));
    return skeletonItems;
  };

  const renderPosts = () => {
    if (!data?.posts || data.posts.length === 0) {
      return (
        <p className="text-center w-full mt-10 text-gray text-m">
          게시글이 없습니다
        </p>
      );
    }

    return data.posts.map((post: WPPost) =>
      viewMode === "grid" ? (
        <Card key={post.id} post={post} />
      ) : (
        <List key={post.id} post={post} />
      ),
    );
  };

  if (isError) {
    return (
      <main className="relative top-30 px-margin flex flex-col">
        <SearchBar />
        <div className="text-center mt-10 text-gray text-m">
          목록을 불러올 수 없습니다
        </div>
      </main>
    );
  }

  return (
    <main className="relative top-30 px-margin flex flex-col">
      <SearchBar />
      <section
        className={clsx(
          "flex flex-wrap w-full py-20 gap-spacing-10",
          {
            "grid-cols-1 phone_large:grid-cols-2 tablet:grid-cols-4": isLoading,
          },
          { "grid gap-spacing-10 ": viewMode === "grid" && isLoading },
        )}
      >
        {isLoading ? renderSkeleton() : renderPosts()}
      </section>
      <Pagination maxPage={data?.totalPages ?? 1} />
    </main>
  );
}
