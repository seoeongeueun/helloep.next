import type { SidebarSlug, WPPage } from "@/types";
import clsx from "clsx";

type SideBarContentProps = {
  data: WPPage;
  slug: SidebarSlug;
};

/**
 * seo를 위해 기본 소개는 ssr로 처리한다
 * props로 초기 서버 데이터를 받아서 단순히 노출만 하는 컴포넌트
 */
export default function StaticPageContent({ data, slug }: SideBarContentProps) {
  // client 페이지는 특별한 처리
  if (slug === "client") {
    const textContent =
      data.content?.rendered
        ?.replace(/<[^>]*>/g, "") // HTML 태그 제거
        ?.split("\n") // 줄바꿈으로 분리
        ?.filter((line: string) => line.trim()) || []; // 빈 줄 제거

    return (
      <section className="relative flex flex-col justify-start gap-12 p-margin h-[calc(100%-var(--headerH))] overflow-y-auto">
        <h2 aria-label="Client" className="uppercase text-start">
          Client
        </h2>
        <div className="grid grid-cols-2 desktop_large:grid-cols-3 gap-x-spacing-6 text-start">
          {textContent.map((line: string, index: number) => (
            <p key={index} className="whitespace-pre-line">
              {line.trim()}
            </p>
          ))}
        </div>
      </section>
    );
  }

  // 그 외 contact와 cv 등 table 형식인 페이지
  return (
    <section className="relative flex flex-col justify-start gap-12 p-margin h-[calc(100%-var(--headerH))] overflow-hidden">
      {data?.tableSections?.map((section) => (
        <table
          key={section.title}
          className="flex flex-col gap-spacing-10 w-full border-collapse"
        >
          <thead>
            <tr>
              <th colSpan={2}>
                <h2
                  className={clsx("uppercase text-start", {
                    "border-none!": data?.slug === "contact",
                  })}
                >
                  {section.title}
                </h2>
              </th>
            </tr>
          </thead>
          <tbody>
            {section.items?.map((item, index) => (
              <tr key={index} className="text-start align-top">
                <td className="pr-spacing-20">{item.year}</td>
                <td>{item.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </section>
  );
}
