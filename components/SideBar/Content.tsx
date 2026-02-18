"use client";
import Caption from "./Caption";
import Figures from "./Figures";
import { useAppState } from "@/context/AppStateContext";
import type { WPPage } from "@/types";
import clsx from "clsx";

export default function Content({ defaultData }: { defaultData?: WPPage }) {
  const { selectedProjectId } = useAppState();

  // selectedProjectId가 있으면 선택된 프로젝트, 없으면 기본 CV 데이터 표시
  if (selectedProjectId) {
    return (
      <>
        <Figures />
        <Caption />
      </>
    );
  } else if (defaultData) {
    // client 페이지는 통으로 보여주기
    if (defaultData.slug === "client") {
      // HTML을 텍스트로 변환해서 안전하게 렌더링
      const textContent =
        defaultData.content?.rendered
          ?.replace(/<[^>]*>/g, "") // HTML 태그 제거
          ?.split("\n") // 줄바꿈으로 분리
          ?.filter((line: string) => line.trim()) || []; // 빈 줄 제거

      return (
        <>
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
        </>
      );
    }

    // 그 외는 tableSections으로 보여주기
    return (
      <>
        {defaultData?.tableSections?.map((section) => (
          <table
            key={section.title}
            className="flex flex-col gap-spacing-10 w-full border-collapse"
          >
            <thead>
              <tr>
                <th colSpan={2}>
                  <h2
                    className={clsx("uppercase text-start", {
                      "border-none!": defaultData?.slug === "contact",
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
      </>
    );
  }

  return null;
}
