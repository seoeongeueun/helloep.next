import { WPPost } from "@/types";
import { stripHtmlTags } from "@/lib";

interface CardProps {
  post: WPPost;
}

//TODO: 카테고리 ID를 실제 카테고리 이름과 매핑하는 로직 필요
export default function List({ post }: CardProps) {
  return (
    <article className="w-full flex flex-row items-center justify-between gap-spacing-10 hover:bg-secondary transtion-colors duration-200 cursor-pointer">
      <span className="w-1/2 py-spacing-6 border-b border-gray">
        {post.title.rendered}
      </span>
      <div className="w-1/2 flex flex-row gap-spacing-10 *:border-b *:w-full *:border-gray *:py-spacing-6 ">
        <span>{post.tags[0]}</span>
        <span className="overflow-hidden truncate">
          {stripHtmlTags(post.excerpt.rendered)}
        </span>
      </div>
    </article>
  );
}
