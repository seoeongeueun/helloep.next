import Card from "./Card";
import List from "./List";
import { SearchBar } from "@/ui";
import { getPosts } from "@/actions/posts";
import { WPPost } from "@/types";
import type { ViewMode } from "@/types";

//TODO: 페이지네이션 적용 필요
export default async function CardList({ viewMode }: { viewMode: ViewMode }) {
  const posts = await getPosts(10, 1);
  console.log("Fetched posts:", posts);

  return (
    <main className="relative top-30 px-margin flex flex-col">
      <SearchBar />
      <section
        className={`flex flex-wrap ${viewMode === "grid" ? "gap-x-spacing-10 py-[5rem]" : ""} w-full`}
      >
        {posts.map((post: WPPost, i) =>
          viewMode === "grid" ? (
            <Card key={i} post={post} />
          ) : (
            <List key={i} post={post} />
          ),
        )}
      </section>
    </main>
  );
}
