import { WPPost } from "@/types";
import { Tag } from "@/ui";
import Image from "next/image";

interface CardProps {
  post: WPPost;
}

//TODO: 카테고리 ID를 실제 카테고리 이름과 매핑하는 로직 필요
export default function Card({ post }: CardProps) {
  return (
    <article className="grow h-auto flex flex-col items-start justify-end gap-spacing-3 relative after:absolute after:inset-0 after:bg-black/50 after:z-30 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-200 after:pointer-events-none cursor-pointer">
      <figure className="w-full">
        <Image
          src={post.jetpack_featured_media_url ?? ""}
          alt="프로젝트 썸네일"
          className="w-full h-auto object-contain"
          width={230}
          height={230}
        />
      </figure>
      <figcaption className="w-full h-fit wrap-break-word space-y-spacing-3 font-pretendard">
        <h3 className="text-s">{post.title.rendered}</h3>
        <ul className="flex flex-wrap gap-spacing-3">
          <Tag color="#FF5733" label="Graphic" />
          <Tag color="#33C1FF" label="Space" />
        </ul>
      </figcaption>
    </article>
  );
}
