"use client";

import Card from "./Card";
import List from "./List";
import { SearchBar } from "@/ui";
import { WPPost } from "@/types";
import type { ViewMode } from "@/types";
import { postsQueries } from "@/query";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import clsx from "clsx";

export default function CardList({ viewMode }: { viewMode: ViewMode }) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { data, isLoading, isError } = useQuery(postsQueries.list(currentPage));

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
          "flex flex-wrap w-full",
          {
            "gap-x-spacing-10 py-[5rem]": viewMode === "grid",
          },
          {
            "gap-y-spacing-10 grid-cols-1 phone_large:grid-cols-2 tablet:grid-cols-4":
              isLoading,
          },
          { grid: viewMode === "grid" },
        )}
      >
        {isLoading ? renderSkeleton() : renderPosts()}
      </section>
      <Pagination maxPage={data?.totalPages ?? 1} />
    </main>
  );
}
