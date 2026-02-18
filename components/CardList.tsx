"use client";

import { useEffect } from "react";
import Card from "./Card";
import List from "./List";
import { SearchBar, Results } from "@/ui";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import clsx from "clsx";
import { useActivePostsQuery } from "@/hooks/useActivePostsQuery";
import type { WPPost } from "@/types";
import { useAppState } from "@/context/AppStateContext";
import { twMerge } from "tailwind-merge";

export default function CardList() {
  const { viewMode } = useAppState();
  const searchParams = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { postsQuery, activeCategoryId } = useActivePostsQuery();
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
    <main className="relative tablet:top-30 px-margin flex flex-col">
      <div className="hidden tablet:block">
        <SearchBar />
      </div>
      <div className="w-full block tablet:hidden">
        <Results />
      </div>
      <section
        className={twMerge(
          clsx(
            "flex flex-wrap w-full gap-spacing-10",
            viewMode === "grid" ? "tablet:py-20" : "py-0",
            {
              "grid-cols-1 phone_large:grid-cols-2 tablet:grid-cols-4":
                isLoading,
            },
            {
              "grid grid-cols-2 tablet:flex tablet:flex-wrap gap-spacing-10 ":
                viewMode === "grid",
            },
          ),
        )}
      >
        {isLoading ? renderSkeleton() : renderPosts()}
      </section>
      <Pagination maxPage={data?.totalPages ?? 1} />
    </main>
  );
}
