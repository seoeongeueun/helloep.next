import { getPages } from "@/actions";
import SideBarContent from "./SideBarContent";
import SideBarHeader from "./SideBarHeader";
import SideBarMobile from "./SideBarMobile";

// 먼저 ssr로 렌더 (client side compnent도 props는 받을 수 있기 때문)
export default async function SideBar() {
  const pageData = await getPages({ slug: "contact" });

  return (
    <>
      {/* 데스크톱용 사이드바 */}
      <aside className="hidden desktop:flex flex-col fixed left-0 w-[calc(100%-4rem)] border-r border-gray desktop:w-[29%] z-50 bg-black h-full desktop:sticky top-0 font-normal min-w-[40rem]  border-l border-px">
        <SideBarHeader />
        <SideBarContent data={pageData} />
      </aside>
      {/* 모바일용 사이드바 */}
      <SideBarMobile />
    </>
  );
}
