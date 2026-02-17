import { getPages } from "@/actions";
import SideBarClient from "./SideBarClient";

// 먼저 ssr로 렌더 (client side compnent도 props는 받을 수 있기 때문)
export default async function SideBar() {
  const pageData = await getPages({ slug: "cv" });

  return (
    <aside className="sticky top-0 font-normal min-w-[40rem] w-[29%] border-l border-px border-gray">
      <SideBarClient defaultData={pageData} defaultSlug="cv" />
    </aside>
  );
}
