import { WPPost } from "@/types";
import { stripHtmlTags } from "@/lib";

interface CardProps {
  post: WPPost;
}

//TODO: 카테고리 ID를 실제 카테고리 이름과 매핑하는 로직 필요
export default function List({ post }: CardProps) {
  return (
    <article className="w-full flex flex-row items-start justify-between gap-spacing-10 hover:bg-secondary border-b border-gray transtion-colors duration-200 cursor-pointer">
      <h3 className="w-1/2 py-spacing-6 border-none!">{post.title.rendered}</h3>
      <div className="w-1/2 flex flex-row gap-spacing-10 *:w-full *:py-spacing-6">
        <time>{post.year}</time>
        <p className="break-keep">{stripHtmlTags(post.excerpt.rendered)}</p>
      </div>
    </article>
  );
}
