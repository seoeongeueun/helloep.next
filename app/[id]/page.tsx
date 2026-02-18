import { notFound } from "next/navigation";
import { getPostById } from "@/actions";
import Figures from "@/components/SideBar/Figures";
import PostDetailSelector from "./PostDetailSelector";

type PostDetailPageProps = {
  params: Promise<{ id?: string }>;
};

//TODO: 동적 metadata 설정하기

//서버사이드로 유지해서 seo 최적화
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await getPostById(postId);

  if (!post) return notFound();

  //ssr 이후 클라이언트에서 상태 업데이트를 위해 PostDetailSelector 컴포넌트를 추가한다
  return (
    <div className="flex flex-col border-r border-px border-gray w-full h-full overflow-y-auto">
      <Figures initialData={post} />
      <PostDetailSelector postId={postId} />
    </div>
  );
}
