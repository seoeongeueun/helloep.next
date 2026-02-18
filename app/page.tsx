import CardList from "@/components/CardList";
import { Filters, FiltersMobile } from "@/ui";
import { Suspense } from "react";

// useSearchParams 사용으로 인해 dynamic 렌더링 필요
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div
      id="main-scroll"
      className="flex flex-col border-r border-px border-gray w-full h-full overflow-y-auto"
    >
      <Suspense
        fallback={
          <main className="relative top-30 px-margin flex flex-col">
            <div className="grid grid-cols-1 phone_large:grid-cols-2 tablet:grid-cols-4 gap-spacing-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-secondary animate-pulse text-transparent w-full h-[50vh]"
                >
                  <p aria-hidden="true">filler</p>
                </div>
              ))}
            </div>
          </main>
        }
      >
        <Filters />
        <FiltersMobile />
        <CardList />
      </Suspense>
    </div>
  );
}
