import Card from "./Card";
import { SearchBar } from "@/ui";
import { getPosts } from "@/actions/posts";
import { WPPost } from "@/types";

export default async function CardList() {
  const posts = await getPosts(10, 1);
  console.log(posts);

  return (
    <main className="relative top-30 px-margin flex flex-col">
      <SearchBar />
      <section className="flex flex-wrap gap-x-spacing-10 space-y-spacing-40 py-[5rem] w-full">
        {posts.map((post: WPPost, i) => (
          <Card key={i} post={post} />
        ))}
      </section>
    </main>
  );
}
