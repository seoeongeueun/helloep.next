import { Tag } from "@/ui";
import Image from "next/image";

export default function Card() {
  //TODO: API 연동 후 랜덤 썸네일 제거
  const thumbnailSuffix = Math.random() > 0.5 ? "2" : "";

  return (
    <article className="w-full h-fit flex flex-col items-start justify-start gap-spacing-3 relative after:absolute after:inset-0 after:bg-black/50 after:z-30 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-200 after:pointer-events-none cursor-pointer">
      <figure className="w-full">
        <Image
          src={`/assets/sample_thumbnail${thumbnailSuffix}.png`}
          alt="프로젝트 썸네일"
          className="w-full h-auto object-contain"
          width={230}
          height={230}
        />
      </figure>
      <figcaption className="w-full h-fit wrap-break-word space-y-spacing-3 font-pretendard">
        <h3 className="text-s">프로젝트 제목 프로젝트 제목 프로젝트 제목</h3>
        <ul className="flex flex-wrap gap-spacing-3">
          <Tag color="#FF5733" label="Graphic" />
          <Tag color="#33C1FF" label="Space" />
        </ul>
      </figcaption>
    </article>
  );
}
