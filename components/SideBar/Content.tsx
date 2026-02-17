"use client";
import Caption from "./Caption";
import Figures from "./Figures";
import { useAppState } from "@/context/AppStateContext";

//TODO: 타입 수정 필요!
export default function Content({ defaultData }: { defaultData?: any }) {
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
                  <h2 className="uppercase text-start">{section.title}</h2>
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
