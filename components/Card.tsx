import { WPPost } from "@/types";
import { Tag } from "@/ui";
import Image from "next/image";
import { useMemo } from "react";
import { categoriesQueries, postsQueries } from "@/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppState } from "@/context/AppStateContext";
import { parseWpPostDetail } from "@/lib";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter, useSearchParams } from "next/navigation";

interface CardProps {
  post: WPPost;
}

export default function Card({ post }: CardProps) {
  const { data: categories } = useQuery(categoriesQueries.all());
  const { selectProject, language } = useAppState();
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();

  const router = useRouter();
  const searchParams = useSearchParams();

  // post의 카테고리 id로 카테고리 데이터를 찾아서 카테고리 배열을 재생성
  const categoryInfos = useMemo(() => {
    if (!categories || !post.categories) return [];

    return post.categories.map((catId) =>
      categories.find((cat) => cat.id === catId),
    );
  }, [categories, post.categories]);

  const handleProjectSelect = () => {
    // 이미 데이터를 가지고 있기 때문에 파싱 후 바로 query에 추가해서 네트워크 요청을 스킵한다
    const parsed = parseWpPostDetail(post);
    queryClient.setQueryData(postsQueries.detail(post.id).queryKey, parsed);
    selectProject(post.id);

    //모바일은 클릭시 상세페이지로 이동
    if (isMobile) {
      const params = new URLSearchParams(searchParams.toString());
      router.push(`/${post.id}?${params.toString()}`);
    }
  };

  //TODO: 반응형 수정 필요
  return (
    <article
      className="grow h-auto tablet:max-w-[calc(50%-1rem)] flex flex-col items-start justify-end gap-spacing-3 relative after:absolute after:inset-0 after:bg-black/50 after:z-30 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-200 after:pointer-events-none cursor-pointer"
      onClick={handleProjectSelect}
    >
      {post.jetpack_featured_media_url && (
        <figure className="w-full">
          <Image
            src={post.jetpack_featured_media_url ?? ""}
            alt="프로젝트 썸네일"
            className="w-full h-auto object-contain"
            width={230}
            height={230}
          />
        </figure>
      )}
      <figcaption className="w-full h-fit wrap-break-word space-y-spacing-3 font-pretendard">
        <h3 className="text-s">
          {language === "ko"
            ? post.title_ko
            : post.title_en || post.title.rendered}
        </h3>
        <ul className="flex flex-wrap gap-spacing-3">
          {categoryInfos.map((cat, i) => (
            <Tag key={i} color={cat?.color || ""} label={cat?.name || ""} />
          ))}
        </ul>
      </figcaption>
    </article>
  );
}
