import dynamic from "next/dynamic";
import { ExpandButton } from "@/ui";
import { getPages } from "@/actions";

const DynamicContent = dynamic(() => import("./Content"), {
  ssr: true,
});

// 기본 정보 (현재는 cv 정보)로 ssr 처리를 먼저 하고, 선택된 프로젝트 id가 있을 때 csr로 데이터 렌더
export default async function SideBar() {
  const pageData = await getPages({ slug: "cv" });

  return (
    <aside className="sticky top-0 font-normal min-w-[40rem] w-[29%] border-l border-px border-gray">
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <ExpandButton />
        <button type="button" aria-label="Contact">
          Contact
        </button>
        <button type="button" aria-label="CV" className="active">
          CV
        </button>
        <button type="button" aria-label="Client">
          Client
        </button>
      </header>
      <section className="relative flex flex-col justify-start gap-12 p-margin h-[calc(100%_-_var(--headerH))] overflow-hidden">
        <DynamicContent defaultData={pageData} />
      </section>
    </aside>
  );
}
